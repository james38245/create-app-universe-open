
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield } from 'lucide-react';

const ServiceProviderSecurityAlert: React.FC = () => {
  return (
    <Alert className="border-blue-200 bg-blue-50">
      <Shield className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-blue-800">
        <strong>Security & Verification Process:</strong> All service provider profiles undergo verification to ensure platform security. 
        After submission, you'll receive a verification email and our team will review your profile before it goes live.
      </AlertDescription>
    </Alert>
  );
};

export default ServiceProviderSecurityAlert;
