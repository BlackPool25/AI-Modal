#!/usr/bin/env python3
"""
Test script to verify model loading and inference works correctly
Tests both local loading and handler initialization
"""
import os
import sys
import torch
from PIL import Image
import io

# Test the handler
def test_handler():
    """Test the EndpointHandler class"""
    print("=" * 60)
    print("Testing EndpointHandler")
    print("=" * 60)
    
    try:
        from handler import EndpointHandler
        
        # Get current directory (should be the repo root)
        repo_path = os.path.dirname(os.path.abspath(__file__))
        
        # Initialize handler
        handler = EndpointHandler(path=repo_path)
        
        # Create a dummy test image
        test_image = Image.new('RGB', (224, 224), color='red')
        
        # Convert to bytes for base64 test
        img_byte_arr = io.BytesIO()
        test_image.save(img_byte_arr, format='PNG')
        img_byte_arr = img_byte_arr.getvalue()
        
        import base64
        img_base64 = base64.b64encode(img_byte_arr).decode()
        
        # Test inference with base64
        print("\n" + "=" * 60)
        print("Testing inference with base64 input")
        print("=" * 60)
        result = handler({"inputs": img_base64})
        print("Result:", result)
        
        # Verify result format
        assert isinstance(result, list), "Result should be a list"
        assert len(result) == 2, "Should have 2 classes"
        assert all('label' in r and 'score' in r for r in result), "Each result should have label and score"
        
        # Check probabilities sum to ~1.0
        total_prob = sum(r['score'] for r in result)
        assert 0.99 < total_prob < 1.01, f"Probabilities should sum to 1.0, got {total_prob}"
        
        print("\n✅ Handler test PASSED!")
        return True
        
    except Exception as e:
        print(f"\n❌ Handler test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_model_utils():
    """Test the model_utils loading functions"""
    print("\n" + "=" * 60)
    print("Testing model_utils.py")
    print("=" * 60)
    
    try:
        from model_utils import load_model_from_checkpoint, create_preprocessing_transform
        
        repo_path = os.path.dirname(os.path.abspath(__file__))
        checkpoint_path = os.path.join(repo_path, "pytorch_model.bin")
        config_path = os.path.join(repo_path, "config.json")
        
        # Check files exist
        if not os.path.exists(checkpoint_path):
            print(f"⚠ Checkpoint not found at {checkpoint_path}")
            print("  Skipping model_utils test")
            return None
        
        # Load model
        device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model, metadata = load_model_from_checkpoint(
            checkpoint_path, 
            config_path, 
            device=device,
            verbose=True
        )
        
        # Verify metadata
        assert 'idx_to_class' in metadata, "Metadata should contain idx_to_class"
        print(f"\nMetadata: {metadata}")
        
        # Test inference
        print("\n" + "=" * 60)
        print("Testing inference with model_utils")
        print("=" * 60)
        
        transform = create_preprocessing_transform(metadata)
        test_image = Image.new('RGB', (224, 224), color='blue')
        tensor = transform(test_image).unsqueeze(0).to(device)
        
        with torch.no_grad():
            logits = model(tensor)
            probs = torch.softmax(logits, dim=1).cpu().squeeze(0)
        
        print(f"\nPredictions:")
        for idx, prob in enumerate(probs.tolist()):
            label = metadata['idx_to_class'][idx]
            print(f"  {label.upper()}: {prob*100:.2f}%")
        
        print("\n✅ model_utils test PASSED!")
        return True
        
    except Exception as e:
        print(f"\n❌ model_utils test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_direct_loading():
    """Test direct model loading without utilities"""
    print("\n" + "=" * 60)
    print("Testing direct timm loading")
    print("=" * 60)
    
    try:
        import timm
        import json
        
        repo_path = os.path.dirname(os.path.abspath(__file__))
        checkpoint_path = os.path.join(repo_path, "pytorch_model.bin")
        config_path = os.path.join(repo_path, "config.json")
        
        if not os.path.exists(checkpoint_path):
            print("⚠ Checkpoint not found, skipping")
            return None
        
        # Load config
        with open(config_path, 'r') as f:
            config = json.load(f)
        
        # Create model
        model = timm.create_model(
            config['architecture'],
            pretrained=False,
            num_classes=config['num_classes'],
            drop_rate=config['drop_rate'],
            drop_path_rate=config['drop_path_rate']
        )
        
        # Load checkpoint
        checkpoint = torch.load(checkpoint_path, map_location='cpu', weights_only=False)
        state_dict = checkpoint.get('model_state_dict', checkpoint)
        
        # Count keys before filtering
        print(f"Checkpoint has {len(state_dict)} keys")
        print(f"Model expects {len(model.state_dict())} keys")
        
        # Filter with model. prefix handling (checkpoint uses AIDetectorModel wrapper)
        model_state = model.state_dict()
        filtered_state = {}
        for k, v in state_dict.items():
            # Remove 'model.' or 'module.' prefix
            key = k
            if k.startswith('model.'):
                key = k.replace('model.', '', 1)
            elif k.startswith('module.'):
                key = k.replace('module.', '', 1)
            
            if key in model_state and model_state[key].shape == v.shape:
                filtered_state[key] = v
        
        print(f"Filtered to {len(filtered_state)} matching keys")
        
        missing, unexpected = model.load_state_dict(filtered_state, strict=False)
        print(f"Missing: {len(missing)}, Unexpected: {len(unexpected)}")
        
        if len(filtered_state) == 0:
            print("❌ No weights loaded!")
            return False
        
        # Test forward pass
        model.eval()
        with torch.no_grad():
            dummy = torch.randn(1, 3, 224, 224)
            output = model(dummy)
        
        print(f"Output shape: {output.shape}")
        assert output.shape == (1, 2), f"Expected (1, 2), got {output.shape}"
        
        print("\n✅ Direct loading test PASSED!")
        return True
        
    except Exception as e:
        print(f"\n❌ Direct loading test FAILED: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("🧪 AI vs Real Detector - Model Loading Test Suite")
    print("=" * 60)
    
    results = []
    
    # Run all tests
    results.append(("Handler", test_handler()))
    results.append(("Model Utils", test_model_utils()))
    results.append(("Direct Loading", test_direct_loading()))
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    for name, result in results:
        if result is True:
            status = "✅ PASS"
        elif result is False:
            status = "❌ FAIL"
        else:
            status = "⊘ SKIP"
        print(f"{name:20s}: {status}")
    
    # Overall result
    failed = sum(1 for _, r in results if r is False)
    passed = sum(1 for _, r in results if r is True)
    
    print("\n" + "=" * 60)
    if failed == 0:
        print("✅ ALL TESTS PASSED!")
        sys.exit(0)
    else:
        print(f"❌ {failed} test(s) failed, {passed} passed")
        sys.exit(1)
