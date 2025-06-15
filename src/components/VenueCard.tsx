
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import VenueCardImage from './venue/VenueCardImage';
import VenueCardInfo from './venue/VenueCardInfo';
import VenueCardPricing from './venue/VenueCardPricing';
import VenueCardActions from './venue/VenueCardActions';

interface VenueCardProps {
  venue: {
    id: string;
    name: string;
    location: string;
    price: number;
    price_per_day: number;
    rating: number;
    reviews: number;
    total_reviews: number;
    capacity: number;
    image: string;
    images: string[];
    amenities: string[];
    description: string;
    venue_type: string;
    is_active: boolean;
  };
  layout?: 'grid' | 'list';
}

const VenueCard: React.FC<VenueCardProps> = ({ venue, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <VenueCardImage venue={venue} layout={layout} />
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <VenueCardInfo venue={venue} layout={layout} />
                <div className="mt-4 md:mt-0 md:text-right md:ml-6">
                  <VenueCardPricing venue={venue} layout={layout} />
                  <VenueCardActions venue={venue} layout={layout} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 group">
      <VenueCardImage venue={venue} layout={layout} />
      
      <CardContent className="p-4">
        <VenueCardInfo venue={venue} layout={layout} />
        <VenueCardPricing venue={venue} layout={layout} />
        <VenueCardActions venue={venue} layout={layout} />
      </CardContent>
    </Card>
  );
};

export default VenueCard;
