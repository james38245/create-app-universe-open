
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Users, Phone, MessageSquare, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const handleContact = () => {
    const params = new URLSearchParams({
      user: venue.id,
      name: venue.name,
      role: 'venue_owner'
    });
    navigate(`/messages?${params.toString()}`);
  };

  const handleCall = () => {
    window.location.href = `tel:+254700000000`;
  };

  if (layout === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img 
                src={venue.image} 
                alt={venue.name}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
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
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{venue.description}</p>
                  
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

                <div className="mt-4 md:mt-0 md:text-right md:ml-6">
                  <p className="text-2xl font-bold text-purple-600 mb-4">
                    KSh {venue.price_per_day.toLocaleString()}
                    <span className="text-sm text-gray-500 font-normal">/day</span>
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <Link to={`/venue/${venue.id}`}>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleCall}
                        className="flex-1"
                      >
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleContact}
                        className="flex-1"
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                    </div>
                  </div>
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
      
      <CardContent className="p-4">
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
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-purple-600">
              KSh {venue.price_per_day.toLocaleString()}
            </span>
            <span className="text-sm text-gray-500">/day</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <Link to={`/venue/${venue.id}`}>
            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </Link>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCall}
              className="flex-1"
            >
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleContact}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              Message
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
