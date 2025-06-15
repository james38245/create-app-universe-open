
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Form } from '@/components/ui/form';
import { venueSchema, VenueFormData, defaultVenueFormValues } from '@/types/venue';
import VenueFormContent from './VenueFormContent';

interface VenueFormProviderProps {
  onSubmit: (data: VenueFormData) => Promise<void>;
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
    await onSubmit(data);
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
      </form>
    </Form>
  );
};

export default VenueFormProvider;
