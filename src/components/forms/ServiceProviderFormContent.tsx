
import React from 'react';
import { useServiceProviderForm } from './ServiceProviderFormProvider';
import { Card, CardContent } from '@/components/ui/card';
import ServiceProviderFormFields from './ServiceProviderFormFields';

const ServiceProviderFormContent: React.FC = () => {
  const { form } = useServiceProviderForm();

  return (
    <Card>
      <CardContent className="p-6">
        <ServiceProviderFormFields form={form} />
      </CardContent>
    </Card>
  );
};

export default ServiceProviderFormContent;
