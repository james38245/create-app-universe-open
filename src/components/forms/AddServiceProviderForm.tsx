
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import ServiceProviderFormProvider from './ServiceProviderFormProvider';

interface AddServiceProviderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddServiceProviderForm: React.FC<AddServiceProviderFormProps> = ({ 
  onSuccess, 
  onCancel 
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <ServiceProviderFormProvider 
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddServiceProviderForm;
