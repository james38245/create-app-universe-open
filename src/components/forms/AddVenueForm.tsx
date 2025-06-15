
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import VenueFormProvider from './VenueFormProvider';
import { VenueFormData } from '@/types/venue';
import { venueValidationSchema, sanitizeFormData, validateImageUrls } from '@/utils/listingValidation';
import { useVerification } from '@/hooks/useVerification';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AddVenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVenueForm: React.FC<AddVenueFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { initiateVerification, isInitiating } = useVerification();
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: VenueFormData, images: string[], dates: string[]) => {
    if (!user) return;

    setIsSubmitting(true);
    
    try {
      // Sanitize all input data
      const sanitizedData = sanitizeFormData(data);
      
      // Validate images
      const validatedImages = validateImageUrls(images);
      if (validatedImages.length !== images.length) {
        toast({
          title: "Security Warning",
          description: "Some images were rejected for security reasons. Please use approved image hosting services.",
          variant: "destructive"
        });
        return;
      }

      // Validate form data with enhanced schema
      const validationResult = venueValidationSchema.safeParse({
        ...sanitizedData,
        images: validatedImages
      });

      if (!validationResult.success) {
        const errors = validationResult.error.errors.map(err => err.message).join(', ');
        toast({
          title: "Validation Failed",
          description: errors,
          variant: "destructive"
        });
        return;
      }

      const venueData = {
        name: sanitizedData.name,
        description: sanitizedData.description,
        location: sanitizedData.location,
        coordinates: sanitizedData.coordinates,
        capacity: sanitizedData.capacity,
        pricing_unit: sanitizedData.pricing_unit,
        price_per_day: sanitizedData.pricing_unit === 'day' ? sanitizedData.price_per_day : null,
        price_per_hour: sanitizedData.pricing_unit === 'hour' ? sanitizedData.price_per_hour : null,
        venue_type: sanitizedData.venue_type,
        amenities: sanitizedData.amenities || [],
        images: validatedImages,
        is_active: false, // Will be activated after verification
        owner_id: user.id,
        booking_terms: sanitizedData.booking_terms,
        blocked_dates: dates,
        verification_status: 'pending'
      };

      const { data: venueResult, error } = await supabase
        .from('venues')
        .insert(venueData)
        .select('id, name')
        .single();

      if (error) throw error;

      // Get user profile for email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', user.id)
        .single();

      if (!profile) throw new Error('User profile not found');

      // Initiate verification process
      await initiateVerification(
        'venue',
        venueResult.id,
        user.id,
        venueResult.name,
        profile.email,
        profile.full_name || profile.email.split('@')[0]
      );

      toast({
        title: "Venue Submitted Successfully",
        description: "Your venue has been submitted and a verification email has been sent. Please check your email to complete the verification process."
      });

      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      onSuccess();
    } catch (error: any) {
      console.error('Error adding venue:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit venue for verification",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Button>
      </div>
      
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Security & Verification Process:</strong> All venue listings undergo verification to ensure platform security. 
          After submission, you'll receive a verification email and our team will review your listing before it goes live.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Add New Venue - Secure Submission
          </CardTitle>
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
            isSubmitting={isSubmitting || isInitiating}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVenueForm;
