
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import ServiceProviderFormFields from './ServiceProviderFormFields';

interface ServiceProviderFormData {
  bio?: string;
  blocked_dates?: string[];
  booking_terms?: any;
  certifications?: string[];
  coordinates?: { lat: number; lng: number };
  experience_years?: number;
  hourly_rate?: number;
  id?: string;
  image_url?: string;
  images?: string[];
  location?: string;
  phone?: string;
  portfolio_images?: string[];
  service_area?: string[];
  service_type?: string;
  social_links?: any;
  specialties?: string[];
  user_id?: string;
}

interface ServiceProviderFormContentProps {
  form: UseFormReturn<ServiceProviderFormData>;
}

const ServiceProviderFormContent: React.FC<ServiceProviderFormContentProps> = ({ form }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <ServiceProviderFormFields form={form} />
      </CardContent>
    </Card>
  );
};

export default ServiceProviderFormContent;
