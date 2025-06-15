
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { ServiceProviderFormProvider } from './ServiceProviderFormProvider';
import ServiceProviderFormContent from './ServiceProviderFormContent';
import { ServiceProviderFormData } from '@/types/venue';
import { toast } from '@/hooks/use-toast';

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
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const createProviderMutation = useMutation({
    mutationFn: async (data: ServiceProviderFormData) => {
      console.log('Creating service provider with data:', data);
      
      // Map form data to database schema
      const providerData = {
        user_id: user?.id,
        service_category: data.service_type || '', // Map service_type to service_category
        bio: data.bio || '',
        years_experience: data.experience_years || 0,
        price_per_event: data.price_per_event || 0,
        portfolio_images: data.portfolio_images || [],
        specialties: data.specialties || [],
        certifications: data.certifications || [],
        blocked_dates: data.blocked_dates || [],
        booking_terms: data.booking_terms || null,
        verification_status: 'pending',
        is_available: false
      };

      const { data: provider, error } = await supabase
        .from('service_providers')
        .insert([providerData])
        .select()
        .single();

      if (error) throw error;
      return provider;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-service-providers'] });
      toast({
        title: "Success",
        description: "Service provider profile submitted for admin review"
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error creating service provider:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create service provider profile",
        variant: "destructive"
      });
    }
  });

  const updateProviderMutation = useMutation({
    mutationFn: async (data: ServiceProviderFormData) => {
      console.log('Updating service provider with data:', data);
      
      // Map form data to database schema
      const providerData = {
        service_category: data.service_type || '',
        bio: data.bio || '',
        years_experience: data.experience_years || 0,
        price_per_event: data.price_per_event || 0,
        portfolio_images: data.portfolio_images || [],
        specialties: data.specialties || [],
        certifications: data.certifications || [],
        blocked_dates: data.blocked_dates || [],
        booking_terms: data.booking_terms || null,
        verification_status: 'pending'
      };

      const { data: provider, error } = await supabase
        .from('service_providers')
        .update(providerData)
        .eq('id', editingProvider?.id)
        .select()
        .single();

      if (error) throw error;
      return provider;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-service-providers'] });
      toast({
        title: "Success",
        description: "Service provider profile updated and submitted for review"
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error('Error updating service provider:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update service provider profile",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = async (data: ServiceProviderFormData) => {
    if (editingProvider) {
      await updateProviderMutation.mutateAsync(data);
    } else {
      await createProviderMutation.mutateAsync(data);
    }
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
