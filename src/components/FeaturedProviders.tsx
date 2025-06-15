
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceProviderCard from './ServiceProviderCard';

const FeaturedProviders = () => {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_user_id_fkey(full_name, avatar_url)
        `)
        .eq('admin_verified', true)
        .eq('is_available', true)
        .limit(6);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-48 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  const transformedProviders = providers?.map(provider => ({
    id: provider.id,
    user_id: provider.user_id,
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
  })) || [];

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Service Providers
          </h2>
          <p className="text-lg text-gray-600">
            Discover talented professionals for your next event
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {transformedProviders.map((provider) => (
            <ServiceProviderCard
              key={provider.id}
              provider={provider}
              layout="grid"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProviders;
