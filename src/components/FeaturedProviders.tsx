
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ServiceProviderCard from '@/components/ServiceProviderCard';
import { Button } from '@/components/ui/button';

export const FeaturedProviders = () => {
  const { data: providers, isLoading } = useQuery({
    queryKey: ['featured-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_user_id_fkey(full_name, email)
        `)
        .eq('is_available', true)
        .order('rating', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Top Service Providers</h2>
            <p className="text-gray-600">Loading expert providers...</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-24 w-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-2/3 mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Top Service Providers</h2>
          <p className="text-gray-600">Connect with the best professionals for your events</p>
        </div>
        
        {providers && providers.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">
            {providers.map((provider) => (
              <ServiceProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No service providers available yet.</p>
            <Button>
              Browse Providers
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
