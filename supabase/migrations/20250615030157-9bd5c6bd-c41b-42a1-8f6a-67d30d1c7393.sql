
-- Add price_per_hour column to venues table
ALTER TABLE public.venues 
ADD COLUMN price_per_hour numeric;

-- Add pricing_unit column to venues table to specify whether pricing is per day or per hour
ALTER TABLE public.venues 
ADD COLUMN pricing_unit text DEFAULT 'day' CHECK (pricing_unit IN ('day', 'hour'));

-- Update the default booking terms to include pricing_unit
UPDATE public.venues 
SET booking_terms = jsonb_set(
  COALESCE(booking_terms, '{}'::jsonb), 
  '{pricing_unit}', 
  '"day"'
)
WHERE booking_terms IS NULL OR NOT (booking_terms ? 'pricing_unit');
