
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Send } from 'lucide-react';
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{venue.name}</CardTitle>
          <Badge variant={venue.is_active ? "default" : "secondary"}>
            {venue.is_active ? "Posted" : "Draft"}
          </Badge>
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
        </div>
        <div className="flex gap-2 flex-wrap">
          {!venue.is_active && (
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
        </div>
      </CardContent>
    </Card>
  );
};

export default VenueCard;
