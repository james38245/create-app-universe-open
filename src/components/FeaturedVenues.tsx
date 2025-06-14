
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { VenueCard } from '@/components/VenueCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const FeaturedVenues = () => {
  const navigate = useNavigate();

  const { data: venues, isLoading } = useQuery({
    queryKey: ['featured-venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Venues</h2>
            <p className="text-gray-600">Loading amazing venues...</p>
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Venues</h2>
          <p className="text-gray-600">Discover the most popular venues for your events</p>
        </div>
        
        {venues && venues.length > 0 ? (
          <>
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {venues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
            <div className="text-center">
              <Button onClick={() => navigate('/venues')} size="lg">
                View All Venues
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No venues available yet.</p>
            <Button onClick={() => navigate('/venues')}>
              Browse Venues
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
