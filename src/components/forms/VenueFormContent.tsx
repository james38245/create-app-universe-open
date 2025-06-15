
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';
import VenueFormFields from './VenueFormFields';
import AvailabilityCalendar from './AvailabilityCalendar';
import BookingTermsSettings from './BookingTermsSettings';
import { VenueFormData } from '@/types/venue';

interface VenueFormContentProps {
  form: UseFormReturn<VenueFormData>;
  isSubmitting: boolean;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  blockedDates: string[];
  setBlockedDates: (dates: string[]) => void;
  onCancel: () => void;
  userProfile?: any;
  setUserProfile?: (profile: any) => void;
}

const VenueFormContent: React.FC<VenueFormContentProps> = ({
  form,
  isSubmitting,
  uploadedImages,
  setUploadedImages,
  blockedDates,
  setBlockedDates,
  onCancel,
  userProfile
}) => {
  // Watch form values to determine if form is complete
  const watchedValues = form.watch();
  
  // Check if payment account is set up
  const hasPaymentAccount = userProfile?.payment_account_type && 
                          userProfile?.payment_account_number && 
                          userProfile?.payment_account_name;

  // Check if all required fields are filled
  const isFormComplete = () => {
    const requiredFields = {
      name: watchedValues.name,
      description: watchedValues.description,
      location: watchedValues.location,
      venue_type: watchedValues.venue_type,
      capacity: watchedValues.capacity,
      pricing_unit: watchedValues.pricing_unit,
    };

    // Check if basic required fields are filled
    const basicFieldsComplete = Object.values(requiredFields).every(value => 
      value !== undefined && value !== null && value !== '' && value !== 0
    );

    // Check pricing based on unit
    const pricingComplete = watchedValues.pricing_unit === 'day' 
      ? watchedValues.price_per_day > 0
      : watchedValues.price_per_hour > 0;

    // Check if at least one image is uploaded
    const hasImages = uploadedImages && uploadedImages.length > 0;

    return basicFieldsComplete && pricingComplete && hasImages && hasPaymentAccount;
  };

  return (
    <>
      {/* Payment Account Status Alert */}
      <div className="border rounded-lg p-4 bg-card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Payment Account Status</h3>
          {hasPaymentAccount ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Required
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {hasPaymentAccount 
            ? "Your payment account is set up and ready for venue listings."
            : "Please complete your payment account setup below before submitting your venue."
          }
        </p>
      </div>

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

      <div className="flex gap-4 pt-6 border-t">
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
          disabled={isSubmitting || !isFormComplete()}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Submitting for Admin Review...' : 'Submit for Admin Approval'}
        </Button>
      </div>
    </>
  );
};

export default VenueFormContent;
