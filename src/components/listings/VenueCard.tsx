
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, MapPin, Users, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ValidationStatusBadge from './ValidationStatusBadge';

interface VenueCardProps {
  venue: any;
  onDelete: (venueId: string) => void;
}

const VenueCard = ({ venue, onDelete }: VenueCardProps) => {
  const queryClient = useQueryClient();

  const deleteVenueMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      toast({
        title: "Success",
        description: "Venue deleted successfully"
      });
      onDelete(venue.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive"
      });
    }
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{venue.name}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <ValidationStatusBadge 
              status={venue.verification_status} 
              score={venue.verification_score}
            />
            <Badge variant={venue.is_active ? "default" : "secondary"}>
              {venue.is_active ? "Live" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {venue.location}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            Capacity: {venue.capacity} guests
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4" />
            KSh {venue.price_per_day?.toLocaleString()}/day
          </div>

          {venue.verification_status === 'pending' && (
            <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded">
              📋 Under admin review - estimated completion within 24 hours
            </div>
          )}

          {venue.verification_status === 'rejected' && venue.validation_notes && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              ❌ Issues to resolve: {venue.validation_notes}
            </div>
          )}

          {venue.verification_status === 'verified' && !venue.is_active && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ✅ Approved by admin - Waiting to go live
            </div>
          )}

          {venue.amenities && venue.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {venue.amenities.slice(0, 3).map((amenity: string, index: number) => (
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
            onClick={() => deleteVenueMutation.mutate(venue.id)}
            disabled={deleteVenueMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
