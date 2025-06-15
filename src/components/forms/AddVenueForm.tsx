
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import VenueFormProvider from './VenueFormProvider';
import { VenueFormData } from '@/types/venue';
import { toast } from '@/hooks/use-toast';

interface AddVenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingVenue?: VenueFormData;
}

const AddVenueForm: React.FC<AddVenueFormProps> = ({ 
  onSuccess, 
  onCancel,
  editingVenue
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [uploadedImages, setUploadedImages] = useState<string[]>(editingVenue?.images || []);
  const [blockedDates, setBlockedDates] = useState<string[]>(editingVenue?.blocked_dates || []);
  const [userProfile, setUserProfile] = useState<any>(null);

  const createVenueMutation = useMutation({
    mutationFn: async (data: VenueFormData) => {
      console.log('Creating venue with data:', data);
      
      const venueData = {
        ...data,
        owner_id: user?.id,
        images: uploadedImages,
        blocked_dates: blockedDates,
        verification_status: 'pending',
        is_active: false
      };

      const { data: venue, error } = await supabase
        .from('venues')
        .insert([venueData])
        .select()
        .single();

      if (error) throw error;
      return venue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      toast({
        title: "Success",
        description: "Venue submitted for admin review"
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create venue",
        variant: "destructive"
      });
    }
  });

  const updateVenueMutation = useMutation({
    mutationFn: async (data: VenueFormData) => {
      console.log('Updating venue with data:', data);
      
      const venueData = {
        ...data,
        images: uploadedImages,
        blocked_dates: blockedDates,
        verification_status: 'pending'
      };

      const { data: venue, error } = await supabase
        .from('venues')
        .update(venueData)
        .eq('id', editingVenue?.id)
        .select()
        .single();

      if (error) throw error;
      return venue;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      toast({
        title: "Success",
        description: "Venue updated and submitted for review"
      });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update venue",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (data: VenueFormData) => {
    if (editingVenue) {
      await updateVenueMutation.mutateAsync(data);
    } else {
      await createVenueMutation.mutateAsync(data);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <VenueFormProvider 
            onSubmit={handleSubmit}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            blockedDates={blockedDates}
            setBlockedDates={setBlockedDates}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onCancel={onCancel}
            isSubmitting={createVenueMutation.isPending || updateVenueMutation.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVenueForm;
