
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { sanitizeFormData, serviceProviderValidationSchema } from '@/utils/listingValidation';
import { Form } from '@/components/ui/form';
import ServiceProviderSecurityAlert from './ServiceProviderSecurityAlert';
import ServiceProviderFormHeader from './ServiceProviderFormHeader';
import ServiceProviderFormContent from './ServiceProviderFormContent';
import ServiceProviderFormActions from './ServiceProviderFormActions';
import { ServiceProviderFormData } from '@/types/venue';

const serviceProviderSchema = z.object({
  bio: z.string().optional(),
  blocked_dates: z.array(z.string()).optional(),
  booking_terms: z.any().optional(),
  certifications: z.array(z.string()).optional(),
  coordinates: z.object({ 
    lat: z.number().optional(), 
    lng: z.number().optional() 
  }).optional().nullable(),
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

export type FormData = z.infer<typeof serviceProviderSchema>;

interface ServiceProviderFormProviderProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const ServiceProviderFormProvider: React.FC<ServiceProviderFormProviderProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      bio: '',
      certifications: [],
      coordinates: null,
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
    mutationFn: async (data: FormData) => {
      if (!user?.id) throw new Error('User not authenticated');

      // Sanitize form data for security
      const sanitizedData = sanitizeFormData(data);

      // Validate against security schema
      const validationResult = serviceProviderValidationSchema.safeParse({
        service_category: sanitizedData.service_type,
        specialties: sanitizedData.specialties || [],
        bio: sanitizedData.bio || '',
        years_experience: sanitizedData.experience_years || 0,
        price_per_event: sanitizedData.hourly_rate || 0,
        portfolio_images: uploadedImages,
        certifications: sanitizedData.certifications || [],
        response_time_hours: 24,
      });

      if (!validationResult.success) {
        throw new Error(`Validation failed: ${validationResult.error.issues.map(i => i.message).join(', ')}`);
      }

      const serviceProviderData = {
        user_id: user.id,
        bio: sanitizedData.bio || '',
        certifications: sanitizedData.certifications || [],
        blocked_dates: [],
        booking_terms: {
          special_terms: "",
          payment_due_days: 3,
          deposit_percentage: 50,
          cancellation_policy: "Full refund if cancelled 48 hours before event",
          advance_booking_days: 1,
          minimum_booking_hours: 2
        },
        years_experience: sanitizedData.experience_years || 1,
        price_per_event: sanitizedData.hourly_rate || 1000,
        portfolio_images: uploadedImages,
        service_category: sanitizedData.service_type || '',
        specialties: sanitizedData.specialties || [],
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

      // Run validation after creation
      const validationData = {
        service_category: serviceProviderData.service_category,
        bio: serviceProviderData.bio,
        price_per_event: serviceProviderData.price_per_event,
        years_experience: serviceProviderData.years_experience,
        portfolio_images: serviceProviderData.portfolio_images,
        specialties: serviceProviderData.specialties
      };

      const { error: validationError } = await supabase.rpc('validate_listing_data', {
        p_entity_type: 'service_provider',
        p_entity_id: insertedData.id,
        p_data: validationData
      });

      if (validationError) {
        console.error('Validation error:', validationError);
      }

      // Process verification after validation
      const { error: verificationError } = await supabase.rpc('process_listing_verification', {
        p_entity_type: 'service_provider',
        p_entity_id: insertedData.id
      });

      if (verificationError) {
        console.error('Verification processing error:', verificationError);
      }

      return insertedData;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['my-services'] });
      toast({
        title: 'Success!',
        description: 'Service provider profile created and submitted for verification! Our team will review your listing within 24 hours.',
      });
      form.reset();
      setUploadedImages([]);
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error('Error creating service provider:', error);
      toast({
        title: 'Validation Failed',
        description: error.message || 'Failed to create service provider profile. Please check all required fields and try again.',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createServiceProviderMutation.mutate(data);
  };

  return (
    <div className="space-y-6">
      <ServiceProviderSecurityAlert />
      <ServiceProviderFormHeader />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ServiceProviderFormContent form={form} />
          <ServiceProviderFormActions
            onCancel={onCancel || (() => {})}
            isSubmitting={createServiceProviderMutation.isPending}
            isInitiating={false}
          />
        </form>
      </Form>
    </div>
  );
};

export default ServiceProviderFormProvider;
