# AI vs Real Detector - Modal Deployment Guide

Complete guide for deploying your PyTorch AI detection model on Modal with T4 GPU support and integration with Vercel/Supabase.

## 🚀 Quick Start

### 1. Install Modal

```bash
pip install modal
```

### 2. Authenticate with Modal

```bash
modal setup
```

This will open a browser to authenticate with your Modal account (create one if needed).

### 3. Deploy Your Model

```bash
modal deploy modal_app.py
```

Your API will be live at: `https://<your-username>--ai-vs-real-detector-fastapi-app.modal.run`

## 📋 Prerequisites

### Required Files
- `pytorch_model.bin` - Your trained model weights
- `config.json` - Model configuration
- `handler.py` - Inference handler
- `modal_app.py` - Modal deployment script

### Modal Secrets (Optional)
If you need Hugging Face access:
```bash
modal secret create huggingface-secret HF_TOKEN=<your_hf_token>
```

## 🎯 Features

### GPU Support
- **GPU Type**: NVIDIA T4 (16GB VRAM)
- **Auto-scaling**: Scales from 0 to multiple instances
- **Cold start**: ~10-15 seconds
- **Warm containers**: 5-minute idle timeout

### API Endpoints

#### 1. Single Image Prediction
```bash
POST https://your-app.modal.run/predict
Content-Type: application/json

{
  "image": "base64_encoded_image_string",
  "return_all_scores": true
}
```

Response:
```json
{
  "predictions": [
    {"label": "REAL", "score": 0.92},
    {"label": "AI", "score": 0.08}
  ],
  "top_prediction": "REAL",
  "confidence": 0.92
}
```

#### 2. Batch Prediction
```bash
POST https://your-app.modal.run/predict/batch
Content-Type: application/json

{
  "images": ["base64_image_1", "base64_image_2"]
}
```

#### 3. File Upload
```bash
POST https://your-app.modal.run/predict/upload
Content-Type: multipart/form-data

file: <image_file>
```

#### 4. Health Check
```bash
GET https://your-app.modal.run/health
```

## 🔗 Integration with Vercel

### Next.js Example (App Router)

Create `app/api/detect/route.ts`:

```typescript
// app/api/detect/route.ts
import { NextRequest, NextResponse } from 'next/server';

const MODAL_API_URL = process.env.MODAL_API_URL!; // Your Modal endpoint

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Call Modal API
    const response = await fetch(`${MODAL_API_URL}/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: base64Image,
        return_all_scores: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Prediction failed');
    }

    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
```

### Environment Variables (.env.local)
```env
MODAL_API_URL=https://your-username--ai-vs-real-detector-fastapi-app.modal.run
```

### React Component Example

```typescript
// components/ImageDetector.tsx
'use client';

import { useState } from 'react';

export default function ImageDetector() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="block w-full"
        />
        <button
          type="submit"
          disabled={!file || loading}
          className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-gray-300"
        >
          {loading ? 'Analyzing...' : 'Detect AI'}
        </button>
      </form>

      {result && (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold">Result:</h3>
          <p className="text-2xl mt-2">
            {result.top_prediction}
          </p>
          <p className="text-gray-600">
            Confidence: {(result.confidence * 100).toFixed(1)}%
          </p>
        </div>
      )}
    </div>
  );
}
```

## 🗄️ Integration with Supabase

### 1. Store Results in Supabase

Create a table:

```sql
-- Create detections table
CREATE TABLE detections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT,
  prediction TEXT NOT NULL,
  confidence FLOAT NOT NULL,
  predictions JSONB,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "Users can view their own detections"
  ON detections
  FOR SELECT
  USING (auth.uid() = user_id);
```

### 2. Next.js API Route with Supabase

```typescript
// app/api/detect/route.ts
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const MODAL_API_URL = process.env.MODAL_API_URL!;

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    // Upload image to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('detection-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('detection-images')
      .getPublicUrl(fileName);

    // Convert to base64 for Modal API
    const bytes = await file.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString('base64');

    // Call Modal API
    const response = await fetch(`${MODAL_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });

    const prediction = await response.json();

    // Store result in Supabase
    const { data: detection, error: dbError } = await supabase
      .from('detections')
      .insert({
        image_url: publicUrl,
        prediction: prediction.top_prediction,
        confidence: prediction.confidence,
        predictions: prediction.predictions,
        user_id: userId,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      ...prediction,
      detection_id: detection.id,
      image_url: publicUrl,
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
```

## 📊 Monitoring & Logs

### View Logs
```bash
modal app logs ai-vs-real-detector
```

### Monitor Usage
Visit Modal Dashboard: https://modal.com/apps

## 💰 Cost Optimization

### Current Setup
- **GPU**: T4 (~$0.60/hour when running)
- **Auto-scaling**: Scales to zero when idle
- **Keep-warm**: Runs every 12 hours to prevent cold starts

### Optimization Tips

1. **Adjust idle timeout**:
   ```python
   container_idle_timeout=60  # Reduce to 1 minute
   ```

2. **Remove keep-warm for low traffic**:
   Comment out the `keep_warm()` function

3. **Use CPU for low-volume**:
   ```python
   gpu=None  # Remove GPU, use CPU
   ```

4. **Batch requests**:
   Use `/predict/batch` for multiple images

## 🧪 Testing

### Test Locally with Modal
```bash
modal run modal_app.py --image-path test_image.jpg
```

### Test API Endpoint
```bash
# Using curl
curl -X POST https://your-app.modal.run/predict \
  -H "Content-Type: application/json" \
  -d '{
    "image": "'"$(base64 -w 0 test_image.jpg)"'",
    "return_all_scores": true
  }'
```

### Python Test Script
```python
import requests
import base64

# Read and encode image
with open("test_image.jpg", "rb") as f:
    image_base64 = base64.b64encode(f.read()).decode()

# Call API
response = requests.post(
    "https://your-app.modal.run/predict",
    json={"image": image_base64}
)

print(response.json())
```

## 🔒 Security Best Practices

1. **CORS Configuration**:
   Update `allow_origins` in `modal_app.py` with your Vercel domain:
   ```python
   allow_origins=["https://your-app.vercel.app"]
   ```

2. **Rate Limiting**:
   Add rate limiting in your Vercel API route

3. **Authentication**:
   Implement API key authentication:
   ```python
   secrets=[modal.Secret.from_name("api-keys")]
   ```

4. **Input Validation**:
   Limit file sizes and formats

## 📚 Additional Resources

- [Modal Documentation](https://modal.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

## 🐛 Troubleshooting

### Cold Start Issues
- Increase `container_idle_timeout`
- Enable keep-warm function
- Consider Modal's "warm pool" feature

### Out of Memory
- Reduce batch size
- Upgrade to A10G GPU (24GB)

### CORS Errors
- Check `allow_origins` configuration
- Ensure proper headers in Vercel

### Model Loading Errors
- Verify `pytorch_model.bin` is included in deployment
- Check file paths in container

## 📝 Next Steps

1. ✅ Deploy to Modal
2. ✅ Get your API endpoint URL
3. ✅ Set up Vercel environment variables
4. ✅ Create Supabase tables
5. ✅ Test integration
6. ✅ Monitor usage and costs

---

**Need Help?** Check Modal's [Discord community](https://discord.gg/modal) or [documentation](https://modal.com/docs).
