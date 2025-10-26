"""
Modal deployment for AI vs Real Image Detector
Hosts the PyTorch model with T4 GPU support and provides REST API endpoints
"""
import modal
from typing import Dict, List, Any

# Define the Modal app
app = modal.App("ai-vs-real-detector")

# Create the container image with all dependencies
image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "torch>=2.0.0",
        "timm>=0.9.0", 
        "torchvision>=0.15.0",
        "pillow>=9.0.0",
        "fastapi>=0.104.0",
        "pydantic>=2.0.0",
        "huggingface_hub>=0.20.0",
        "python-multipart>=0.0.6",
    )
)


@app.cls(
    image=image,
    gpu="T4",  # NVIDIA T4 GPU
    scaledown_window=300,  # Keep container warm for 5 minutes
    timeout=600,  # Max execution time
)
class AIDetectorModel:
    """
    Modal class for AI vs Real Image Detection
    Uses EfficientFormerV2 with T4 GPU acceleration
    """
    
    @modal.enter()
    def load_model(self):
        """
        Load model on container startup (runs once)
        This ensures the model is ready for inference
        """
        import torch
        import timm
        import json
        from torchvision import transforms
        from pathlib import Path
        
        print("🚀 Initializing AI Detector Model...")
        
        # Download model files from the Modal asset
        # For now, we'll use HuggingFace Hub to download
        try:
            from huggingface_hub import hf_hub_download
            
            model_path = hf_hub_download(
                "shreyas-joshi/ai-vs-real-detector",
                "pytorch_model.bin"
            )
            config_path = hf_hub_download(
                "shreyas-joshi/ai-vs-real-detector", 
                "config.json"
            )
            
            print(f"✓ Downloaded model from HuggingFace")
            
        except Exception as e:
            print(f"⚠ Could not download from HF: {e}")
            print("  Trying local files...")
            model_path = "pytorch_model.bin"
            config_path = "config.json"
        
        # Load config
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        # Set device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Create model architecture
        self.model = timm.create_model(
            self.config.get("architecture", "efficientformerv2_s1"),
            pretrained=False,
            num_classes=self.config.get("num_classes", 2),
            drop_rate=self.config.get("drop_rate", 0.2),
            drop_path_rate=self.config.get("drop_path_rate", 0.1)
        )
        
        # Load checkpoint
        checkpoint = torch.load(model_path, map_location=self.device, weights_only=False)
        
        if "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]
            self.idx_to_class = checkpoint.get("idx_to_class", self.config.get("idx_to_class", {0: "ai", 1: "real"}))
        else:
            state_dict = checkpoint
            self.idx_to_class = self.config.get("idx_to_class", {0: "ai", 1: "real"})
        
        # Normalize idx_to_class
        self.idx_to_class = {int(k): v for k, v in self.idx_to_class.items()}
        
        # Filter state dict
        model_state = self.model.state_dict()
        filtered_state = {}
        
        for k, v in state_dict.items():
            candidates = [k]
            if k.startswith('module.'):
                candidates.append(k.replace('module.', '', 1))
            if k.startswith('model.'):
                candidates.append(k.replace('model.', '', 1))
            
            for candidate in candidates:
                if candidate in model_state and model_state[candidate].shape == v.shape:
                    filtered_state[candidate] = v
                    break
        
        self.model.load_state_dict(filtered_state, strict=False)
        self.model.to(self.device)
        self.model.eval()
        
        # Setup transforms
        img_size = self.config.get("image_size", 224)
        mean = self.config.get("mean", [0.485, 0.456, 0.406])
        std = self.config.get("std", [0.229, 0.224, 0.225])
        
        self.transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=mean, std=std),
        ])
        
        print(f"✅ Model loaded on {self.device}")
        print(f"   Classes: {self.idx_to_class}")
    
    @modal.method()
    def predict(self, image_data: str) -> List[Dict[str, Any]]:
        """
        Run inference on a single image
        
        Args:
            image_data: Base64 encoded image string
            
        Returns:
            List of predictions with labels and scores
        """
        import torch
        import base64
        import io
        from PIL import Image
        
        try:
            # Decode base64 image
            if image_data.startswith("data:image"):
                image_data = image_data.split(",")[1]
            
            image_bytes = base64.b64decode(image_data)
            image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            
            # Transform and predict
            tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            with torch.no_grad():
                logits = self.model(tensor)
                probs = torch.softmax(logits, dim=1).cpu().squeeze(0)
            
            # Format results
            results = []
            for idx, prob in enumerate(probs.tolist()):
                label = self.idx_to_class.get(idx, f"class_{idx}")
                results.append({
                    "label": label.upper(),
                    "score": prob
                })
            
            results.sort(key=lambda x: x["score"], reverse=True)
            return results
            
        except Exception as e:
            return [{"error": f"Prediction failed: {str(e)}"}]
    
    @modal.method()
    def predict_batch(self, images: List[str]) -> List[List[Dict[str, Any]]]:
        """
        Run inference on multiple images
        
        Args:
            images: List of base64 encoded image strings
            
        Returns:
            List of prediction results for each image
        """
        results = []
        for image_data in images:
            result = self.predict(image_data)
            results.append(result)
        return results
    
    @modal.method()
    def health_check(self) -> Dict[str, str]:
        """Health check endpoint"""
        import torch
        return {
            "status": "healthy",
            "device": str(self.device),
            "cuda_available": torch.cuda.is_available(),
            "model_loaded": self.model is not None
        }


# ============================================================================
# FastAPI Web Endpoints (for Vercel/Supabase integration)
# ============================================================================

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

web_app = FastAPI(title="AI vs Real Detector API")

# Enable CORS for Vercel integration
web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure with your Vercel domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    """Request model for prediction endpoint"""
    image: str  # Base64 encoded image
    return_all_scores: bool = True


class PredictionResponse(BaseModel):
    """Response model for prediction endpoint"""
    predictions: List[Dict[str, Any]]
    top_prediction: str
    confidence: float


class BatchPredictionRequest(BaseModel):
    """Request model for batch prediction"""
    images: List[str]  # List of base64 encoded images


@web_app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "name": "AI vs Real Image Detector API",
        "version": "1.0.0",
        "description": "Detect AI-generated vs real images using EfficientFormerV2",
        "endpoints": {
            "POST /predict": "Single image prediction",
            "POST /predict/batch": "Batch image prediction",
            "POST /predict/upload": "Upload image file for prediction",
            "GET /health": "Health check"
        },
        "gpu": "NVIDIA T4",
        "model": "EfficientFormerV2-S1"
    }


@web_app.get("/health")
async def health():
    """Health check endpoint"""
    import torch
    return {
        "status": "healthy",
        "api": "online",
        "cuda_available": torch.cuda.is_available()
    }


@web_app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    """
    Predict whether an image is AI-generated or real
    
    Example request:
    ```json
    {
        "image": "base64_encoded_image_string",
        "return_all_scores": true
    }
    ```
    """
    try:
        model = AIDetectorModel()
        predictions = model.predict.remote(request.image)
        
        if predictions and "error" in predictions[0]:
            raise HTTPException(status_code=400, detail=predictions[0]["error"])
        
        # Extract top prediction
        top_pred = predictions[0]
        
        response = {
            "predictions": predictions if request.return_all_scores else [top_pred],
            "top_prediction": top_pred["label"],
            "confidence": top_pred["score"]
        }
        
        return response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@web_app.post("/predict/batch")
async def predict_batch(request: BatchPredictionRequest):
    """
    Predict multiple images in a single request
    
    Example request:
    ```json
    {
        "images": ["base64_image_1", "base64_image_2"]
    }
    ```
    """
    try:
        if len(request.images) > 10:
            raise HTTPException(
                status_code=400, 
                detail="Maximum 10 images per batch request"
            )
        
        model = AIDetectorModel()
        results = model.predict_batch.remote(request.images)
        
        # Format response
        formatted_results = []
        for predictions in results:
            if predictions and "error" in predictions[0]:
                formatted_results.append({"error": predictions[0]["error"]})
            else:
                top_pred = predictions[0]
                formatted_results.append({
                    "predictions": predictions,
                    "top_prediction": top_pred["label"],
                    "confidence": top_pred["score"]
                })
        
        return {"results": formatted_results}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@web_app.post("/predict/upload")
async def predict_upload(file: UploadFile = File(...)):
    """
    Upload an image file for prediction
    Accepts: JPEG, PNG, WebP
    """
    import base64
    
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and encode image
        image_bytes = await file.read()
        image_base64 = base64.b64encode(image_bytes).decode()
        
        # Run prediction
        model = AIDetectorModel()
        predictions = model.predict.remote(image_base64)
        
        if predictions and "error" in predictions[0]:
            raise HTTPException(status_code=400, detail=predictions[0]["error"])
        
        top_pred = predictions[0]
        
        return {
            "filename": file.filename,
            "predictions": predictions,
            "top_prediction": top_pred["label"],
            "confidence": top_pred["score"]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Deploy the FastAPI app on Modal
@app.function(image=image)
@modal.asgi_app()
def fastapi_app():
    """Expose FastAPI app as Modal ASGI app"""
    return web_app


# ============================================================================
# CLI Functions for testing
# ============================================================================

@app.local_entrypoint()
def main(image_path: str = "test_image.jpg"):
    """
    Test the model locally with Modal
    
    Usage:
        modal run modal_app.py --image-path test_image.jpg
    """
    import base64
    
    # Read and encode image
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        image_base64 = base64.b64encode(image_bytes).decode()
    
    # Run prediction
    print(f"🔍 Analyzing image: {image_path}")
    model = AIDetectorModel()
    predictions = model.predict.remote(image_base64)
    
    print("\n📊 Results:")
    for pred in predictions:
        if "error" in pred:
            print(f"❌ Error: {pred['error']}")
        else:
            print(f"  {pred['label']}: {pred['score']*100:.2f}%")
    
    # Top prediction
    if predictions and "label" in predictions[0]:
        top = predictions[0]
        print(f"\n🎯 Verdict: {top['label']} ({top['score']*100:.1f}% confidence)")
