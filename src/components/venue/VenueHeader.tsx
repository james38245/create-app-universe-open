
import React from 'react';
import { Star, MapPin, Users } from 'lucide-react';

interface VenueHeaderProps {
  name: string;
  location: string;
  rating: number;
  reviews: number;
  capacity: number;
}

const VenueHeader: React.FC<VenueHeaderProps> = ({
  name,
  location,
  rating,
  reviews,
  capacity
}) => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-2">{name}</h1>
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{rating}</span>
          <span className="text-muted-foreground">({reviews} reviews)</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span>Up to {capacity} guests</span>
        </div>
      </div>
    </div>
  );
};

export default VenueHeader;
