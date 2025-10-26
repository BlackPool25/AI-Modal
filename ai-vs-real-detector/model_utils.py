"""
Utility functions for safely loading the AI vs Real detector model
Handles various checkpoint formats and key prefixes
"""
import torch
import torch.nn as nn
import timm
import json
import os
from typing import Dict, Any, Tuple


def safe_load_state_dict(
    model: nn.Module, 
    state_dict: Dict[str, torch.Tensor], 
    verbose: bool = True
) -> Tuple[int, list, list]:
    """
    Safely load state_dict into model, handling various key prefix formats.
    
    Args:
        model: The target model to load weights into
        state_dict: The state dictionary from checkpoint
        verbose: Whether to print loading statistics
        
    Returns:
        Tuple of (num_loaded, missing_keys, unexpected_keys)
    """
    model_state = model.state_dict()
    filtered_state = {}
    
    for k, v in state_dict.items():
        # Try multiple key transformations to handle different checkpoint formats
        candidates = [k]
        
        # Remove 'module.' prefix (from DataParallel/DDP)
        if k.startswith('module.'):
            candidates.append(k.replace('module.', '', 1))
        
        # Remove 'model.' prefix (from wrapper classes)
        if k.startswith('model.'):
            candidates.append(k.replace('model.', '', 1))
        
        # Add 'model.' prefix if the target model uses a wrapper
        if not k.startswith('model.'):
            candidates.append(f'model.{k}')
        
        # Try to find a matching key
        matched = False
        for candidate in candidates:
            if candidate in model_state and model_state[candidate].shape == v.shape:
                filtered_state[candidate] = v
                matched = True
                break
        
        if not matched and verbose:
            # Check if it's a shape mismatch vs missing key
            for candidate in candidates:
                if candidate in model_state:
                    print(f"⚠ Shape mismatch for {candidate}: "
                          f"checkpoint={v.shape}, model={model_state[candidate].shape}")
    
    # Load the filtered state dict
    load_result = model.load_state_dict(filtered_state, strict=False)
    
    # Handle different return formats
    if isinstance(load_result, tuple):
        missing_keys, unexpected_keys = load_result
    elif hasattr(load_result, 'missing_keys'):
        missing_keys = load_result.missing_keys
        unexpected_keys = load_result.unexpected_keys
    else:
        missing_keys, unexpected_keys = [], []
    
    if verbose:
        print(f"✓ Loaded {len(filtered_state)} parameters")
        if missing_keys:
            print(f"  ⚠ Missing {len(missing_keys)} keys")
        if unexpected_keys:
            print(f"  ⚠ Unexpected {len(unexpected_keys)} keys")
    
    return len(filtered_state), list(missing_keys), list(unexpected_keys)


def load_model_from_checkpoint(
    checkpoint_path: str,
    config_path: str = None,
    device: str = 'cpu',
    verbose: bool = True
) -> Tuple[nn.Module, Dict[str, Any]]:
    """
    Load model from checkpoint with automatic config handling.
    
    Args:
        checkpoint_path: Path to the pytorch_model.bin file
        config_path: Optional path to config.json (auto-detected if None)
        device: Device to load model on ('cpu', 'cuda', or torch.device)
        verbose: Whether to print loading information
        
    Returns:
        Tuple of (model, metadata) where metadata contains class mapping and metrics
    """
    # Load config
    if config_path is None:
        config_path = os.path.join(os.path.dirname(checkpoint_path), 'config.json')
    
    config = {}
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config = json.load(f)
        if verbose:
            print(f"✓ Loaded config from {config_path}")
    else:
        if verbose:
            print(f"⚠ Config not found, using defaults")
        config = {
            "architecture": "efficientformerv2_s1",
            "num_classes": 2,
            "drop_rate": 0.2,
            "drop_path_rate": 0.1,
        }
    
    # Create model
    model = timm.create_model(
        config.get("architecture", "efficientformerv2_s1"),
        pretrained=False,
        num_classes=config.get("num_classes", 2),
        drop_rate=config.get("drop_rate", 0.2),
        drop_path_rate=config.get("drop_path_rate", 0.1)
    )
    
    # Load checkpoint
    if isinstance(device, str):
        device = torch.device(device)
    
    checkpoint = torch.load(checkpoint_path, map_location=device, weights_only=False)
    
    # Extract state dict and metadata
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        state_dict = checkpoint["model_state_dict"]
        metadata = {
            "idx_to_class": checkpoint.get("idx_to_class", config.get("idx_to_class", {0: "ai", 1: "real"})),
            "num_classes": checkpoint.get("num_classes", config.get("num_classes", 2)),
            "balanced_acc": checkpoint.get("balanced_acc"),
            "val_acc": checkpoint.get("val_acc"),
            "timestamp": checkpoint.get("timestamp"),
        }
    else:
        state_dict = checkpoint
        metadata = {
            "idx_to_class": config.get("idx_to_class", {0: "ai", 1: "real"}),
            "num_classes": config.get("num_classes", 2),
        }
    
    # Normalize idx_to_class keys to integers
    metadata["idx_to_class"] = {int(k): v for k, v in metadata["idx_to_class"].items()}
    
    # Load weights
    num_loaded, missing, unexpected = safe_load_state_dict(model, state_dict, verbose=verbose)
    
    if num_loaded == 0:
        raise RuntimeError(
            f"Failed to load any weights! This likely means the checkpoint format is incompatible. "
            f"Missing keys: {len(missing)}, Unexpected keys: {len(unexpected)}"
        )
    
    # Move to device and set eval mode
    model.to(device)
    model.eval()
    
    if verbose:
        print(f"✓ Model ready on {device}")
        print(f"  Classes: {metadata['idx_to_class']}")
    
    return model, metadata


def create_preprocessing_transform(config: Dict[str, Any] = None):
    """
    Create the preprocessing transform for images.
    
    Args:
        config: Optional config dict with image_size, mean, std
        
    Returns:
        torchvision.transforms.Compose object
    """
    from torchvision import transforms
    
    if config is None:
        config = {}
    
    img_size = config.get("image_size", 224)
    mean = config.get("mean", [0.485, 0.456, 0.406])
    std = config.get("std", [0.229, 0.224, 0.225])
    
    return transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=mean, std=std),
    ])
