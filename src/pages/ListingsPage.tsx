
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building, User, Eye, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';

const ListingsPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('venues');

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

  const handleDeleteVenue = async (venueId: string) => {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Venue deleted successfully"
      });
    }
  };

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

            <TabsContent value="venues" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Venues</h2>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Venue
                </Button>
              </div>

              {venuesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : venues && venues.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {venues.map((venue) => (
                    <Card key={venue.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{venue.name}</CardTitle>
                          <Badge variant={venue.is_active ? "default" : "secondary"}>
                            {venue.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-muted-foreground">{venue.location}</p>
                          <p className="text-sm">Capacity: {venue.capacity} guests</p>
                          <p className="text-sm font-semibold">KSh {venue.price_per_day.toLocaleString()}/day</p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteVenue(venue.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No venues yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your first venue listing</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Venue
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="services" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">My Services</h2>
                <Button>
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
                    <Card key={provider.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{provider.service_category}</CardTitle>
                          <Badge variant={provider.is_available ? "default" : "secondary"}>
                            {provider.is_available ? "Available" : "Busy"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 mb-4">
                          <p className="text-sm text-muted-foreground">
                            {provider.years_experience || 0} years experience
                          </p>
                          <p className="text-sm font-semibold">
                            KSh {provider.price_per_event.toLocaleString()}/event
                          </p>
                          {provider.specialties && provider.specialties.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {provider.specialties.slice(0, 2).map((specialty, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {specialty}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteProvider(provider.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No services yet</h3>
                  <p className="text-muted-foreground mb-4">Start by creating your service provider profile</p>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Service
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ListingsPage;
