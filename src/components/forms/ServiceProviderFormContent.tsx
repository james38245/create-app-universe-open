
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import ServiceProviderFormFields from './ServiceProviderFormFields';
import ImageUpload from './ImageUpload';
import BookingTermsSettings from './BookingTermsSettings';
import AvailabilityCalendar from './AvailabilityCalendar';

interface ServiceProviderFormContentProps {
  form: UseFormReturn<any>;
  uploadedImages: string[];
  setUploadedImages: (images: string[]) => void;
  blockedDates: string[];
  setBlockedDates: (dates: string[]) => void;
}

const ServiceProviderFormContent: React.FC<ServiceProviderFormContentProps> = ({
  form,
  uploadedImages,
  setUploadedImages,
  blockedDates,
  setBlockedDates
}) => {
  return (
    <>
      <ServiceProviderFormFields form={form} />
      
      <ImageUpload
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        onImagesChange={(images) => form.setValue('portfolio_images', images)}
        bucketName="portfolio-images"
        label="Portfolio Images"
        inputId="portfolio-upload"
        error={form.formState.errors.portfolio_images?.message}
      />

      <BookingTermsSettings form={form} />

      <AvailabilityCalendar
        blockedDates={blockedDates}
        setBlockedDates={setBlockedDates}
        onDatesChange={(dates) => form.setValue('blocked_dates', dates)}
      />
    </>
  );
};

export default ServiceProviderFormContent;
