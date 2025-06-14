
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
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  price_per_day: z.number().min(1, 'Price must be greater than 0'),
  venue_type: z.string().min(1, 'Venue type is required'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  is_active: z.boolean().default(true),
  booking_terms: z.object({
    payment_type: z.enum(['deposit_only', 'full_payment', 'installments']).default('deposit_only'),
    deposit_percentage: z.number().min(0).max(100),
    cancellation_policy: z.string(),
    payment_due_days: z.number().min(1),
    advance_booking_days: z.number().min(1),
    minimum_booking_duration: z.number().min(1),
    minimum_booking_unit: z.enum(['hours', 'days']).default('hours'),
    installment_count: z.number().optional(),
    installment_interval_days: z.number().optional(),
    late_payment_policy: z.string().optional(),
    special_terms: z.string().optional()
  }).optional(),
  blocked_dates: z.array(z.string()).optional()
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
      capacity: 50,
      price_per_day: 10000,
      venue_type: '',
      amenities: [],
      images: [],
      is_active: true,
      booking_terms: {
        payment_type: 'deposit_only',
        deposit_percentage: 30,
        cancellation_policy: 'Full refund if cancelled 7 days before event',
        payment_due_days: 7,
        advance_booking_days: 2,
        minimum_booking_duration: 4,
        minimum_booking_unit: 'hours',
        installment_count: 2,
        installment_interval_days: 30,
        late_payment_policy: '',
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
        capacity: data.capacity,
        price_per_day: data.price_per_day,
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
        description: "Venue added successfully with comprehensive booking terms!"
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
