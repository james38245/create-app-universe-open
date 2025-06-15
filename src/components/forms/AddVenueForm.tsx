
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import VenueFormProvider from './VenueFormProvider';
import VenueFormContent from './VenueFormContent';
import { VenueFormData } from '@/types/venue';

interface AddVenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
  editingVenue?: VenueFormData;
}

const AddVenueForm: React.FC<AddVenueFormProps> = ({ 
  onSuccess, 
  onCancel,
  editingVenue
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent className="p-6">
          <VenueFormProvider 
            onSuccess={onSuccess}
            onCancel={onCancel}
            editingVenue={editingVenue}
          >
            <VenueFormContent />
          </VenueFormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddVenueForm;
