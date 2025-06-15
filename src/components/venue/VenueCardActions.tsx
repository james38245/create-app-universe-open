
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Phone, MessageSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface VenueCardActionsProps {
  venue: {
    id: string;
    name: string;
  };
  layout?: 'grid' | 'list';
}

const VenueCardActions: React.FC<VenueCardActionsProps> = ({ venue, layout = 'grid' }) => {
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

  const handleBookNow = () => {
    navigate(`/booking/venue/${venue.id}`);
  };

  if (layout === 'list') {
    return (
      <div className="flex flex-col gap-2">
        <Button 
          onClick={handleBookNow}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Now
        </Button>
        
        <Link to={`/venue/${venue.id}`}>
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
    );
  }

  return (
    <div className="space-y-2">
      <Button 
        onClick={handleBookNow}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Now
      </Button>
      
      <Link to={`/venue/${venue.id}`}>
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
  );
};

export default VenueCardActions;
