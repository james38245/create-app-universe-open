
import React, { createContext, useContext } from 'react';
import { useForm, UseFormReturn } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ServiceProviderFormData } from '@/types/venue';

const serviceProviderSchema = z.object({
  bio: z.string().min(50, { message: 'Bio must be at least 50 characters.' }),
  experience_years: z.number().min(0, { message: 'Years of experience is required.' }),
  price_per_event: z.number().min(5000, { message: 'Price per event must be at least KSh 5,000.' }),
  price_per_hour: z.number().optional(),
  pricing_unit: z.enum(['event', 'hour']).default('event'),
  portfolio_images: z.array(z.string()).default([]),
  specialties: z.array(z.string()).min(1, { message: 'Please select at least one specialty.' }),
  certifications: z.array(z.string()).default([]),
  location: z.string().optional(),
  blocked_dates: z.array(z.string()).default([]),
  booking_terms: z.any().optional(),
  coordinates: z.object({ 
    lat: z.number().optional(), 
    lng: z.number().optional() 
  }).nullable().optional(),
  service_type: z.string().min(1, { message: 'Service category is required.' }),
  response_time_hours: z.number().default(24),
  is_available: z.boolean().default(true),
});

type ServiceProviderFormContextType = {
  form: UseFormReturn<ServiceProviderFormData>;
  onSubmit: (data: ServiceProviderFormData) => Promise<void>;
  isSubmitting: boolean;
  setIsSubmitting: (submitting: boolean) => void;
  onCancel: () => void;
  editingProvider?: ServiceProviderFormData;
};

const ServiceProviderFormContext = createContext<ServiceProviderFormContextType | undefined>(undefined);

export const useServiceProviderForm = () => {
  const context = useContext(ServiceProviderFormContext);
  if (context === undefined) {
    throw new Error('useServiceProviderForm must be used within a ServiceProviderFormProvider');
  }
  return context;
};

interface ServiceProviderFormProviderProps {
  children: React.ReactNode;
  onSubmit: (data: ServiceProviderFormData) => Promise<void>;
  onCancel: () => void;
  editingProvider?: ServiceProviderFormData;
}

export const ServiceProviderFormProvider: React.FC<ServiceProviderFormProviderProps> = ({
  children,
  onSubmit,
  onCancel,
  editingProvider
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const defaultValues: ServiceProviderFormData = {
    bio: editingProvider?.bio || '',
    experience_years: editingProvider?.experience_years || 0,
    price_per_event: editingProvider?.price_per_event || 5000,
    price_per_hour: editingProvider?.price_per_hour || 0,
    pricing_unit: editingProvider?.pricing_unit || 'event',
    portfolio_images: editingProvider?.portfolio_images || [],
    specialties: editingProvider?.specialties || [],
    certifications: editingProvider?.certifications || [],
    location: editingProvider?.location || '',
    blocked_dates: editingProvider?.blocked_dates || [],
    booking_terms: editingProvider?.booking_terms || null,
    coordinates: editingProvider?.coordinates || null,
    service_type: editingProvider?.service_type || '',
    response_time_hours: 24,
    is_available: true,
  };

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues,
  });

  return (
    <ServiceProviderFormContext.Provider value={{
      form,
      onSubmit,
      isSubmitting,
      setIsSubmitting,
      onCancel,
      editingProvider
    }}>
      {children}
    </ServiceProviderFormContext.Provider>
  );
};
