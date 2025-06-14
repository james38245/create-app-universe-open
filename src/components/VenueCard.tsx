
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  price_per_day: number;
  rating: number | null;
  images: string[] | null;
  venue_type: string;
  is_active: boolean;
  total_reviews: number | null;
  description: string | null;
}

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const displayImage = venue.images && venue.images.length > 0 ? venue.images[0] : '/placeholder.svg';
  const displayRating = venue.rating || 0;
  const displayReviews = venue.total_reviews || 0;

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={displayImage} 
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${venue.is_active ? 'bg-green-500' : 'bg-red-500'} text-white`}
        >
          {venue.is_active ? 'Available' : 'Unavailable'}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{venue.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{displayRating.toFixed(1)}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{venue.location}</span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{venue.capacity} guests</span>
            </div>
            <Badge variant="secondary">{venue.venue_type}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">KSh {venue.price_per_day.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/day</span>
            </div>
            <Link to={`/venue/${venue.id}`}>
              <Button className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Book Now
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
