
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface VenueCardImageProps {
  venue: {
    image: string;
    name: string;
    venue_type: string;
  };
  layout?: 'grid' | 'list';
}

const VenueCardImage: React.FC<VenueCardImageProps> = ({ venue, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="md:w-1/3">
        <img 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-48 md:h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <img 
        src={venue.image} 
        alt={venue.name}
        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
      />
      <Badge 
        className="absolute top-3 right-3 bg-white/90 text-gray-900"
        variant="secondary"
      >
        {venue.venue_type.replace('_', ' ')}
      </Badge>
    </div>
  );
};

export default VenueCardImage;
