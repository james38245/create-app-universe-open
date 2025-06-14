
-- Add booking terms and blocked dates columns to venues table
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS booking_terms JSONB DEFAULT '{
  "deposit_percentage": 30,
  "cancellation_policy": "Full refund if cancelled 7 days before event",
  "payment_due_days": 7,
  "advance_booking_days": 2,
  "minimum_booking_hours": 4,
  "special_terms": ""
}'::jsonb,
ADD COLUMN IF NOT EXISTS blocked_dates TEXT[] DEFAULT '{}';

-- Add booking terms and blocked dates columns to service_providers table  
ALTER TABLE public.service_providers
ADD COLUMN IF NOT EXISTS booking_terms JSONB DEFAULT '{
  "deposit_percentage": 50,
  "cancellation_policy": "Full refund if cancelled 48 hours before event", 
  "payment_due_days": 3,
  "advance_booking_days": 1,
  "minimum_booking_hours": 2,
  "special_terms": ""
}'::jsonb,
ADD COLUMN IF NOT EXISTS blocked_dates TEXT[] DEFAULT '{}';

-- Create storage buckets for venue and portfolio images if they don't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('venue-images', 'venue-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio-images', 'portfolio-images', true) 
ON CONFLICT (id) DO NOTHING;

-- Create policies for venue-images bucket
CREATE POLICY "Anyone can view venue images" ON storage.objects
FOR SELECT USING (bucket_id = 'venue-images');

CREATE POLICY "Authenticated users can upload venue images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'venue-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own venue images" ON storage.objects
FOR UPDATE USING (bucket_id = 'venue-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own venue images" ON storage.objects
FOR DELETE USING (bucket_id = 'venue-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for portfolio-images bucket  
CREATE POLICY "Anyone can view portfolio images" ON storage.objects
FOR SELECT USING (bucket_id = 'portfolio-images');

CREATE POLICY "Authenticated users can upload portfolio images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'portfolio-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own portfolio images" ON storage.objects
FOR UPDATE USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio images" ON storage.objects
FOR DELETE USING (bucket_id = 'portfolio-images' AND auth.uid()::text = (storage.foldername(name))[1]);
