
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
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
}

const VenueFormContent: React.FC<VenueFormContentProps> = ({
  form,
  isSubmitting,
  uploadedImages,
  setUploadedImages,
  blockedDates,
  setBlockedDates,
  onCancel
}) => {
  return (
    <>
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
    </>
  );
};

export default VenueFormContent;
