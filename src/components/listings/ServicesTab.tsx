
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import ServiceProviderCard from './ServiceProviderCard';
import EmptyState from './EmptyState';

interface ServicesTabProps {
  serviceProviders: any[];
  providersLoading: boolean;
  onAddService: () => void;
}

const ServicesTab = ({ serviceProviders, providersLoading, onAddService }: ServicesTabProps) => {
  const handleDeleteProvider = async (providerId: string) => {
    const { error } = await supabase
      .from('service_providers')
      .delete()
      .eq('id', providerId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete service provider profile",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Service provider profile deleted successfully"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Services</h2>
        <Button onClick={onAddService}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {providersLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : serviceProviders && serviceProviders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceProviders.map((provider) => (
            <ServiceProviderCard 
              key={provider.id}
              provider={provider}
              onDelete={handleDeleteProvider}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={User}
          title="No services yet"
          description="Start by creating your service provider profile"
          buttonText="Add Your First Service"
          onButtonClick={onAddService}
        />
      )}
    </div>
  );
};

export default ServicesTab;
