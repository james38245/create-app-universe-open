
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Users } from 'lucide-react';
import ServiceProviderCard from '@/components/ServiceProviderCard';

const ProvidersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');

  const { data: providers, isLoading } = useQuery({
    queryKey: ['service-providers', searchQuery, categoryFilter, availabilityFilter],
    queryFn: async () => {
      let query = supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_user_id_fkey(full_name, email)
        `);

      if (availabilityFilter === 'available') {
        query = query.eq('is_available', true);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('service_category', categoryFilter);
      }

      if (searchQuery) {
        query = query.or(`service_category.ilike.%${searchQuery}%,profiles.full_name.ilike.%${searchQuery}%`);
      }

      const { data, error } = await query.order('rating', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const categories = [
    'Photography',
    'Catering',
    'Music & DJ',
    'Event Planning',
    'Decoration',
    'Security',
    'Transportation',
    'Entertainment'
  ];

  const filteredProviders = providers || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">Service Providers</h1>
              <p className="text-muted-foreground">Loading professional service providers...</p>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Service Providers</h1>
            <p className="text-muted-foreground">
              Discover professional service providers for your events
            </p>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search service providers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="available">Available Only</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders.map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>

          {/* Empty State */}
          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No providers found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProvidersPage;
