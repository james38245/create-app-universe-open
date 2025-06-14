
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import ImageUpload from './ImageUpload';
import ServiceProviderFormFields from './ServiceProviderFormFields';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingTermsSettings from './BookingTermsSettings';

const serviceProviderSchema = z.object({
  service_category: z.string().min(1, 'Service category is required'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  price_per_event: z.number().min(1, 'Price must be greater than 0'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  years_experience: z.number().min(0, 'Experience cannot be negative'),
  certifications: z.array(z.string()).optional(),
  response_time_hours: z.number().min(1, 'Response time must be at least 1 hour'),
  is_available: z.boolean().default(true),
  portfolio_images: z.array(z.string()).optional(),
  booking_terms: z.object({
    deposit_percentage: z.number().min(0).max(100),
    cancellation_policy: z.string(),
    payment_due_days: z.number().min(1),
    advance_booking_days: z.number().min(1),
    minimum_booking_hours: z.number().min(1),
    special_terms: z.string().optional()
  }).optional(),
  blocked_dates: z.array(z.string()).optional()
});

type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

interface AddServiceProviderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddServiceProviderForm: React.FC<AddServiceProviderFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      service_category: '',
      specialties: [],
      price_per_event: 25000,
      bio: '',
      years_experience: 1,
      certifications: [],
      response_time_hours: 24,
      is_available: true,
      portfolio_images: [],
      booking_terms: {
        deposit_percentage: 50,
        cancellation_policy: 'Full refund if cancelled 48 hours before event',
        payment_due_days: 3,
        advance_booking_days: 1,
        minimum_booking_hours: 2,
        special_terms: ''
      },
      blocked_dates: []
    }
  });

  const onSubmit = async (data: ServiceProviderFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const providerData = {
        service_category: data.service_category,
        specialties: data.specialties,
        price_per_event: data.price_per_event,
        bio: data.bio,
        years_experience: data.years_experience,
        certifications: data.certifications || [],
        response_time_hours: data.response_time_hours,
        is_available: data.is_available,
        portfolio_images: uploadedImages,
        user_id: user.id,
        booking_terms: data.booking_terms,
        blocked_dates: blockedDates
      };

      const { error } = await supabase
        .from('service_providers')
        .insert(providerData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service provider profile created successfully with booking terms!"
      });

      queryClient.invalidateQueries({ queryKey: ['my-service-providers'] });
      onSuccess();
    } catch (error) {
      console.error('Error adding service provider:', error);
      toast({
        title: "Error",
        description: "Failed to create service provider profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Create Service Provider Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ServiceProviderFormFields form={form} />
            
            <ImageUpload
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              onImagesChange={(images) => form.setValue('portfolio_images', images)}
              bucketName="portfolio-images"
              label="Portfolio Images"
              inputId="portfolio-upload"
            />

            <BookingTermsSettings form={form} />

            <AvailabilityCalendar
              blockedDates={blockedDates}
              setBlockedDates={setBlockedDates}
              onDatesChange={(dates) => form.setValue('blocked_dates', dates)}
            />

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddServiceProviderForm;
