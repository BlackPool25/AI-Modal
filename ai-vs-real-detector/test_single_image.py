#!/usr/bin/env python3
"""
Test a single image with the deployed Modal API
"""
import requests
import base64
import json
import sys
from pathlib import Path

API_URL = "https://blackpool25--ai-vs-real-detector-fastapi-app.modal.run"

def test_image(image_path: str):
    """Test prediction with a specific image"""
    
    if not Path(image_path).exists():
        print(f"❌ Error: Image not found: {image_path}")
        return
    
    print(f"\n{'='*60}")
    print(f"Testing Image: {image_path}")
    print(f"{'='*60}\n")
    
    # Read and encode image
    with open(image_path, "rb") as f:
        image_bytes = f.read()
        image_base64 = base64.b64encode(image_bytes).decode()
    
    file_size = len(image_bytes) / 1024
    print(f"📁 File size: {file_size:.2f} KB")
    
    # Test via /predict endpoint
    print("\n🔍 Testing /predict endpoint...")
    payload = {
        "image": image_base64,
        "return_all_scores": True
    }
    
    response = requests.post(f"{API_URL}/predict", json=payload)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {response.status_code} OK\n")
        print(f"📊 Prediction Results:")
        print(f"   Top Prediction: {result['top_prediction']}")
        print(f"   Confidence: {result['confidence']*100:.2f}%\n")
        print(f"   All Scores:")
        for pred in result['predictions']:
            bar = "█" * int(pred['score'] * 50)
            print(f"     {pred['label']:6s} {pred['score']*100:6.2f}% {bar}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"   {response.text}")
    
    # Test via /predict/upload endpoint
    print(f"\n🔍 Testing /predict/upload endpoint...")
    with open(image_path, "rb") as f:
        files = {"file": (Path(image_path).name, f, "image/jpeg")}
        response = requests.post(f"{API_URL}/predict/upload", files=files)
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ Status: {response.status_code} OK\n")
        print(f"📊 Prediction Results:")
        print(f"   Filename: {result['filename']}")
        print(f"   Top Prediction: {result['top_prediction']}")
        print(f"   Confidence: {result['confidence']*100:.2f}%\n")
        print(f"   All Scores:")
        for pred in result['predictions']:
            bar = "█" * int(pred['score'] * 50)
            print(f"     {pred['label']:6s} {pred['score']*100:6.2f}% {bar}")
    else:
        print(f"❌ Error: {response.status_code}")
        print(f"   {response.text}")
    
    print(f"\n{'='*60}\n")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
    else:
        image_path = "test_image.jpg"
    
    test_image(image_path)
