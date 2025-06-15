
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useVerification } from '@/hooks/useVerification';
import { validateServiceProviderData } from '@/utils/listingValidation';
import ServiceProviderSecurityAlert from './ServiceProviderSecurityAlert';
import ServiceProviderFormHeader from './ServiceProviderFormHeader';
import ServiceProviderFormContent from './ServiceProviderFormContent';
import ServiceProviderFormActions from './ServiceProviderFormActions';

const serviceProviderSchema = z.object({
  bio: z.string().optional(),
  blocked_dates: z.array(z.string()).optional(),
  booking_terms: z.any().optional(),
  certifications: z.array(z.string()).optional(),
  coordinates: z.object({ lat: z.number(), lng: z.number() }).optional(),
  experience_years: z.number().optional(),
  hourly_rate: z.number().optional(),
  id: z.string().optional(),
  image_url: z.string().optional(),
  images: z.array(z.string()).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
  portfolio_images: z.array(z.string()).optional(),
  service_area: z.array(z.string()).optional(),
  service_type: z.string().optional(),
  social_links: z.any().optional(),
  specialties: z.array(z.string()).optional(),
  user_id: z.string().optional(),
});

export type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

interface ServiceProviderFormProviderProps {
  onSuccess?: () => void;
}

const ServiceProviderFormProvider: React.FC<ServiceProviderFormProviderProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { sendVerificationEmail } = useVerification();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      bio: '',
      certifications: [],
      coordinates: undefined,
      experience_years: 1,
      hourly_rate: 1000,
      images: [],
      location: '',
      phone: '',
      portfolio_images: [],
      service_area: [],
      service_type: '',
      social_links: {},
      specialties: [],
    },
  });

  const createServiceProviderMutation = useMutation({
    mutationFn: async (data: ServiceProviderFormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      const validation = validateServiceProviderData(data);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const serviceProviderData = {
        user_id: user.id,
        bio: data.bio || '',
        certifications: data.certifications || [],
        coordinates: data.coordinates,
        experience_years: data.experience_years || 1,
        hourly_rate: data.hourly_rate || 1000,
        images: uploadedImages,
        location: data.location || '',
        phone: data.phone || '',
        portfolio_images: data.portfolio_images || [],
        service_area: data.service_area || [],
        service_type: data.service_type || '',
        social_links: data.social_links || {},
        specialties: data.specialties || [],
        verification_status: 'pending',
        is_available: false,
        admin_verified: false,
      };

      const { data: insertedData, error } = await supabase
        .from('service_providers')
        .insert([serviceProviderData])
        .select()
        .single();

      if (error) throw error;

      await sendVerificationEmail(user.email!, 'service_provider');

      return insertedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      toast({
        title: 'Success!',
        description: 'Service provider profile created successfully! Please check your email to complete verification.',
      });
      form.reset();
      setUploadedImages([]);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error('Error creating service provider:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create service provider profile',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ServiceProviderFormData) => {
    createServiceProviderMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <ServiceProviderSecurityAlert />
      <ServiceProviderFormHeader />
      <ServiceProviderFormContent form={form} />
      <ServiceProviderFormActions
        form={form}
        onSubmit={onSubmit}
        isLoading={createServiceProviderMutation.isPending}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
      />
    </div>
  );
};

export default ServiceProviderFormProvider;
