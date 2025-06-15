
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const ServiceProviderFormHeader: React.FC = () => {
  return (
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <CheckCircle className="h-5 w-5 text-green-600" />
        Create Service Provider Profile - Secure Submission
      </CardTitle>
    </CardHeader>
  );
};

export default ServiceProviderFormHeader;
