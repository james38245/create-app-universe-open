
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ServiceProvider {
  id: string;
  name: string;
  service: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  avatar: string;
  isAvailable: boolean;
  specialties: string[];
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider }) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={provider.avatar} alt={provider.name} />
            <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{provider.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{provider.service}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{provider.rating}</span>
              <span className="text-sm text-muted-foreground">({provider.reviews})</span>
            </div>
          </div>
          
          <Badge variant={provider.isAvailable ? "default" : "secondary"}>
            {provider.isAvailable ? "Available" : "Busy"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{provider.location}</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {provider.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">KSh {provider.price.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/event</span>
            </div>
            
            <div className="flex gap-2">
              <Link to={`/messages?provider=${provider.id}`}>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </Link>
              <Link to={`/provider/${provider.id}`}>
                <Button size="sm">
                  <Phone className="h-4 w-4 mr-1" />
                  Hire
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderCard;
