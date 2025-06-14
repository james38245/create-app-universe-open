
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Form } from '@/components/ui/form';
import { venueSchema, VenueFormData, defaultVenueFormValues } from '@/types/venue';

interface VenueFormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: VenueFormData, uploadedImages: string[], blockedDates: string[]) => Promise<void>;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  blockedDates: string[];
  setBlockedDates: (dates: string[]) => void;
  userProfile: any;
  setUserProfile: (profile: any) => void;
}

const VenueFormProvider: React.FC<VenueFormProviderProps> = ({
  children,
  onSubmit,
  uploadedImages,
  setUploadedImages,
  blockedDates,
  setBlockedDates,
  userProfile,
  setUserProfile
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      await onSubmit(data, uploadedImages, blockedDates);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {React.cloneElement(children as React.ReactElement, {
          form,
          isSubmitting,
          uploadedImages,
          setUploadedImages,
          blockedDates,
          setBlockedDates,
          userProfile
        })}
      </form>
    </Form>
  );
};

export default VenueFormProvider;
