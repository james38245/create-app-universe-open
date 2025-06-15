
-- Create storage bucket for CV/resume documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- Create storage policies for documents bucket
CREATE POLICY "Users can upload their own documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own documents"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own documents"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Admin access to all documents
CREATE POLICY "Admins can view all documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

CREATE POLICY "Admins can manage all documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'documents' 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Create user_documents table to track document metadata
CREATE TABLE public.user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('cv', 'resume', 'certificate', 'portfolio')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_by_admin BOOLEAN DEFAULT false,
  admin_verified_at TIMESTAMP WITH TIME ZONE,
  admin_verified_by UUID REFERENCES public.profiles(id),
  admin_notes TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on user_documents
ALTER TABLE public.user_documents ENABLE ROW LEVEL SECURITY;

-- Users can manage their own documents
CREATE POLICY "Users can view their own documents"
ON public.user_documents FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own documents"
ON public.user_documents FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own documents"
ON public.user_documents FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own documents"
ON public.user_documents FOR DELETE
USING (user_id = auth.uid());

-- Buyers can view public documents of service providers
CREATE POLICY "Public can view public documents"
ON public.user_documents FOR SELECT
USING (is_public = true);

-- Admins can manage all documents
CREATE POLICY "Admins can manage all documents"
ON public.user_documents FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND user_type = 'admin'
  )
);

-- Add document tracking to service_providers table
ALTER TABLE public.service_providers 
ADD COLUMN cv_document_id UUID REFERENCES public.user_documents(id),
ADD COLUMN resume_document_id UUID REFERENCES public.user_documents(id),
ADD COLUMN documents_verified BOOLEAN DEFAULT false,
ADD COLUMN documents_verified_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN documents_verified_by UUID REFERENCES public.profiles(id);

-- Create function to get user's public documents
CREATE OR REPLACE FUNCTION public.get_user_public_documents(target_user_id UUID)
RETURNS TABLE (
  id UUID,
  document_type TEXT,
  file_name TEXT,
  upload_date TIMESTAMP WITH TIME ZONE,
  verified_by_admin BOOLEAN,
  admin_notes TEXT
)
LANGUAGE SQL
STABLE
AS $$
  SELECT 
    ud.id,
    ud.document_type,
    ud.file_name,
    ud.upload_date,
    ud.verified_by_admin,
    ud.admin_notes
  FROM public.user_documents ud
  WHERE ud.user_id = target_user_id 
    AND ud.is_public = true
  ORDER BY ud.upload_date DESC;
$$;
