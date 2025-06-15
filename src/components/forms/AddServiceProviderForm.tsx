
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceProviderFormProvider } from './ServiceProviderFormProvider';
import ServiceProviderFormContent from './ServiceProviderFormContent';
import { ServiceProviderFormData } from '@/types/venue';

interface AddServiceProviderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingProvider?: ServiceProviderFormData;
}

const AddServiceProviderForm: React.FC<AddServiceProviderFormProps> = ({ 
  onSuccess, 
  onCancel,
  editingProvider
}) => {
  const handleSubmit = async (data: ServiceProviderFormData) => {
    console.log('Service provider form submitted:', data);
    // TODO: Implement actual submission logic
    onSuccess();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <ServiceProviderFormProvider 
            onSubmit={handleSubmit}
            onCancel={onCancel}
            editingProvider={editingProvider}
          >
            <ServiceProviderFormContent />
          </ServiceProviderFormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddServiceProviderForm;
