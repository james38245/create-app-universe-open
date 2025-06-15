
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import ServiceProviderFormFields from './ServiceProviderFormFields';
import { ServiceProviderFormData } from './ServiceProviderFormProvider';

interface ServiceProviderFormContentProps {
  form: UseFormReturn<ServiceProviderFormData>;
}

const ServiceProviderFormContent: React.FC<ServiceProviderFormContentProps> = ({ form }) => {
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return '';
  };

  return (
    <Card>
      <CardContent className="p-6">
        <ServiceProviderFormFields 
          form={form}
          getErrorMessage={getErrorMessage}
        />
      </CardContent>
    </Card>
  );
};

export default ServiceProviderFormContent;
