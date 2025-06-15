
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useVerification } from '@/hooks/useVerification';
import ServiceProviderSecurityAlert from './ServiceProviderSecurityAlert';
import ServiceProviderFormHeader from './ServiceProviderFormHeader';
import ServiceProviderFormContent from './ServiceProviderFormContent';
import ServiceProviderFormActions from './ServiceProviderFormActions';

const serviceProviderSchema = z.object({
  bio: z.string().optional(),
  blocked_dates: z.array(z.string()).optional(),
  booking_terms: z.any().optional(),
  certifications: z.array(z.string()).optional(),
  coordinates: z.object({ lat: z.number().optional(), lng: z.number().optional() }).optional(),
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
  onCancel?: () => void;
}

const ServiceProviderFormProvider: React.FC<ServiceProviderFormProviderProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { initiateVerification } = useVerification();
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

      const serviceProviderData = {
        user_id: user.id,
        bio: data.bio || '',
        certifications: data.certifications || [],
        blocked_dates: [],
        booking_terms: {
          special_terms: "",
          payment_due_days: 3,
          deposit_percentage: 50,
          cancellation_policy: "Full refund if cancelled 48 hours before event",
          advance_booking_days: 1,
          minimum_booking_hours: 2
        },
        years_experience: data.experience_years || 1,
        price_per_event: data.hourly_rate || 1000,
        portfolio_images: uploadedImages,
        service_category: data.service_type || '',
        specialties: data.specialties || [],
        verification_status: 'pending',
        is_available: false,
        admin_verified: false,
        rating: 0,
        total_reviews: 0,
        response_time_hours: 24
      };

      const { data: insertedData, error } = await supabase
        .from('service_providers')
        .insert([serviceProviderData])
        .select()
        .single();

      if (error) throw error;

      return insertedData;
    },
    onSuccess: (data) => {
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
        onCancel={onCancel || (() => {})}
        isSubmitting={createServiceProviderMutation.isPending}
        isInitiating={false}
      />
    </div>
  );
};

export default ServiceProviderFormProvider;
