/**
 * TypeScript/JavaScript client for AI Detector Modal API
 * Use in Vercel, Next.js, or any Node.js/Browser environment
 */

export interface PredictionResult {
  label: string;
  score: number;
}

export interface PredictionResponse {
  predictions: PredictionResult[];
  top_prediction: string;
  confidence: number;
}

export interface BatchPredictionResponse {
  results: Array<PredictionResponse | { error: string }>;
}

export interface HealthCheckResponse {
  status: string;
  device: string;
  cuda_available: boolean;
  model_loaded: boolean;
}

export class AIDetectorClient {
  private apiUrl: string;
  private apiKey?: string;

  constructor(apiUrl: string, apiKey?: string) {
    this.apiUrl = apiUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiKey = apiKey;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      ...options.headers,
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  /**
   * Convert File/Blob to base64 string
   */
  private async fileToBase64(file: File | Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Predict from base64 encoded image
   */
  async predict(
    imageBase64: string,
    returnAllScores: boolean = true
  ): Promise<PredictionResponse> {
    return this.request<PredictionResponse>('/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageBase64,
        return_all_scores: returnAllScores,
      }),
    });
  }

  /**
   * Predict from File object (browser)
   */
  async predictFile(
    file: File,
    returnAllScores: boolean = true
  ): Promise<PredictionResponse> {
    const base64 = await this.fileToBase64(file);
    return this.predict(base64, returnAllScores);
  }

  /**
   * Predict by uploading file
   */
  async predictUpload(file: File): Promise<PredictionResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.request<PredictionResponse>('/predict/upload', {
      method: 'POST',
      body: formData,
    });
  }

  /**
   * Predict multiple images
   */
  async predictBatch(
    images: string[] | File[]
  ): Promise<BatchPredictionResponse> {
    let imageBase64Array: string[];

    if (images.length > 0 && images[0] instanceof File) {
      // Convert Files to base64
      imageBase64Array = await Promise.all(
        (images as File[]).map((file) => this.fileToBase64(file))
      );
    } else {
      imageBase64Array = images as string[];
    }

    return this.request<BatchPredictionResponse>('/predict/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: imageBase64Array,
      }),
    });
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<HealthCheckResponse> {
    return this.request<HealthCheckResponse>('/health');
  }

  /**
   * Get API info
   */
  async getInfo(): Promise<any> {
    return this.request('/');
  }
}

// ============================================================================
// React Hooks (Optional)
// ============================================================================

/**
 * React hook for AI detection
 * 
 * Usage:
 *   const { predict, isLoading, result, error } = useAIDetector(apiUrl);
 *   await predict(file);
 */
export function useAIDetector(apiUrl: string, apiKey?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const client = useMemo(
    () => new AIDetectorClient(apiUrl, apiKey),
    [apiUrl, apiKey]
  );

  const predict = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);

      try {
        const prediction = await client.predictFile(file);
        setResult(prediction);
        return prediction;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Prediction failed';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    predict,
    isLoading,
    result,
    error,
    reset,
  };
}

// Add React imports for the hook
import { useState, useCallback, useMemo } from 'react';

// ============================================================================
// Next.js Server-Side Example
// ============================================================================

/**
 * Example Next.js API route (app/api/detect/route.ts)
 */
/*
import { NextRequest, NextResponse } from 'next/server';
import { AIDetectorClient } from '@/lib/ai-detector-client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const client = new AIDetectorClient(process.env.MODAL_API_URL!);
    const result = await client.predictUpload(file);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
*/

// ============================================================================
// Browser Example
// ============================================================================

/**
 * Example browser usage
 */
/*
const client = new AIDetectorClient('https://your-app.modal.run');

// Handle file upload
document.getElementById('fileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  
  try {
    const result = await client.predictFile(file);
    console.log('Prediction:', result.top_prediction);
    console.log('Confidence:', (result.confidence * 100).toFixed(1) + '%');
  } catch (error) {
    console.error('Error:', error);
  }
});
*/

export default AIDetectorClient;
