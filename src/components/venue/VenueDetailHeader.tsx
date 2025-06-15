
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Star } from 'lucide-react';

interface VenueDetailHeaderProps {
  venue: {
    name: string;
    venueType: string;
    location: string;
    capacity: number;
    rating: number;
    reviews: number;
  };
}

const VenueDetailHeader: React.FC<VenueDetailHeaderProps> = ({ venue }) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h1 className="text-3xl font-bold">{venue.name}</h1>
        <Badge variant="secondary">{venue.venueType}</Badge>
      </div>
      <div className="flex items-center gap-4 text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          <span>{venue.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>Up to {venue.capacity} guests</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span>{venue.rating} ({venue.reviews} reviews)</span>
        </div>
      </div>
    </div>
  );
};

export default VenueDetailHeader;
