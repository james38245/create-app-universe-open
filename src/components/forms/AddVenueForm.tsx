
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
import VenueFormFields from './VenueFormFields';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingTermsSettings from './BookingTermsSettings';

const venueSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  coordinates: z.object({
    lat: z.number(),
    lng: z.number()
  }).optional().nullable(),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  pricing_unit: z.enum(['day', 'hour']),
  price_per_day: z.number().min(1, 'Price must be greater than 0').optional(),
  price_per_hour: z.number().min(1, 'Price must be greater than 0').optional(),
  venue_type: z.string().min(1, 'Venue type is required'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).min(2, 'At least 2 images are required'),
  is_active: z.boolean().default(true),
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
  if (data.pricing_unit === 'day') {
    return data.price_per_day && data.price_per_day > 0;
  } else {
    return data.price_per_hour && data.price_per_hour > 0;
  }
}, {
  message: "Price must be provided for the selected pricing unit",
  path: ["price_per_day"]
});

type VenueFormData = z.infer<typeof venueSchema>;

interface AddVenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVenueForm: React.FC<AddVenueFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);

  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      coordinates: null,
      capacity: 50,
      pricing_unit: 'day',
      price_per_day: 10000,
      price_per_hour: 2000,
      venue_type: '',
      amenities: [],
      images: [],
      is_active: true,
      booking_terms: {
        payment_type: 'deposit_only',
        deposit_percentage: 30,
        cancellation_time_value: 7,
        cancellation_time_unit: 'days',
        refund_percentage: 100,
        transaction_fee_deduction: 3,
        processing_fee_amount: 500,
        payment_due_days: 7,
        advance_booking_days: 2,
        minimum_booking_duration: 4,
        minimum_booking_unit: 'hours',
        installment_count: 2,
        installment_interval_days: 30,
        late_payment_daily_rate: 2,
        maximum_late_fee_percentage: 25,
        grace_period_value: 24,
        grace_period_unit: 'hours',
        platform_commission_percentage: 10,
        agree_to_platform_terms: false,
        agree_to_legal_compliance: false,
        agree_to_service_delivery: false,
        special_terms: ''
      },
      blocked_dates: []
    }
  });

  const onSubmit = async (data: VenueFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const venueData = {
        name: data.name,
        description: data.description,
        location: data.location,
        coordinates: data.coordinates,
        capacity: data.capacity,
        pricing_unit: data.pricing_unit,
        price_per_day: data.pricing_unit === 'day' ? data.price_per_day : null,
        price_per_hour: data.pricing_unit === 'hour' ? data.price_per_hour : null,
        venue_type: data.venue_type,
        amenities: data.amenities || [],
        images: uploadedImages,
        is_active: data.is_active,
        owner_id: user.id,
        booking_terms: data.booking_terms,
        blocked_dates: blockedDates
      };

      const { error } = await supabase
        .from('venues')
        .insert(venueData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue added successfully with flexible pricing options!"
      });

      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      onSuccess();
    } catch (error) {
      console.error('Error adding venue:', error);
      toast({
        title: "Error",
        description: "Failed to add venue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Venue</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <VenueFormFields form={form} />
            
            <ImageUpload
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              onImagesChange={(images) => form.setValue('images', images)}
              bucketName="venue-images"
              label="Venue Images"
              inputId="image-upload"
              error={form.formState.errors.images?.message}
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
                {isSubmitting ? 'Adding...' : 'Add Venue'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddVenueForm;
