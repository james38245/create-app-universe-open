
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import VenueCard from './VenueCard';
import EmptyState from './EmptyState';

interface VenuesTabProps {
  venues: any[];
  venuesLoading: boolean;
  onAddVenue: () => void;
}

const VenuesTab = ({ venues, venuesLoading, onAddVenue }: VenuesTabProps) => {
  const handleDeleteVenue = async (venueId: string) => {
    const { error } = await supabase
      .from('venues')
      .delete()
      .eq('id', venueId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete venue",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Venue deleted successfully"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">My Venues</h2>
        <Button onClick={onAddVenue}>
          <Plus className="h-4 w-4 mr-2" />
          Add Venue
        </Button>
      </div>

      {venuesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
            </div>
          ))}
        </div>
      ) : venues && venues.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <VenueCard 
              key={venue.id}
              venue={venue}
              onDelete={handleDeleteVenue}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Building}
          title="No venues yet"
          description="Start by creating your first venue listing"
          buttonText="Add Your First Venue"
          onButtonClick={onAddVenue}
        />
      )}
    </div>
  );
};

export default VenuesTab;
