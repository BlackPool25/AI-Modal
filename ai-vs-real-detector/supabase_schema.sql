-- ============================================================================
-- Supabase Database Schema for AI Detector Integration
-- ============================================================================

-- Create detections table
CREATE TABLE IF NOT EXISTS public.detections (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_filename TEXT,
    prediction TEXT NOT NULL,
    confidence FLOAT NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    predictions JSONB NOT NULL,
    processing_time_ms INTEGER,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_detections_user_id ON public.detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_created_at ON public.detections(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_detections_prediction ON public.detections(prediction);

-- Enable Row Level Security
ALTER TABLE public.detections ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own detections
CREATE POLICY "Users can view their own detections"
    ON public.detections
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own detections
CREATE POLICY "Users can insert their own detections"
    ON public.detections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can update their own detections
CREATE POLICY "Users can update their own detections"
    ON public.detections
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Users can delete their own detections
CREATE POLICY "Users can delete their own detections"
    ON public.detections
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================================================
-- Storage Bucket for Images
-- ============================================================================

-- Create storage bucket (run in Supabase Storage section)
INSERT INTO storage.buckets (id, name, public)
VALUES ('detection-images', 'detection-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own images"
    ON storage.objects
    FOR INSERT
    WITH CHECK (
        bucket_id = 'detection-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Anyone can view images"
    ON storage.objects
    FOR SELECT
    USING (bucket_id = 'detection-images');

CREATE POLICY "Users can delete their own images"
    ON storage.objects
    FOR DELETE
    USING (
        bucket_id = 'detection-images' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- ============================================================================
-- Statistics View
-- ============================================================================

CREATE OR REPLACE VIEW public.detection_stats AS
SELECT 
    user_id,
    COUNT(*) as total_detections,
    COUNT(*) FILTER (WHERE prediction = 'AI') as ai_count,
    COUNT(*) FILTER (WHERE prediction = 'REAL') as real_count,
    AVG(confidence) as avg_confidence,
    MAX(created_at) as last_detection,
    MIN(created_at) as first_detection
FROM public.detections
GROUP BY user_id;

-- ============================================================================
-- Functions
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.detections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Function to get user detection history
CREATE OR REPLACE FUNCTION public.get_user_detection_history(
    user_uuid UUID,
    limit_count INTEGER DEFAULT 10,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    image_url TEXT,
    prediction TEXT,
    confidence FLOAT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.image_url,
        d.prediction,
        d.confidence,
        d.created_at
    FROM public.detections d
    WHERE d.user_id = user_uuid
    ORDER BY d.created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- Example Queries
-- ============================================================================

-- Get recent detections for a user
-- SELECT * FROM public.detections 
-- WHERE user_id = auth.uid() 
-- ORDER BY created_at DESC 
-- LIMIT 10;

-- Get detection statistics
-- SELECT * FROM public.detection_stats 
-- WHERE user_id = auth.uid();

-- Get AI vs Real ratio
-- SELECT 
--     prediction,
--     COUNT(*) as count,
--     ROUND(AVG(confidence)::numeric, 3) as avg_confidence
-- FROM public.detections
-- WHERE user_id = auth.uid()
-- GROUP BY prediction;

-- ============================================================================
-- Seed Data (Optional - for testing)
-- ============================================================================

/*
-- Insert sample detections (replace with actual user_id)
INSERT INTO public.detections (user_id, image_url, image_filename, prediction, confidence, predictions) VALUES
(
    '00000000-0000-0000-0000-000000000000', -- Replace with actual user_id
    'https://example.com/image1.jpg',
    'test_image_1.jpg',
    'AI',
    0.95,
    '[{"label": "AI", "score": 0.95}, {"label": "REAL", "score": 0.05}]'::jsonb
),
(
    '00000000-0000-0000-0000-000000000000', -- Replace with actual user_id
    'https://example.com/image2.jpg',
    'test_image_2.jpg',
    'REAL',
    0.87,
    '[{"label": "REAL", "score": 0.87}, {"label": "AI", "score": 0.13}]'::jsonb
);
*/
