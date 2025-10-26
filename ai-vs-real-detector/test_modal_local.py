"""
Quick test script to verify Modal app works locally
"""
import base64
import modal

# Import the app
from modal_app import AIDetectorModel, app

# Create a simple test
def test_prediction():
    # Create a test image (1x1 red pixel)
    from PIL import Image
    import io
    
    # Create test image
    img = Image.new('RGB', (100, 100), color='red')
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    image_bytes = buffer.getvalue()
    image_base64 = base64.b64encode(image_bytes).decode()
    
    print("🧪 Testing AI Detector Model...")
    print(f"✓ Test image created ({len(image_base64)} bytes base64)")
    
    # Test with Modal
    with app.run():
        model = AIDetectorModel()
        print("✓ Model instance created")
        
        # Test health check
        health = model.health_check.remote()
        print(f"✓ Health check: {health}")
        
        # Test prediction
        print("\n🔍 Running prediction...")
        result = model.predict.remote(image_base64)
        print(f"✓ Prediction result: {result}")
        
        if result and isinstance(result, list) and len(result) > 0:
            if "error" in result[0]:
                print(f"❌ Error in prediction: {result[0]['error']}")
                return False
            else:
                print(f"\n✅ Success!")
                print(f"   Top prediction: {result[0]['label']}")
                print(f"   Confidence: {result[0]['score']*100:.1f}%")
                return True
        else:
            print(f"❌ Unexpected result format: {result}")
            return False

if __name__ == "__main__":
    success = test_prediction()
    exit(0 if success else 1)
