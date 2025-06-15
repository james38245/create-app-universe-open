
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Phone, MessageSquare, Eye, Calendar, DollarSign } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ServiceProviderCardProps {
  provider: {
    id: string;
    business_name: string;
    service_type: string;
    location: string;
    base_price: number;
    rating: number;
    total_reviews: number;
    description: string;
    image_url?: string;
    specialties: string[];
    is_available: boolean;
  };
  layout?: 'grid' | 'list';
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider, layout = 'grid' }) => {
  const navigate = useNavigate();

  const handleContact = () => {
    const params = new URLSearchParams({
      user: provider.id,
      name: provider.business_name,
      role: 'service_provider'
    });
    navigate(`/messages?${params.toString()}`);
  };

  const handleCall = () => {
    window.location.href = `tel:+254700000000`;
  };

  const handleBookNow = () => {
    navigate(`/provider/${provider.id}`);
  };

  if (layout === 'list') {
    return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-200">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3">
              <img 
                src={provider.image_url || '/placeholder.svg'} 
                alt={provider.business_name}
                className="w-full h-48 md:h-full object-cover"
              />
            </div>
            <div className="flex-1 p-6">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{provider.business_name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {provider.service_type.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{provider.rating}</span>
                    <span className="text-sm text-gray-500">({provider.total_reviews} reviews)</span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{provider.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      <span>From KSh {provider.base_price.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{provider.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {provider.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {provider.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{provider.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="mt-4 md:mt-0 md:text-right md:ml-6">
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    From KSh {provider.base_price.toLocaleString()}
                  </p>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      onClick={handleBookNow}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Service
                    </Button>
                    
                    <Link to={`/provider/${provider.id}`}>
                      <Button variant="outline" className="w-full">
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
          src={provider.image_url || '/placeholder.svg'} 
          alt={provider.business_name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <Badge 
          className="absolute top-3 right-3 bg-white/90 text-gray-900"
          variant="secondary"
        >
          {provider.service_type.replace('_', ' ')}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{provider.rating}</span>
          <span className="text-sm text-gray-500">({provider.total_reviews})</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{provider.business_name}</h3>
        
        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{provider.location}</span>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 mb-3">
          <DollarSign className="h-4 w-4" />
          <span className="text-sm">From KSh {provider.base_price.toLocaleString()}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {provider.specialties.slice(0, 2).map((specialty, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {specialty}
            </Badge>
          ))}
          {provider.specialties.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{provider.specialties.length - 2}
            </Badge>
          )}
        </div>
        
        <div className="space-y-2">
          <Button 
            onClick={handleBookNow}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Calendar className="h-4 w-4 mr-2" />
            Book Service
          </Button>
          
          <Link to={`/provider/${provider.id}`}>
            <Button variant="outline" className="w-full">
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

export default ServiceProviderCard;
