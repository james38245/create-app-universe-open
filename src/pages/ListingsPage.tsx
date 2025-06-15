
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, User } from 'lucide-react';
import AddVenueForm from '@/components/forms/AddVenueForm';
import AddServiceProviderForm from '@/components/forms/AddServiceProviderForm';
import VenuesTab from '@/components/listings/VenuesTab';
import ServicesTab from '@/components/listings/ServicesTab';

const ListingsPage = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('venues');
  const [showAddVenueForm, setShowAddVenueForm] = useState(false);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);
  const [editingProvider, setEditingProvider] = useState(null);

  // Check for edit data in location state
  useEffect(() => {
    if (location.state?.editVenue) {
      setEditingVenue(location.state.editVenue);
      setShowAddVenueForm(true);
      setActiveTab('venues');
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
    if (location.state?.editProvider) {
      setEditingProvider(location.state.editProvider);
      setShowAddServiceForm(true);
      setActiveTab('services');
      // Clear the state to prevent issues on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const { data: venues, isLoading: venuesLoading } = useQuery({
    queryKey: ['my-venues', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const { data: serviceProviders, isLoading: providersLoading } = useQuery({
    queryKey: ['my-service-providers', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from('service_providers')
        .select('*')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const handleVenueFormSuccess = () => {
    setShowAddVenueForm(false);
    setEditingVenue(null);
  };

  const handleVenueFormCancel = () => {
    setShowAddVenueForm(false);
    setEditingVenue(null);
  };

  const handleServiceFormSuccess = () => {
    setShowAddServiceForm(false);
    setEditingProvider(null);
  };

  const handleServiceFormCancel = () => {
    setShowAddServiceForm(false);
    setEditingProvider(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Please sign in to manage your listings</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showAddVenueForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <AddVenueForm 
              onSuccess={handleVenueFormSuccess}
              onCancel={handleVenueFormCancel}
              editingVenue={editingVenue}
            />
          </div>
        </div>
      </div>
    );
  }

  if (showAddServiceForm) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <AddServiceProviderForm 
              onSuccess={handleServiceFormSuccess}
              onCancel={handleServiceFormCancel}
              editingProvider={editingProvider}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">My Listings</h1>
            <p className="text-muted-foreground">
              Manage your venues and service provider profiles
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="venues" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Venues ({venues?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Services ({serviceProviders?.length || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="venues">
              <VenuesTab 
                venues={venues || []}
                venuesLoading={venuesLoading}
                onAddVenue={() => setShowAddVenueForm(true)}
              />
            </TabsContent>

            <TabsContent value="services">
              <ServicesTab 
                serviceProviders={serviceProviders || []}
                providersLoading={providersLoading}
                onAddService={() => setShowAddServiceForm(true)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
