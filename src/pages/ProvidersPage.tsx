
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import SearchBar from '@/components/SearchBar';
import { Users, Grid, List, Filter } from 'lucide-react';
import ServiceProviderCard from '@/components/ServiceProviderCard';

const ProvidersPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProviders, setFilteredProviders] = useState<any[]>([]);

  const { data: providers, isLoading } = useQuery({
    queryKey: ['service-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_user_id_fkey(full_name, email, avatar_url)
        `)
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const [displayedProviders, setDisplayedProviders] = useState(providers || []);

  React.useEffect(() => {
    if (providers) {
      setDisplayedProviders(providers);
    }
  }, [providers]);

  const handleSearch = (searchTerm: string, capacity?: number, location?: string, category?: string) => {
    let filtered = providers || [];

    if (searchTerm) {
      filtered = filtered.filter(provider =>
        provider.service_category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.bio?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category) {
      filtered = filtered.filter(provider => provider.service_category === category);
    }

    setDisplayedProviders(filtered);
    setFilteredProviders(filtered);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Service Providers
              </h1>
              <p className="text-gray-600 text-lg">Loading professional service providers...</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-12 w-12 bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transform providers data to match ServiceProviderCard expected format
  const transformedProviders = displayedProviders.map(provider => ({
    id: provider.id,
    business_name: provider.profiles?.full_name || 'Service Provider',
    service_type: provider.service_category || 'General Services',
    location: 'Kenya', // Default location since it's not in the current schema
    base_price: provider.price_per_event || 0,
    rating: provider.rating || 0,
    total_reviews: provider.total_reviews || 0,
    description: provider.bio || 'Professional service provider',
    image_url: provider.profiles?.avatar_url,
    specialties: provider.specialties || [],
    is_available: provider.is_available || false,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Find Professional Service Providers
            </h1>
            <p className="text-gray-600 text-lg">
              Discover amazing service providers for your next event
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search service providers by category, name, or location..."
              searchType="providers"
            />
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                {transformedProviders.length} service provider{transformedProviders.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Service Providers Grid/List */}
          {transformedProviders.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {transformedProviders.map((provider) => (
                <ServiceProviderCard 
                  key={provider.id} 
                  provider={provider}
                  layout={viewMode}
                />
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="text-center py-16">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No service providers found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all providers
                </p>
                <Button 
                  onClick={() => {
                    setDisplayedProviders(providers || []);
                    setFilteredProviders([]);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Show All Providers
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
