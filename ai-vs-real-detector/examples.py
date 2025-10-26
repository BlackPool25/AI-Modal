"""
Example usage scripts for the AI vs Real Image Detector
Shows different ways to use the model for inference
"""

# ============================================================================
# Example 1: Using Hugging Face Inference API (Easiest - No Installation)
# ============================================================================

def example_inference_api():
    """Use the hosted Inference API"""
    import requests
    import base64
    
    API_URL = "https://api-inference.huggingface.co/models/shreyas-joshi/ai-vs-real-detector"
    headers = {"Authorization": "Bearer YOUR_HF_TOKEN_HERE"}
    
    # Read and encode image
    with open("test_image.jpg", "rb") as f:
        img_bytes = f.read()
        img_base64 = base64.b64encode(img_bytes).decode()
    
    # Send request
    response = requests.post(API_URL, headers=headers, json={"inputs": img_base64})
    
    if response.status_code == 200:
        result = response.json()
        print("Predictions:")
        for pred in result:
            print(f"  {pred['label']}: {pred['score']*100:.2f}%")
    else:
        print(f"Error: {response.status_code}")
        print(response.json())


# ============================================================================
# Example 2: Local Inference with model_utils (Recommended)
# ============================================================================

def example_local_with_utils():
    """Download and run locally using provided utilities"""
    from huggingface_hub import hf_hub_download
    import torch
    from PIL import Image
    from model_utils import load_model_from_checkpoint, create_preprocessing_transform
    
    # Download model files (cached after first download)
    print("Downloading model...")
    model_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "pytorch_model.bin")
    config_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "config.json")
    
    # Load model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Loading model on {device}...")
    model, metadata = load_model_from_checkpoint(model_path, config_path, device=device)
    
    # Prepare preprocessing
    transform = create_preprocessing_transform(metadata)
    
    # Load and preprocess image
    image = Image.open("test_image.jpg").convert("RGB")
    tensor = transform(image).unsqueeze(0).to(device)
    
    # Run inference
    with torch.no_grad():
        logits = model(tensor)
        probs = torch.softmax(logits, dim=1).cpu().squeeze(0)
    
    # Display results
    print("\nPredictions:")
    idx_to_class = metadata['idx_to_class']
    for idx, prob in enumerate(probs.tolist()):
        label = idx_to_class[idx]
        print(f"  {label.upper()}: {prob*100:.2f}%")
    
    # Get top prediction
    top_idx = probs.argmax().item()
    top_label = idx_to_class[top_idx]
    top_score = probs[top_idx].item()
    
    print(f"\n🎯 Prediction: {top_label.upper()} ({top_score*100:.1f}% confidence)")


# ============================================================================
# Example 3: Batch Processing Multiple Images
# ============================================================================

def example_batch_processing():
    """Process multiple images efficiently"""
    from huggingface_hub import hf_hub_download
    import torch
    from PIL import Image
    from model_utils import load_model_from_checkpoint, create_preprocessing_transform
    import os
    
    # Setup
    model_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "pytorch_model.bin")
    config_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "config.json")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    model, metadata = load_model_from_checkpoint(model_path, config_path, device=device)
    transform = create_preprocessing_transform(metadata)
    
    # Image folder
    image_folder = "images_to_classify"
    image_files = [f for f in os.listdir(image_folder) if f.endswith(('.jpg', '.png', '.jpeg'))]
    
    results = []
    
    print(f"Processing {len(image_files)} images...")
    for img_file in image_files:
        img_path = os.path.join(image_folder, img_file)
        
        # Load and preprocess
        image = Image.open(img_path).convert("RGB")
        tensor = transform(image).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            probs = torch.softmax(model(tensor), dim=1).cpu().squeeze(0)
        
        # Store result
        top_idx = probs.argmax().item()
        results.append({
            'filename': img_file,
            'prediction': metadata['idx_to_class'][top_idx],
            'confidence': probs[top_idx].item(),
            'ai_score': probs[0].item(),
            'real_score': probs[1].item()
        })
    
    # Summary
    print("\nResults:")
    for r in results:
        print(f"  {r['filename']:30s} → {r['prediction'].upper():4s} ({r['confidence']*100:.1f}%)")
    
    # Statistics
    ai_count = sum(1 for r in results if r['prediction'] == 'ai')
    real_count = len(results) - ai_count
    print(f"\n📊 Summary: {ai_count} AI-generated, {real_count} real images")
    
    return results


# ============================================================================
# Example 4: Direct Loading (Advanced Users)
# ============================================================================

def example_direct_loading():
    """Load model directly without utilities"""
    import torch
    import timm
    from torchvision import transforms
    from PIL import Image
    from huggingface_hub import hf_hub_download
    import json
    
    # Download files
    checkpoint_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "pytorch_model.bin")
    config_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "config.json")
    
    # Load config
    with open(config_path, 'r') as f:
        config = json.load(f)
    
    # Create model architecture
    model = timm.create_model(
        config['architecture'],
        pretrained=False,
        num_classes=config['num_classes'],
        drop_rate=config['drop_rate'],
        drop_path_rate=config['drop_path_rate']
    )
    
    # Load checkpoint and handle 'model.' or 'module.' prefix
    checkpoint = torch.load(checkpoint_path, map_location='cpu', weights_only=False)
    state_dict = checkpoint.get('model_state_dict', checkpoint)
    
    # Remove 'model.' prefix from AIDetectorModel wrapper or 'module.' from DataParallel
    filtered_state = {}
    for k, v in state_dict.items():
        key = k
        if k.startswith('model.'):
            key = k.replace('model.', '', 1)
        elif k.startswith('module.'):
            key = k.replace('module.', '', 1)
        
        if key in model.state_dict() and model.state_dict()[key].shape == v.shape:
            filtered_state[key] = v
    
    model.load_state_dict(filtered_state, strict=False)
    model.eval()
    
    # Preprocessing
    transform = transforms.Compose([
        transforms.Resize((config['image_size'], config['image_size'])),
        transforms.ToTensor(),
        transforms.Normalize(mean=config['mean'], std=config['std'])
    ])
    
    # Inference
    image = Image.open("test_image.jpg").convert("RGB")
    tensor = transform(image).unsqueeze(0)
    
    with torch.no_grad():
        probs = torch.softmax(model(tensor), dim=1).squeeze(0)
    
    # Results (class 0='ai', class 1='real')
    print(f"AI: {probs[0]*100:.1f}%")
    print(f"REAL: {probs[1]*100:.1f}%")


# ============================================================================
# Example 5: Integration with Gradio UI
# ============================================================================

def example_gradio_ui():
    """Create a simple web UI with Gradio"""
    import gradio as gr
    from huggingface_hub import hf_hub_download
    import torch
    from PIL import Image
    from model_utils import load_model_from_checkpoint, create_preprocessing_transform
    
    # Load model once at startup
    print("Loading model...")
    model_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "pytorch_model.bin")
    config_path = hf_hub_download("shreyas-joshi/ai-vs-real-detector", "config.json")
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    model, metadata = load_model_from_checkpoint(model_path, config_path, device=device)
    transform = create_preprocessing_transform(metadata)
    
    def predict(image):
        """Predict function for Gradio"""
        # Preprocess
        tensor = transform(image).unsqueeze(0).to(device)
        
        # Predict
        with torch.no_grad():
            probs = torch.softmax(model(tensor), dim=1).cpu().squeeze(0)
        
        # Format results for Gradio
        return {
            metadata['idx_to_class'][0].upper(): float(probs[0]),
            metadata['idx_to_class'][1].upper(): float(probs[1])
        }
    
    # Create interface
    interface = gr.Interface(
        fn=predict,
        inputs=gr.Image(type="pil"),
        outputs=gr.Label(num_top_classes=2),
        title="AI vs Real Image Detector",
        description="Upload an image to detect if it's AI-generated or real",
        examples=["example1.jpg", "example2.jpg"]
    )
    
    interface.launch()


# ============================================================================
# Run Examples
# ============================================================================

if __name__ == "__main__":
    import sys
    
    print("AI vs Real Image Detector - Usage Examples")
    print("=" * 60)
    
    if len(sys.argv) < 2:
        print("Usage: python examples.py <example_number>")
        print("\nAvailable examples:")
        print("  1 - Inference API (requires HF token)")
        print("  2 - Local inference with utils (recommended)")
        print("  3 - Batch processing")
        print("  4 - Direct loading (advanced)")
        print("  5 - Gradio UI")
        sys.exit(1)
    
    example_num = sys.argv[1]
    
    if example_num == "1":
        example_inference_api()
    elif example_num == "2":
        example_local_with_utils()
    elif example_num == "3":
        example_batch_processing()
    elif example_num == "4":
        example_direct_loading()
    elif example_num == "5":
        example_gradio_ui()
    else:
        print(f"Unknown example: {example_num}")
        sys.exit(1)
