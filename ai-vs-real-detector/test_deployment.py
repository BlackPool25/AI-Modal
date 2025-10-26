#!/usr/bin/env python3
"""
Test script for the deployed Modal API
Tests all endpoints with sample data
"""
import requests
import base64
import json
from pathlib import Path

# API URL
API_URL = "https://blackpool25--ai-vs-real-detector-fastapi-app.modal.run"

def test_root():
    """Test the root endpoint"""
    print("\n" + "="*60)
    print("Testing Root Endpoint")
    print("="*60)
    
    response = requests.get(f"{API_URL}/")
    print(f"Status Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_health():
    """Test the health endpoint"""
    print("\n" + "="*60)
    print("Testing Health Endpoint")
    print("="*60)
    
    response = requests.get(f"{API_URL}/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response:\n{json.dumps(response.json(), indent=2)}")
    return response.status_code == 200


def test_predict(image_path: str = None):
    """Test the prediction endpoint"""
    print("\n" + "="*60)
    print("Testing Prediction Endpoint")
    print("="*60)
    
    if image_path and Path(image_path).exists():
        # Use provided image
        with open(image_path, "rb") as f:
            image_bytes = f.read()
            image_base64 = base64.b64encode(image_bytes).decode()
        print(f"Using image: {image_path}")
    else:
        # Create a simple test image (1x1 red pixel)
        from PIL import Image
        import io
        
        img = Image.new('RGB', (224, 224), color='red')
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        image_bytes = buffer.getvalue()
        image_base64 = base64.b64encode(image_bytes).decode()
        print("Using synthetic test image (224x224 red)")
    
    payload = {
        "image": image_base64,
        "return_all_scores": True
    }
    
    print("Sending request...")
    response = requests.post(f"{API_URL}/predict", json=payload)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\nPrediction Results:")
        print(f"  Top Prediction: {result['top_prediction']}")
        print(f"  Confidence: {result['confidence']*100:.2f}%")
        print(f"\n  All Scores:")
        for pred in result['predictions']:
            print(f"    {pred['label']}: {pred['score']*100:.2f}%")
        return True
    else:
        print(f"Error: {response.text}")
        return False


def test_predict_upload(image_path: str = None):
    """Test the upload endpoint"""
    print("\n" + "="*60)
    print("Testing Upload Endpoint")
    print("="*60)
    
    if image_path and Path(image_path).exists():
        # Use provided image
        with open(image_path, "rb") as f:
            files = {"file": (Path(image_path).name, f, "image/jpeg")}
            print(f"Uploading image: {image_path}")
            response = requests.post(f"{API_URL}/predict/upload", files=files)
    else:
        # Create a simple test image
        from PIL import Image
        import io
        
        img = Image.new('RGB', (224, 224), color='blue')
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG')
        buffer.seek(0)
        
        files = {"file": ("test.jpg", buffer, "image/jpeg")}
        print("Uploading synthetic test image (224x224 blue)")
        response = requests.post(f"{API_URL}/predict/upload", files=files)
    
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\nPrediction Results:")
        print(f"  Filename: {result.get('filename', 'N/A')}")
        print(f"  Top Prediction: {result['top_prediction']}")
        print(f"  Confidence: {result['confidence']*100:.2f}%")
        return True
    else:
        print(f"Error: {response.text}")
        return False


def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("AI vs Real Detector - Deployment Test Suite")
    print("="*60)
    print(f"API URL: {API_URL}")
    
    results = {
        "Root": test_root(),
        "Health": test_health(),
        "Predict": test_predict(),
        "Upload": test_predict_upload()
    }
    
    # Summary
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    for test_name, passed in results.items():
        status = "✓ PASSED" if passed else "✗ FAILED"
        print(f"{test_name:20s} {status}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Deployment is working correctly.")
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Check the output above.")


if __name__ == "__main__":
    main()
