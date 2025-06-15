
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Users } from 'lucide-react';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { useServiceProviderTransform } from '@/hooks/useServiceProviderTransform';

const ProvidersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const { transformProviders } = useServiceProviderTransform();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['service-providers', searchTerm, serviceFilter, locationFilter],
    queryFn: async () => {
      let query = supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_user_id_fkey(full_name, avatar_url)
        `)
        .eq('admin_verified', true)
        .eq('is_available', true);

      if (searchTerm) {
        query = query.or(`bio.ilike.%${searchTerm}%,service_category.ilike.%${searchTerm}%`);
      }

      if (serviceFilter !== 'all') {
        query = query.eq('service_category', serviceFilter);
      }

      const { data, error } = await query.order('rating', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Get unique service categories for filter
  const { data: serviceCategories } = useQuery({
    queryKey: ['service-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select('service_category')
        .eq('admin_verified', true);
      
      if (error) throw error;
      
      const categories = [...new Set(data?.map(p => p.service_category))];
      return categories.filter(Boolean);
    },
  });

  const transformedProviders = transformProviders(providers || []);

  const filteredProviders = transformedProviders.filter(provider => {
    const matchesSearch = searchTerm === '' || 
      provider.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.service_type.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocation = locationFilter === 'all' || 
      provider.location.toLowerCase().includes(locationFilter.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading service providers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Find Professional Service Providers
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified professionals for your events and special occasions
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search providers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Service Filter */}
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Service Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  {serviceCategories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Location Filter */}
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="nairobi">Nairobi</SelectItem>
                  <SelectItem value="mombasa">Mombasa</SelectItem>
                  <SelectItem value="kisumu">Kisumu</SelectItem>
                  <SelectItem value="nakuru">Nakuru</SelectItem>
                </SelectContent>
              </Select>

              {/* Layout Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setLayout('grid')}
                  className={`px-3 py-2 rounded ${layout === 'grid' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setLayout('list')}
                  className={`px-3 py-2 rounded ${layout === 'list' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  List
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-gray-600" />
            <span className="text-gray-600">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </span>
          </div>
          
          <div className="flex gap-2">
            {serviceFilter !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setServiceFilter('all')}>
                {serviceFilter.replace('_', ' ')} ✕
              </Badge>
            )}
            {locationFilter !== 'all' && (
              <Badge variant="secondary" className="cursor-pointer" onClick={() => setLocationFilter('all')}>
                {locationFilter} ✕
              </Badge>
            )}
          </div>
        </div>

        {/* Providers Grid/List */}
        {filteredProviders.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No providers found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
            </CardContent>
          </Card>
        ) : (
          <div className={layout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-6"
          }>
            {filteredProviders.map((provider) => (
              <ServiceProviderCard
                key={provider.id}
                provider={provider}
                layout={layout}
                showDocuments={false}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersPage;
