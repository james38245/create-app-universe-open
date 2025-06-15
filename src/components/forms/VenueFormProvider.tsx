
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Form } from '@/components/ui/form';
import { venueSchema, VenueFormData, defaultVenueFormValues } from '@/types/venue';
import { sanitizeFormData, venueValidationSchema } from '@/utils/listingValidation';
import { toast } from '@/hooks/use-toast';
import VenueFormContent from './VenueFormContent';
import VenuePaymentSection from './VenuePaymentSection';

interface VenueFormProviderProps {
  onSubmit: (data: VenueFormData, uploadedImages: string[], blockedDates: string[]) => Promise<void>;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  blockedDates: string[];
  setBlockedDates: (dates: string[]) => void;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

const VenueFormProvider: React.FC<VenueFormProviderProps> = ({
  onSubmit,
  uploadedImages,
  setUploadedImages,
  blockedDates,
  setBlockedDates,
  userProfile,
  setUserProfile,
  onCancel,
  isSubmitting = false
}) => {
  const { user } = useAuth();

  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: defaultVenueFormValues
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('payment_account_type, payment_account_number, payment_account_name')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };
    fetchUserProfile();
  }, [user, setUserProfile]);

  const handleSubmit = async (data: VenueFormData) => {
    try {
      // Check if payment account is set up
      if (!userProfile?.payment_account_type || !userProfile?.payment_account_number || !userProfile?.payment_account_name) {
        toast({
          title: 'Payment Account Required',
          description: 'Please complete your payment account settings before adding a venue.',
          variant: 'destructive',
        });
        return;
      }

      // Sanitize form data for security
      const sanitizedData = sanitizeFormData(data);

      // Validate against security schema
      const validationResult = venueValidationSchema.safeParse({
        name: sanitizedData.name,
        description: sanitizedData.description,
        location: sanitizedData.location,
        venue_type: sanitizedData.venue_type,
        capacity: sanitizedData.capacity,
        price_per_day: sanitizedData.price_per_day,
        price_per_hour: sanitizedData.price_per_hour,
        amenities: sanitizedData.amenities || [],
        images: uploadedImages,
        booking_terms: sanitizedData.booking_terms
      });

      if (!validationResult.success) {
        toast({
          title: 'Validation Failed',
          description: `Please fix the following issues: ${validationResult.error.issues.map(i => i.message).join(', ')}`,
          variant: 'destructive',
        });
        return;
      }

      await onSubmit(sanitizedData, uploadedImages, blockedDates);
    } catch (error: any) {
      toast({
        title: 'Submission Failed',
        description: error.message || 'Failed to submit venue listing',
        variant: 'destructive',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <VenueFormContent
          form={form}
          isSubmitting={isSubmitting}
          uploadedImages={uploadedImages}
          setUploadedImages={setUploadedImages}
          blockedDates={blockedDates}
          setBlockedDates={setBlockedDates}
          onCancel={onCancel}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
        />
        
        <VenuePaymentSection
          form={form}
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          hideActions={true}
        />
      </form>
    </Form>
  );
};

export default VenueFormProvider;
