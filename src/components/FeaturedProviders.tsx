
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const FeaturedProviders = () => {
  const navigate = useNavigate();

  const { data: providers, isLoading } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles!inner(business_name)
        `)
        .eq('is_available', true)
        .eq('admin_verified', true)
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      // Transform the data to match ServiceProviderCard expectations
      return data?.map(provider => ({
        id: provider.id,
        business_name: provider.profiles?.business_name || 'Business Name',
        service_type: provider.service_type || 'general',
        location: provider.location || 'Location',
        base_price: provider.hourly_rate || 0,
        rating: 4.5, // Default rating
        total_reviews: 0, // Default reviews
        description: provider.bio || 'No description available',
        image_url: provider.images?.[0] || '/placeholder.svg',
        specialties: provider.specialties || [],
        is_available: provider.is_available
      })) || [];
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Service Providers</h2>
            <p className="text-gray-600">Loading amazing service providers...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Service Providers</h2>
          <p className="text-gray-600">Discover professional services for your events</p>
        </div>
        
        {providers && providers.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {providers.map((provider) => (
                <ServiceProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => navigate('/providers')} size="lg">
                View All Providers
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No service providers available yet.</p>
            <Button onClick={() => navigate('/providers')}>
              Browse Providers
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
