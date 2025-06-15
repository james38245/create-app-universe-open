
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Users } from 'lucide-react';

interface VenueCardInfoProps {
  venue: {
    id: string;
    name: string;
    location: string;
    rating: number;
    total_reviews: number;
    capacity: number;
    amenities: string[];
    description?: string;
    venue_type: string;
  };
  layout?: 'grid' | 'list';
}

const VenueCardInfo: React.FC<VenueCardInfoProps> = ({ venue, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="text-xl font-semibold text-gray-900">{venue.name}</h3>
          <Badge variant="secondary" className="text-xs">
            {venue.venue_type.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{venue.rating}</span>
          <span className="text-sm text-gray-500">({venue.total_reviews} reviews)</span>
        </div>
        
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{venue.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Up to {venue.capacity} guests</span>
          </div>
        </div>
        
        {venue.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{venue.description}</p>
        )}
        
        <div className="flex flex-wrap gap-1 mb-4">
          {venue.amenities.slice(0, 3).map((amenity, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {amenity}
            </Badge>
          ))}
          {venue.amenities.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{venue.amenities.length - 3} more
            </Badge>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-1 mb-2">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="text-sm font-medium">{venue.rating}</span>
        <span className="text-sm text-gray-500">({venue.total_reviews})</span>
      </div>
      
      <h3 className="font-semibold text-lg mb-2 line-clamp-1">{venue.name}</h3>
      
      <div className="flex items-center gap-1 text-gray-600 mb-2">
        <MapPin className="h-4 w-4" />
        <span className="text-sm">{venue.location}</span>
      </div>
      
      <div className="flex items-center gap-1 text-gray-600 mb-3">
        <Users className="h-4 w-4" />
        <span className="text-sm">Up to {venue.capacity} guests</span>
      </div>
      
      <div className="flex flex-wrap gap-1 mb-4">
        {venue.amenities.slice(0, 2).map((amenity, index) => (
          <Badge key={index} variant="outline" className="text-xs">
            {amenity}
          </Badge>
        ))}
        {venue.amenities.length > 2 && (
          <Badge variant="outline" className="text-xs">
            +{venue.amenities.length - 2}
          </Badge>
        )}
      </div>
    </>
  );
};

export default VenueCardInfo;
