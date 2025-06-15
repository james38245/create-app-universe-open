
-- Add verification columns to venues table
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_token text,
ADD COLUMN IF NOT EXISTS verification_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verification_completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_verified_by uuid;

-- Add verification columns to service_providers table
ALTER TABLE public.service_providers 
ADD COLUMN IF NOT EXISTS verification_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_token text,
ADD COLUMN IF NOT EXISTS verification_requested_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS verification_completed_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_verified boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS admin_verified_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS admin_verified_by uuid;

-- Create verification_requests table for tracking
CREATE TABLE IF NOT EXISTS public.verification_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type text NOT NULL, -- 'venue' or 'service_provider'
  entity_id uuid NOT NULL,
  user_id uuid NOT NULL,
  verification_token text NOT NULL,
  status text DEFAULT 'pending',
  requested_at timestamp with time zone DEFAULT now(),
  verified_at timestamp with time zone,
  admin_notes text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on verification_requests
ALTER TABLE public.verification_requests ENABLE ROW LEVEL SECURITY;

-- Create policies for verification_requests
CREATE POLICY "Users can view their own verification requests"
  ON public.verification_requests
  FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all verification requests"
  ON public.verification_requests
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND user_type = 'admin'
    )
  );

-- Create function to generate verification token
CREATE OR REPLACE FUNCTION public.generate_verification_token()
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$;

-- Create function to initiate verification process
CREATE OR REPLACE FUNCTION public.initiate_verification(
  p_entity_type text,
  p_entity_id uuid,
  p_user_id uuid
)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token text;
BEGIN
  v_token := generate_verification_token();
  
  -- Insert verification request
  INSERT INTO public.verification_requests (
    entity_type,
    entity_id,
    user_id,
    verification_token,
    status
  ) VALUES (
    p_entity_type,
    p_entity_id,
    p_user_id,
    v_token,
    'pending'
  );
  
  -- Update the entity table with verification info
  IF p_entity_type = 'venue' THEN
    UPDATE public.venues 
    SET 
      verification_status = 'pending',
      verification_token = v_token,
      verification_requested_at = now(),
      is_active = false -- Keep inactive until verified
    WHERE id = p_entity_id;
  ELSIF p_entity_type = 'service_provider' THEN
    UPDATE public.service_providers 
    SET 
      verification_status = 'pending',
      verification_token = v_token,
      verification_requested_at = now(),
      is_available = false -- Keep unavailable until verified
    WHERE id = p_entity_id;
  END IF;
  
  RETURN v_token;
END;
$$;

-- Create function to verify listing
CREATE OR REPLACE FUNCTION public.verify_listing(
  p_token text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request record;
BEGIN
  -- Find the verification request
  SELECT * INTO v_request
  FROM public.verification_requests
  WHERE verification_token = p_token
    AND status = 'pending';
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Update verification request
  UPDATE public.verification_requests
  SET 
    status = 'verified',
    verified_at = now()
  WHERE verification_token = p_token;
  
  -- Update the entity
  IF v_request.entity_type = 'venue' THEN
    UPDATE public.venues 
    SET 
      verification_status = 'verified',
      verification_completed_at = now()
    WHERE id = v_request.entity_id;
  ELSIF v_request.entity_type = 'service_provider' THEN
    UPDATE public.service_providers 
    SET 
      verification_status = 'verified',
      verification_completed_at = now()
    WHERE id = v_request.entity_id;
  END IF;
  
  RETURN true;
END;
$$;
