
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import ValidationStatusBadge from '../listings/ValidationStatusBadge';
import ListingVerificationPanel from './ListingVerificationPanel';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type VerificationStatus = 'pending' | 'under_review' | 'verified' | 'rejected';

const VenueManagement = () => {
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch venues
  const { data: venues } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateVenueMutation = useMutation({
    mutationFn: async (venue: any) => {
      const { error } = await supabase
        .from('venues')
        .update(venue)
        .eq('id', venue.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success('Venue updated successfully');
      setEditingVenue(null);
    },
    onError: (error) => {
      toast.error('Failed to update venue: ' + error.message);
    }
  });

  const deleteVenueMutation = useMutation({
    mutationFn: async (venueId: string) => {
      const { error } = await supabase
        .from('venues')
        .delete()
        .eq('id', venueId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success('Venue deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete venue: ' + error.message);
    }
  });

  const toggleVenueStatus = async (venueId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('venues')
      .update({ is_active: !currentStatus })
      .eq('id', venueId);

    if (error) {
      console.error('Error updating venue status:', error);
      toast.error('Failed to update venue status');
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast.success('Venue status updated successfully');
    }
  };

  return (
    <div className="space-y-6">
      <ListingVerificationPanel />
      
      <Card>
        <CardHeader>
          <CardTitle>All Venues</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {venues?.map((venue) => (
                <TableRow key={venue.id}>
                  <TableCell>{venue.name}</TableCell>
                  <TableCell>{venue.location}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{venue.venue_type}</Badge>
                  </TableCell>
                  <TableCell>KSh {venue.price_per_day?.toLocaleString()}</TableCell>
                  <TableCell>
                    <ValidationStatusBadge 
                      status={venue.verification_status as VerificationStatus} 
                      score={venue.verification_score}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={venue.is_active ? "default" : "secondary"}>
                      {venue.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingVenue(venue)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Venue</DialogTitle>
                          </DialogHeader>
                          {editingVenue && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  value={editingVenue.name || ''}
                                  onChange={(e) => setEditingVenue({...editingVenue, name: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                  id="location"
                                  value={editingVenue.location || ''}
                                  onChange={(e) => setEditingVenue({...editingVenue, location: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="price_per_day">Price per Day</Label>
                                <Input
                                  id="price_per_day"
                                  type="number"
                                  value={editingVenue.price_per_day || ''}
                                  onChange={(e) => setEditingVenue({...editingVenue, price_per_day: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="capacity">Capacity</Label>
                                <Input
                                  id="capacity"
                                  type="number"
                                  value={editingVenue.capacity || ''}
                                  onChange={(e) => setEditingVenue({...editingVenue, capacity: parseInt(e.target.value)})}
                                />
                              </div>
                              <Button onClick={() => updateVenueMutation.mutate(editingVenue)}>
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleVenueStatus(venue.id, venue.is_active)}
                      >
                        {venue.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the venue.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteVenueMutation.mutate(venue.id)}>
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default VenueManagement;
