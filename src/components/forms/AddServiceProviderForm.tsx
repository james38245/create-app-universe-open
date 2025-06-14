
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
  pricing_unit: z.enum(['event', 'hour']),
  price_per_event: z.number().min(1, 'Price must be greater than 0').optional(),
  price_per_hour: z.number().min(1, 'Price must be greater than 0').optional(),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  years_experience: z.number().min(0, 'Experience cannot be negative'),
  certifications: z.array(z.string()).optional(),
  response_time_hours: z.number().min(1, 'Response time must be at least 1 hour'),
  is_available: z.boolean().default(true),
  portfolio_images: z.array(z.string()).min(2, 'At least 2 portfolio images are required'),
  location: z.string().optional(),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional().nullable(),
  booking_terms: z.object({
    payment_type: z.enum(['deposit_only', 'full_payment', 'installments']).default('deposit_only'),
    deposit_percentage: z.number().min(0).max(100),
    cancellation_time_value: z.number().min(1),
    cancellation_time_unit: z.enum(['hours', 'days']).default('hours'),
    refund_percentage: z.number().min(0).max(100),
    transaction_fee_deduction: z.number().min(0).max(10),
    processing_fee_amount: z.number().min(0),
    payment_due_days: z.number().min(1),
    advance_booking_days: z.number().min(1),
    minimum_booking_duration: z.number().min(1),
    minimum_booking_unit: z.enum(['hours', 'days']).default('hours'),
    installment_count: z.number().optional(),
    installment_interval_days: z.number().optional(),
    late_payment_daily_rate: z.number().min(0).max(10),
    maximum_late_fee_percentage: z.number().min(0).max(50),
    grace_period_value: z.number().min(0),
    grace_period_unit: z.enum(['hours', 'days']).default('hours'),
    platform_commission_percentage: z.number().min(5).max(20),
    agree_to_platform_terms: z.boolean(),
    agree_to_legal_compliance: z.boolean(),
    agree_to_service_delivery: z.boolean(),
    special_terms: z.string().optional()
  }).optional(),
  blocked_dates: z.array(z.string()).optional()
}).refine((data) => {
  if (data.pricing_unit === 'event') {
    return data.price_per_event && data.price_per_event > 0;
  } else {
    return data.price_per_hour && data.price_per_hour > 0;
  }
}, {
  message: "Price must be provided for the selected pricing unit",
  path: ["price_per_event"]
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
      pricing_unit: 'event',
      price_per_event: 25000,
      price_per_hour: 5000,
      bio: '',
      years_experience: 1,
      certifications: [],
      response_time_hours: 24,
      is_available: true,
      portfolio_images: [],
      location: '',
      coordinates: null,
      booking_terms: {
        payment_type: 'deposit_only',
        deposit_percentage: 50,
        cancellation_time_value: 48,
        cancellation_time_unit: 'hours',
        refund_percentage: 100,
        transaction_fee_deduction: 3,
        processing_fee_amount: 300,
        payment_due_days: 3,
        advance_booking_days: 1,
        minimum_booking_duration: 2,
        minimum_booking_unit: 'hours',
        installment_count: 2,
        installment_interval_days: 21,
        late_payment_daily_rate: 3,
        maximum_late_fee_percentage: 30,
        grace_period_value: 12,
        grace_period_unit: 'hours',
        platform_commission_percentage: 12,
        agree_to_platform_terms: false,
        agree_to_legal_compliance: false,
        agree_to_service_delivery: false,
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
        pricing_unit: data.pricing_unit,
        price_per_event: data.pricing_unit === 'event' ? data.price_per_event : null,
        price_per_hour: data.pricing_unit === 'hour' ? data.price_per_hour : null,
        bio: data.bio,
        years_experience: data.years_experience,
        certifications: data.certifications || [],
        response_time_hours: data.response_time_hours,
        is_available: data.is_available,
        portfolio_images: uploadedImages,
        location: data.location,
        coordinates: data.coordinates,
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
        description: "Service provider profile created successfully with flexible pricing options!"
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
              error={form.formState.errors.portfolio_images?.message}
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
