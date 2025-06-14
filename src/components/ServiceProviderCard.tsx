
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface ServiceProvider {
  id: string;
  service_category: string;
  specialties: string[] | null;
  price_per_event: number;
  rating: number | null;
  total_reviews: number | null;
  is_available: boolean;
  bio: string | null;
  years_experience: number | null;
  portfolio_images: string[] | null;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
}

const ServiceProviderCard: React.FC<ServiceProviderCardProps> = ({ provider }) => {
  const navigate = useNavigate();
  const displayName = provider.profiles.full_name || provider.profiles.email.split('@')[0];
  const displayRating = provider.rating || 0;
  const displayReviews = provider.total_reviews || 0;
  const displaySpecialties = provider.specialties || [];
  const displayPricePerEvent = provider.price_per_event || 0;
  const displayYearsExperience = provider.years_experience || 0;
  const avatarImage = provider.portfolio_images && provider.portfolio_images.length > 0 
    ? provider.portfolio_images[0] 
    : '/placeholder.svg';

  const handleCardClick = () => {
    navigate(`/provider/${provider.id}`);
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/messages?provider=${provider.id}`);
  };

  const handleHireClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/provider/${provider.id}`);
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={avatarImage} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg line-clamp-1">{displayName}</CardTitle>
            <p className="text-sm text-muted-foreground">{provider.service_category}</p>
            <div className="flex items-center gap-1 mt-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{displayRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">({displayReviews})</span>
            </div>
          </div>
          
          <Badge variant={provider.is_available ? "default" : "secondary"}>
            {provider.is_available ? "Available" : "Busy"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{displayYearsExperience}+ years experience</span>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {displaySpecialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg font-bold">KSh {displayPricePerEvent.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">/event</span>
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleMessageClick}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button 
                size="sm"
                onClick={handleHireClick}
              >
                <Phone className="h-4 w-4 mr-1" />
                Hire
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderCard;
