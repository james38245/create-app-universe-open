
-- Create a comprehensive validation logs table
CREATE TABLE IF NOT EXISTS public.validation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('venue', 'service_provider')),
  entity_id UUID NOT NULL,
  validation_type TEXT NOT NULL,
  validation_result JSONB NOT NULL,
  security_score INTEGER CHECK (security_score >= 0 AND security_score <= 100),
  flagged_issues TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  validated_by UUID REFERENCES auth.users(id)
);

-- Create listing requirements table
CREATE TABLE IF NOT EXISTS public.listing_requirements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('venue', 'service_provider')),
  requirement_name TEXT NOT NULL,
  requirement_description TEXT,
  is_mandatory BOOLEAN DEFAULT true,
  validation_rule JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add verification score to venues and service_providers
ALTER TABLE public.venues 
ADD COLUMN IF NOT EXISTS verification_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS security_validated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_notes TEXT,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE;

ALTER TABLE public.service_providers 
ADD COLUMN IF NOT EXISTS verification_score INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS security_validated BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_notes TEXT,
ADD COLUMN IF NOT EXISTS last_validated_at TIMESTAMP WITH TIME ZONE;

-- Create comprehensive validation function
CREATE OR REPLACE FUNCTION public.validate_listing_data(
  p_entity_type TEXT,
  p_entity_id UUID,
  p_data JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  validation_result JSONB := '{}';
  security_score INTEGER := 100;
  issues TEXT[] := '{}';
  requirement RECORD;
BEGIN
  -- Initialize validation result
  validation_result := jsonb_build_object(
    'entity_type', p_entity_type,
    'entity_id', p_entity_id,
    'validated_at', now(),
    'security_score', security_score,
    'issues', issues,
    'status', 'passed'
  );

  -- Check for required fields based on entity type
  IF p_entity_type = 'venue' THEN
    -- Venue validations
    IF NOT (p_data ? 'name' AND length(p_data->>'name') >= 3) THEN
      issues := array_append(issues, 'Venue name must be at least 3 characters');
      security_score := security_score - 10;
    END IF;
    
    IF NOT (p_data ? 'description' AND length(p_data->>'description') >= 50) THEN
      issues := array_append(issues, 'Description must be at least 50 characters');
      security_score := security_score - 15;
    END IF;
    
    IF NOT (p_data ? 'location' AND length(p_data->>'location') >= 5) THEN
      issues := array_append(issues, 'Location must be specified');
      security_score := security_score - 20;
    END IF;
    
    IF NOT (p_data ? 'price_per_day' AND (p_data->>'price_per_day')::numeric >= 1000) THEN
      issues := array_append(issues, 'Price per day must be at least KSh 1,000');
      security_score := security_score - 15;
    END IF;
    
    IF NOT (p_data ? 'capacity' AND (p_data->>'capacity')::integer >= 1) THEN
      issues := array_append(issues, 'Capacity must be at least 1');
      security_score := security_score - 10;
    END IF;
    
    IF NOT (p_data ? 'images' AND jsonb_array_length(p_data->'images') >= 2) THEN
      issues := array_append(issues, 'At least 2 images are required');
      security_score := security_score - 20;
    END IF;

  ELSIF p_entity_type = 'service_provider' THEN
    -- Service provider validations
    IF NOT (p_data ? 'service_category' AND length(p_data->>'service_category') >= 2) THEN
      issues := array_append(issues, 'Service category is required');
      security_score := security_score - 15;
    END IF;
    
    IF NOT (p_data ? 'bio' AND length(p_data->>'bio') >= 50) THEN
      issues := array_append(issues, 'Bio must be at least 50 characters');
      security_score := security_score - 15;
    END IF;
    
    IF NOT (p_data ? 'price_per_event' AND (p_data->>'price_per_event')::numeric >= 5000) THEN
      issues := array_append(issues, 'Price per event must be at least KSh 5,000');
      security_score := security_score - 15;
    END IF;
    
    IF NOT (p_data ? 'years_experience' AND (p_data->>'years_experience')::integer >= 0) THEN
      issues := array_append(issues, 'Years of experience is required');
      security_score := security_score - 10;
    END IF;
    
    IF NOT (p_data ? 'portfolio_images' AND jsonb_array_length(p_data->'portfolio_images') >= 2) THEN
      issues := array_append(issues, 'At least 2 portfolio images are required');
      security_score := security_score - 20;
    END IF;
  END IF;

  -- Update validation result
  validation_result := jsonb_set(validation_result, '{security_score}', to_jsonb(security_score));
  validation_result := jsonb_set(validation_result, '{issues}', to_jsonb(issues));
  
  IF array_length(issues, 1) > 0 THEN
    validation_result := jsonb_set(validation_result, '{status}', '"failed"');
  END IF;

  -- Log validation attempt
  INSERT INTO public.validation_logs (
    entity_type, entity_id, validation_type, validation_result, 
    security_score, flagged_issues, validated_by
  ) VALUES (
    p_entity_type, p_entity_id, 'comprehensive', validation_result,
    security_score, issues, auth.uid()
  );

  RETURN validation_result;
END;
$$;

-- Create function to update verification status after validation
CREATE OR REPLACE FUNCTION public.process_listing_verification(
  p_entity_type TEXT,
  p_entity_id UUID
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  latest_validation RECORD;
BEGIN
  -- Get the latest validation result
  SELECT * INTO latest_validation
  FROM public.validation_logs
  WHERE entity_type = p_entity_type 
    AND entity_id = p_entity_id
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  -- Update the entity based on validation results
  IF p_entity_type = 'venue' THEN
    UPDATE public.venues
    SET 
      verification_score = latest_validation.security_score,
      security_validated = (latest_validation.validation_result->>'status' = 'passed'),
      validation_notes = array_to_string(latest_validation.flagged_issues, '; '),
      last_validated_at = now(),
      verification_status = CASE 
        WHEN latest_validation.security_score >= 80 THEN 'verified'
        WHEN latest_validation.security_score >= 60 THEN 'pending'
        ELSE 'rejected'
      END
    WHERE id = p_entity_id;
    
  ELSIF p_entity_type = 'service_provider' THEN
    UPDATE public.service_providers
    SET 
      verification_score = latest_validation.security_score,
      security_validated = (latest_validation.validation_result->>'status' = 'passed'),
      validation_notes = array_to_string(latest_validation.flagged_issues, '; '),
      last_validated_at = now(),
      verification_status = CASE 
        WHEN latest_validation.security_score >= 80 THEN 'verified'
        WHEN latest_validation.security_score >= 60 THEN 'pending'
        ELSE 'rejected'
      END
    WHERE id = p_entity_id;
  END IF;

  RETURN true;
END;
$$;

-- Insert default listing requirements
INSERT INTO public.listing_requirements (entity_type, requirement_name, requirement_description, is_mandatory) VALUES
('venue', 'Basic Information', 'Name, description, location must be provided', true),
('venue', 'Pricing Configuration', 'Price per day and capacity must be set', true),
('venue', 'Visual Documentation', 'At least 2 high-quality images required', true),
('venue', 'Booking Terms', 'Clear booking terms and payment policies', true),
('venue', 'Payment Account', 'Valid payment account details for payouts', true),
('service_provider', 'Professional Profile', 'Bio, experience, and service category', true),
('service_provider', 'Portfolio', 'At least 2 portfolio images showcasing work', true),
('service_provider', 'Pricing Structure', 'Clear pricing for services offered', true),
('service_provider', 'Service Terms', 'Response time and availability settings', true),
('service_provider', 'Payment Setup', 'Payment account for receiving payments', true);

-- Enable RLS on new tables
ALTER TABLE public.validation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listing_requirements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their validation logs" ON public.validation_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.venues WHERE id = entity_id AND owner_id = auth.uid()
      UNION
      SELECT 1 FROM public.service_providers WHERE id = entity_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert validation logs" ON public.validation_logs
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Everyone can view listing requirements" ON public.listing_requirements
  FOR SELECT USING (true);
