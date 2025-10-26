"""
Example Vercel Edge Function for AI Detection with Supabase
Deploy this as a Vercel Serverless Function
File: api/detect.py (for Python runtime) or api/detect.ts (for Node.js)
"""

# ============================================================================
# Python Version (api/detect.py)
# ============================================================================

from http.server import BaseHTTPRequestHandler
import json
import base64
import os
import requests
from urllib.parse import parse_qs
from supabase import create_client, Client

# Initialize Supabase
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
MODAL_API_URL = os.environ.get("MODAL_API_URL")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle POST requests"""
        try:
            # Parse request body
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            # Parse JSON
            data = json.loads(post_data.decode('utf-8'))
            image_base64 = data.get('image')
            user_id = data.get('user_id')
            filename = data.get('filename', 'unknown.jpg')
            
            if not image_base64:
                self._send_error(400, "No image provided")
                return
            
            # Upload to Supabase Storage
            image_bytes = base64.b64decode(image_base64)
            storage_path = f"{user_id}/{filename}" if user_id else filename
            
            storage_response = supabase.storage.from_('detection-images').upload(
                storage_path,
                image_bytes,
                {'content-type': 'image/jpeg'}
            )
            
            # Get public URL
            public_url = supabase.storage.from_('detection-images').get_public_url(storage_path)
            
            # Call Modal API for prediction
            modal_response = requests.post(
                f"{MODAL_API_URL}/predict",
                json={"image": image_base64},
                timeout=30
            )
            modal_response.raise_for_status()
            prediction_result = modal_response.json()
            
            # Store in Supabase database
            db_data = {
                'user_id': user_id,
                'image_url': public_url,
                'image_filename': filename,
                'prediction': prediction_result['top_prediction'],
                'confidence': prediction_result['confidence'],
                'predictions': prediction_result['predictions']
            }
            
            db_response = supabase.table('detections').insert(db_data).execute()
            
            # Send success response
            self._send_response(200, {
                'success': True,
                'detection_id': db_response.data[0]['id'],
                'image_url': public_url,
                **prediction_result
            })
            
        except Exception as e:
            self._send_error(500, str(e))
    
    def _send_response(self, status_code, data):
        """Send JSON response"""
        self.send_response(status_code)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data).encode())
    
    def _send_error(self, status_code, message):
        """Send error response"""
        self._send_response(status_code, {'error': message})


# ============================================================================
# TypeScript/Node.js Version (api/detect.ts)
# ============================================================================

"""
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

const MODAL_API_URL = process.env.MODAL_API_URL!;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image, user_id, filename = 'unknown.jpg' } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    // Upload to Supabase Storage
    const imageBuffer = Buffer.from(image, 'base64');
    const storagePath = user_id ? `${user_id}/${filename}` : filename;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('detection-images')
      .upload(storagePath, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('detection-images')
      .getPublicUrl(storagePath);

    // Call Modal API
    const modalResponse = await fetch(`${MODAL_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image }),
    });

    if (!modalResponse.ok) {
      throw new Error('Prediction failed');
    }

    const predictionResult = await modalResponse.json();

    // Store in Supabase
    const { data: dbData, error: dbError } = await supabase
      .from('detections')
      .insert({
        user_id,
        image_url: publicUrl,
        image_filename: filename,
        prediction: predictionResult.top_prediction,
        confidence: predictionResult.confidence,
        predictions: predictionResult.predictions,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return res.status(200).json({
      success: true,
      detection_id: dbData.id,
      image_url: publicUrl,
      ...predictionResult,
    });

  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to process image' 
    });
  }
}
"""

# ============================================================================
# Next.js App Router API Route (app/api/detect/route.ts)
# ============================================================================

"""
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Upload to Supabase Storage
    const storagePath = userId 
      ? `${userId}/${Date.now()}-${file.name}`
      : `${Date.now()}-${file.name}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('detection-images')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('detection-images')
      .getPublicUrl(storagePath);

    // Call Modal API
    const modalResponse = await fetch(`${MODAL_API_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        image: base64Image,
        return_all_scores: true 
      }),
    });

    if (!modalResponse.ok) {
      const errorData = await modalResponse.json();
      throw new Error(errorData.error || 'Prediction failed');
    }

    const prediction = await modalResponse.json();

    // Store in database
    const { data: detection, error: dbError } = await supabase
      .from('detections')
      .insert({
        user_id: userId || null,
        image_url: publicUrl,
        image_filename: file.name,
        prediction: prediction.top_prediction,
        confidence: prediction.confidence,
        predictions: prediction.predictions,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      detection_id: detection.id,
      image_url: publicUrl,
      ...prediction,
    });

  } catch (error: any) {
    console.error('Detection error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
"""

# ============================================================================
# Environment Variables (.env.local)
# ============================================================================

"""
# Modal API
MODAL_API_URL=https://your-username--ai-vs-real-detector-fastapi-app.modal.run

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# For Vercel deployment
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-service-key
"""
