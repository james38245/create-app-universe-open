
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
  price: number;
  rating: number;
  image: string;
  type: string;
  availability: 'available' | 'limited' | 'booked';
}

interface VenueCardProps {
  venue: Venue;
}

const VenueCard: React.FC<VenueCardProps> = ({ venue }) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-500';
      case 'limited': return 'bg-yellow-500';
      case 'booked': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={venue.image} 
          alt={venue.name}
          className="w-full h-48 object-cover"
        />
        <Badge 
          className={`absolute top-2 right-2 ${getAvailabilityColor(venue.availability)} text-white`}
        >
          {venue.availability}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{venue.name}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{venue.rating}</span>
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
            <Badge variant="secondary">{venue.type}</Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">KSh {venue.price.toLocaleString()}</span>
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
