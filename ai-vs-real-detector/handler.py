from typing import Dict, List, Any
import torch
import timm
from PIL import Image
from torchvision import transforms
import io
import base64
import json
import os


class EndpointHandler:
    """
    Custom handler for AI vs Real Image Detection using EfficientFormerV2
    Handles checkpoints with 'module.' prefix from DataParallel/DDP training
    """
    
    def __init__(self, path: str = ""):
        """
        Initialize the model when the endpoint starts
        Args:
            path: Path to the model directory
        """
        # Set device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load config if available
        config_path = os.path.join(path, "config.json") if path else "config.json"
        self.config = {}
        try:
            with open(config_path, 'r') as f:
                self.config = json.load(f)
            print(f"✓ Config loaded: {self.config}")
        except Exception as e:
            print(f"Warning: Could not load config.json: {e}")
            self.config = {
                "num_classes": 2,
                "drop_rate": 0.2,
                "drop_path_rate": 0.1,
                "idx_to_class": {"0": "ai", "1": "real"}
            }
        
        # Create model architecture
        self.model = timm.create_model(
            self.config.get("architecture", "efficientformerv2_s1"),
            pretrained=False,
            num_classes=self.config.get("num_classes", 2),
            drop_rate=self.config.get("drop_rate", 0.2),
            drop_path_rate=self.config.get("drop_path_rate", 0.1)
        )
        
        # Load checkpoint from path
        try:
            checkpoint_path = os.path.join(path, "pytorch_model.bin") if path else "pytorch_model.bin"
            checkpoint = torch.load(checkpoint_path, map_location=self.device, weights_only=False)
            
            # Handle different checkpoint formats
            if "model_state_dict" in checkpoint:
                state_dict = checkpoint["model_state_dict"]
                # Load class mapping from checkpoint if available
                self.idx_to_class = checkpoint.get("idx_to_class", self.config.get("idx_to_class", {0: "ai", 1: "real"}))
            else:
                state_dict = checkpoint
                self.idx_to_class = self.config.get("idx_to_class", {0: "ai", 1: "real"})
            
            # Normalize idx_to_class to use int keys
            self.idx_to_class = {int(k): v for k, v in self.idx_to_class.items()}
            
            # Filter state dict to match model architecture
            # Handle 'module.' prefix from DataParallel/DDP training
            model_state = self.model.state_dict()
            filtered_state = {}
            
            for k, v in state_dict.items():
                # Try multiple key transformations
                candidates = [k]
                
                # Remove 'module.' prefix (from DataParallel/DDP)
                if k.startswith('module.'):
                    candidates.append(k.replace('module.', '', 1))
                
                # Remove 'model.' prefix
                if k.startswith('model.'):
                    candidates.append(k.replace('model.', '', 1))
                
                # Try to match
                for candidate in candidates:
                    if candidate in model_state and model_state[candidate].shape == v.shape:
                        filtered_state[candidate] = v
                        break
            
            # Load weights
            missing_keys, unexpected_keys = self.model.load_state_dict(filtered_state, strict=False)
            
            print(f"✓ Model loaded: {len(filtered_state)} params loaded")
            if missing_keys:
                print(f"  ⚠ Missing keys: {len(missing_keys)}")
            if unexpected_keys:
                print(f"  ⚠ Unexpected keys: {len(unexpected_keys)}")
            
        except Exception as e:
            print(f"❌ Error loading checkpoint: {e}")
            import traceback
            traceback.print_exc()
            # Continue with random init (will give poor results)
            self.idx_to_class = self.config.get("idx_to_class", {0: "ai", 1: "real"})
            self.idx_to_class = {int(k): v for k, v in self.idx_to_class.items()}
        
        # Move model to device and set to eval mode
        self.model.to(self.device)
        self.model.eval()
        
        # Define image transformation
        img_size = self.config.get("image_size", 224)
        mean = self.config.get("mean", [0.485, 0.456, 0.406])
        std = self.config.get("std", [0.229, 0.224, 0.225])
        
        self.transform = transforms.Compose([
            transforms.Resize((img_size, img_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=mean, std=std),
        ])
        
        print(f"✓ Handler initialized on {self.device}")
        print(f"  Class mapping: {self.idx_to_class}")
    
    def __call__(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Handle inference request
        Args:
            data: Dictionary containing input data
                  Expected format: {"inputs": "<base64_image>" or PIL Image}
        Returns:
            List of predictions with labels and scores
        """
        try:
            # Extract input
            inputs = data.get("inputs")
            
            if inputs is None:
                return [{"error": "No 'inputs' key found in request"}]
            
            # Handle different input formats
            if isinstance(inputs, str):
                # Base64 encoded image
                if inputs.startswith("data:image"):
                    # Remove data URL prefix
                    inputs = inputs.split(",")[1]
                image_bytes = base64.b64decode(inputs)
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            elif isinstance(inputs, dict) and "image" in inputs:
                # Handle {"image": "<base64>"} format
                image_str = inputs["image"]
                if image_str.startswith("data:image"):
                    image_str = image_str.split(",")[1]
                image_bytes = base64.b64decode(image_str)
                image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            elif hasattr(inputs, 'read'):
                # File-like object
                image = Image.open(inputs).convert("RGB")
            else:
                # Assume it's already a PIL Image
                image = inputs.convert("RGB")
            
            # Transform image
            tensor = self.transform(image).unsqueeze(0).to(self.device)
            
            # Run inference
            with torch.no_grad():
                logits = self.model(tensor)
                probs = torch.softmax(logits, dim=1).cpu().squeeze(0)
            
            # Prepare response with proper label mapping
            results = []
            for idx, prob in enumerate(probs.tolist()):
                label = self.idx_to_class.get(idx, f"class_{idx}")
                results.append({
                    "label": label.upper(),  # Return "AI" or "REAL"
                    "score": prob
                })
            
            # Sort by score (highest first)
            results.sort(key=lambda x: x["score"], reverse=True)
            
            return results
            
        except Exception as e:
            return [{"error": f"Inference failed: {str(e)}"}]