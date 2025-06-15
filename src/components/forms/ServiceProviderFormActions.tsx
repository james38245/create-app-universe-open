
import React from 'react';
import { Button } from '@/components/ui/button';

interface ServiceProviderFormActionsProps {
  onCancel: () => void;
  isSubmitting: boolean;
  isInitiating: boolean;
}

const ServiceProviderFormActions: React.FC<ServiceProviderFormActionsProps> = ({
  onCancel,
  isSubmitting,
  isInitiating
}) => {
  return (
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
        disabled={isSubmitting || isInitiating}
        className="flex-1"
      >
        {isSubmitting || isInitiating ? 'Submitting...' : 'Submit for Verification'}
      </Button>
    </div>
  );
};

export default ServiceProviderFormActions;
