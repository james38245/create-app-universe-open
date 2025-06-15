
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import VenueFormProvider from './VenueFormProvider';
import { VenueFormData } from '@/types/venue';

interface AddVenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVenueForm: React.FC<AddVenueFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);

  const createVenueMutation = useMutation({
    mutationFn: async ({ data, images, blocked }: { data: VenueFormData; images: string[]; blocked: string[] }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const venueData = {
        owner_id: user.id,
        name: data.name,
        description: data.description,
        location: data.location,
        capacity: data.capacity,
        pricing_unit: data.pricing_unit,
        price_per_day: data.pricing_unit === 'day' ? data.price_per_day : undefined,
        price_per_hour: data.pricing_unit === 'hour' ? data.price_per_hour : undefined,
        venue_type: data.venue_type,
        amenities: data.amenities || [],
        images: images,
        is_active: false, // Keep inactive until verified
        booking_terms: data.booking_terms,
        blocked_dates: blocked,
        verification_status: 'pending'
      };

      const { data: insertedData, error } = await supabase
        .from('venues')
        .insert([venueData])
        .select()
        .single();

      if (error) throw error;

      // Run validation after creation
      const validationData = {
        name: venueData.name,
        description: venueData.description,
        location: venueData.location,
        price_per_day: venueData.price_per_day || venueData.price_per_hour,
        capacity: venueData.capacity,
        images: venueData.images,
        venue_type: venueData.venue_type
      };

      const { error: validationError } = await supabase.rpc('validate_listing_data', {
        p_entity_type: 'venue',
        p_entity_id: insertedData.id,
        p_data: validationData
      });

      if (validationError) {
        console.error('Validation error:', validationError);
      }

      // Process verification after validation
      const { error: verificationError } = await supabase.rpc('process_listing_verification', {
        p_entity_type: 'venue',
        p_entity_id: insertedData.id
      });

      if (verificationError) {
        console.error('Verification processing error:', verificationError);
      }

      return insertedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      toast({
        title: 'Success!',
        description: 'Venue listing created and submitted for verification! Our team will review your listing within 24 hours.',
      });
      setUploadedImages([]);
      setBlockedDates([]);
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error creating venue:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to create venue listing',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (data: VenueFormData, images: string[], blocked: string[]) => {
    createVenueMutation.mutate({ data, images, blocked });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Add New Venue</h1>
            <p className="text-muted-foreground">
              Create a comprehensive venue listing with all required information, pricing, and booking terms.
              Your listing will be reviewed for security and quality before going live.
            </p>
          </div>
          
          <VenueFormProvider
            onSubmit={handleSubmit}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            blockedDates={blockedDates}
            setBlockedDates={setBlockedDates}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onCancel={onCancel}
            isSubmitting={createVenueMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVenueForm;
