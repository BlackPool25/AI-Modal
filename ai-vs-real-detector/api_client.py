"""
Example client library for interacting with the Modal API
Can be used in Vercel, Supabase Edge Functions, or any Python application
"""
import requests
import base64
from typing import Dict, List, Optional, Union
from pathlib import Path
import io
from PIL import Image


class AIDetectorClient:
    """
    Client for the AI vs Real Image Detector Modal API
    
    Usage:
        client = AIDetectorClient("https://your-app.modal.run")
        result = client.predict_file("image.jpg")
        print(f"Prediction: {result['top_prediction']} ({result['confidence']*100}%)")
    """
    
    def __init__(self, api_url: str, api_key: Optional[str] = None):
        """
        Initialize the client
        
        Args:
            api_url: Base URL of your Modal API endpoint
            api_key: Optional API key for authentication
        """
        self.api_url = api_url.rstrip("/")
        self.api_key = api_key
        self.headers = {}
        
        if api_key:
            self.headers["Authorization"] = f"Bearer {api_key}"
    
    def _encode_image(self, image: Union[str, Path, bytes, Image.Image]) -> str:
        """
        Encode image to base64 string
        
        Args:
            image: File path, bytes, or PIL Image
            
        Returns:
            Base64 encoded string
        """
        if isinstance(image, (str, Path)):
            # Read from file
            with open(image, "rb") as f:
                image_bytes = f.read()
        elif isinstance(image, bytes):
            image_bytes = image
        elif isinstance(image, Image.Image):
            # Convert PIL Image to bytes
            buffer = io.BytesIO()
            image.save(buffer, format="PNG")
            image_bytes = buffer.getvalue()
        else:
            raise ValueError(f"Unsupported image type: {type(image)}")
        
        return base64.b64encode(image_bytes).decode()
    
    def predict(
        self, 
        image_base64: str, 
        return_all_scores: bool = True
    ) -> Dict:
        """
        Predict from base64 encoded image
        
        Args:
            image_base64: Base64 encoded image string
            return_all_scores: Whether to return all class scores
            
        Returns:
            Prediction result dictionary
        """
        response = requests.post(
            f"{self.api_url}/predict",
            headers={**self.headers, "Content-Type": "application/json"},
            json={
                "image": image_base64,
                "return_all_scores": return_all_scores
            }
        )
        response.raise_for_status()
        return response.json()
    
    def predict_file(
        self, 
        image_path: Union[str, Path],
        return_all_scores: bool = True
    ) -> Dict:
        """
        Predict from image file
        
        Args:
            image_path: Path to image file
            return_all_scores: Whether to return all class scores
            
        Returns:
            Prediction result dictionary
        """
        image_base64 = self._encode_image(image_path)
        return self.predict(image_base64, return_all_scores)
    
    def predict_upload(self, image_path: Union[str, Path]) -> Dict:
        """
        Predict by uploading image file
        
        Args:
            image_path: Path to image file
            
        Returns:
            Prediction result dictionary
        """
        with open(image_path, "rb") as f:
            files = {"file": f}
            response = requests.post(
                f"{self.api_url}/predict/upload",
                headers=self.headers,
                files=files
            )
        response.raise_for_status()
        return response.json()
    
    def predict_batch(
        self, 
        images: List[Union[str, Path, bytes, Image.Image]]
    ) -> Dict:
        """
        Predict multiple images in one request
        
        Args:
            images: List of image paths, bytes, or PIL Images
            
        Returns:
            Batch prediction results
        """
        encoded_images = [self._encode_image(img) for img in images]
        
        response = requests.post(
            f"{self.api_url}/predict/batch",
            headers={**self.headers, "Content-Type": "application/json"},
            json={"images": encoded_images}
        )
        response.raise_for_status()
        return response.json()
    
    def health_check(self) -> Dict:
        """
        Check API health status
        
        Returns:
            Health status dictionary
        """
        response = requests.get(
            f"{self.api_url}/health",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()
    
    def get_info(self) -> Dict:
        """
        Get API information
        
        Returns:
            API info dictionary
        """
        response = requests.get(
            f"{self.api_url}/",
            headers=self.headers
        )
        response.raise_for_status()
        return response.json()


# ============================================================================
# Example Usage
# ============================================================================

def example_single_prediction():
    """Example: Predict single image"""
    client = AIDetectorClient("https://your-app.modal.run")
    
    result = client.predict_file("test_image.jpg")
    
    print("📊 Prediction Results:")
    print(f"  Verdict: {result['top_prediction']}")
    print(f"  Confidence: {result['confidence']*100:.1f}%")
    print("\n  All scores:")
    for pred in result['predictions']:
        print(f"    {pred['label']}: {pred['score']*100:.2f}%")


def example_batch_prediction():
    """Example: Predict multiple images"""
    client = AIDetectorClient("https://your-app.modal.run")
    
    images = ["image1.jpg", "image2.jpg", "image3.jpg"]
    results = client.predict_batch(images)
    
    print("📊 Batch Prediction Results:")
    for i, result in enumerate(results['results']):
        print(f"\n  Image {i+1}:")
        print(f"    Verdict: {result['top_prediction']}")
        print(f"    Confidence: {result['confidence']*100:.1f}%")


def example_with_pil():
    """Example: Predict from PIL Image"""
    from PIL import Image
    
    client = AIDetectorClient("https://your-app.modal.run")
    
    # Open and process image
    image = Image.open("test_image.jpg")
    image = image.resize((224, 224))
    
    # Predict
    image_base64 = client._encode_image(image)
    result = client.predict(image_base64)
    
    print(f"Prediction: {result['top_prediction']}")


def example_health_check():
    """Example: Check API health"""
    client = AIDetectorClient("https://your-app.modal.run")
    
    health = client.health_check()
    print("🏥 Health Status:")
    print(f"  Status: {health['status']}")
    print(f"  Device: {health['device']}")
    print(f"  CUDA Available: {health['cuda_available']}")


if __name__ == "__main__":
    # Run examples
    print("Testing AI Detector API Client\n")
    
    try:
        example_health_check()
        print("\n" + "="*50 + "\n")
        example_single_prediction()
    except Exception as e:
        print(f"Error: {e}")
        print("\nMake sure to:")
        print("1. Update API URL in examples")
        print("2. Deploy your Modal app")
        print("3. Have test images available")
