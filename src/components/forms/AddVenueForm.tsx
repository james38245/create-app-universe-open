
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import VenueFormProvider from './VenueFormProvider';
import VenueFormContent from './VenueFormContent';
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

  const handleSubmit = async (data: VenueFormData, images: string[], dates: string[]) => {
    if (!user) return;

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
      images: images,
      is_active: data.is_active,
      owner_id: user.id,
      booking_terms: data.booking_terms,
      blocked_dates: dates
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
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add New Venue</CardTitle>
        </CardHeader>
        <CardContent>
          <VenueFormProvider
            onSubmit={handleSubmit}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            blockedDates={blockedDates}
            setBlockedDates={setBlockedDates}
            userProfile={userProfile}
            setUserProfile={setUserProfile}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVenueForm;
