
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import BasicVenueFields from './BasicVenueFields';
import VenueCapacityField from './VenueCapacityField';
import VenuePricingFields from './VenuePricingFields';
import VenueAmenitiesField from './VenueAmenitiesField';
import VenueActiveField from './VenueActiveField';

interface VenueFormFieldsProps {
  form: UseFormReturn<any>;
}

const VenueFormFields: React.FC<VenueFormFieldsProps> = ({ form }) => {
  return (
    <>
      <BasicVenueFields form={form} />
      <VenueCapacityField form={form} />
      <VenuePricingFields form={form} />
      <VenueAmenitiesField form={form} />
      <VenueActiveField form={form} />
    </>
  );
};

export default VenueFormFields;
