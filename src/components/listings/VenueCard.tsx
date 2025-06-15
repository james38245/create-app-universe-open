
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Send, Shield, Clock, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VenueCardProps {
  venue: any;
  onDelete: (venueId: string) => void;
}

const VenueCard = ({ venue, onDelete }: VenueCardProps) => {
  const queryClient = useQueryClient();

  const postVenueMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error } = await supabase
        .from('venues')
        .update({ is_active: true })
        .eq('id', venueId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      toast({
        title: "Success",
        description: "Venue posted successfully and is now visible to clients"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to post venue",
        variant: "destructive"
      });
    }
  });

  const getVerificationBadge = () => {
    const status = venue.verification_status || 'pending';
    
    switch (status) {
      case 'verified':
        return (
          <Badge variant="default" className="bg-green-600">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending Verification
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <Shield className="h-3 w-3 mr-1" />
            Draft
          </Badge>
        );
    }
  };

  const getStatusBadge = () => {
    if (venue.admin_verified) {
      return (
        <Badge variant="default" className="bg-blue-600">
          Admin Approved
        </Badge>
      );
    }
    if (venue.verification_status === 'verified') {
      return (
        <Badge variant="secondary">
          Under Review
        </Badge>
      );
    }
    return (
      <Badge variant={venue.is_active ? "default" : "secondary"}>
        {venue.is_active ? "Posted" : "Draft"}
      </Badge>
    );
  };

  const canPost = venue.verification_status === 'verified' && venue.admin_verified && !venue.is_active;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{venue.name}</CardTitle>
          <div className="flex flex-col gap-1">
            {getVerificationBadge()}
            {getStatusBadge()}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p className="text-sm text-muted-foreground">{venue.location}</p>
          <p className="text-sm">Capacity: {venue.capacity} guests</p>
          <p className="text-sm font-semibold">KSh {venue.price_per_day.toLocaleString()}/day</p>
          <p className="text-sm text-muted-foreground">{venue.venue_type}</p>
          {venue.amenities && venue.amenities.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Amenities: {venue.amenities.slice(0, 3).join(', ')}
              {venue.amenities.length > 3 && ` +${venue.amenities.length - 3} more`}
            </p>
          )}
          
          {venue.verification_status === 'pending' && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2 mt-3">
              <p className="text-xs text-yellow-800">
                <Shield className="h-3 w-3 inline mr-1" />
                Please check your email to complete verification
              </p>
            </div>
          )}
          
          {venue.verification_status === 'verified' && !venue.admin_verified && (
            <div className="bg-blue-50 border border-blue-200 rounded p-2 mt-3">
              <p className="text-xs text-blue-800">
                <Clock className="h-3 w-3 inline mr-1" />
                Under admin review - will be published once approved
              </p>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDelete(venue.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
          {canPost && (
            <Button 
              size="sm"
              onClick={() => postVenueMutation.mutate(venue.id)}
              disabled={postVenueMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4 mr-1" />
              Post
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
