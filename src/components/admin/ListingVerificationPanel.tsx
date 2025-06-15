
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { CheckCircle, XCircle, Eye, FileText, MapPin, DollarSign, Users, Clock } from 'lucide-react';
import ValidationStatusBadge from '../listings/ValidationStatusBadge';

const ListingVerificationPanel = () => {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const queryClient = useQueryClient();

  // Fetch pending listings
  const { data: pendingListings, isLoading } = useQuery({
    queryKey: ['admin-pending-listings'],
    queryFn: async () => {
      const [venuesResult, providersResult] = await Promise.all([
        supabase
          .from('venues')
          .select(`
            *,
            owner:profiles!venues_owner_id_fkey(full_name, email, phone)
          `)
          .in('verification_status', ['pending', 'under_review'])
          .order('created_at', { ascending: false }),
        
        supabase
          .from('service_providers')
          .select(`
            *,
            user:profiles!service_providers_user_id_fkey(full_name, email, phone)
          `)
          .in('verification_status', ['pending', 'under_review'])
          .order('created_at', { ascending: false })
      ]);

      if (venuesResult.error) throw venuesResult.error;
      if (providersResult.error) throw providersResult.error;

      return {
        venues: venuesResult.data || [],
        providers: providersResult.data || []
      };
    }
  });

  // Mutation to approve/reject listings
  const verificationMutation = useMutation({
    mutationFn: async ({ 
      entityType, 
      entityId, 
      action, 
      notes 
    }: { 
      entityType: 'venue' | 'service_provider';
      entityId: string;
      action: 'approve' | 'reject';
      notes?: string;
    }) => {
      const status = action === 'approve' ? 'verified' : 'rejected';
      const tableName = entityType === 'venue' ? 'venues' : 'service_providers';
      
      const { error } = await supabase
        .from(tableName)
        .update({
          verification_status: status,
          admin_verified: action === 'approve',
          admin_verified_at: new Date().toISOString(),
          admin_verified_by: (await supabase.auth.getUser()).data.user?.id,
          validation_notes: notes || null,
          is_active: action === 'approve' && entityType === 'venue',
          is_available: action === 'approve' && entityType === 'service_provider'
        })
        .eq('id', entityId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-pending-listings'] });
      toast.success('Listing verification updated successfully');
      setSelectedListing(null);
      setAdminNotes('');
    },
    onError: (error) => {
      toast.error('Failed to update verification: ' + error.message);
    }
  });

  const handleVerification = (action: 'approve' | 'reject') => {
    if (!selectedListing) return;
    
    verificationMutation.mutate({
      entityType: selectedListing.entity_type,
      entityId: selectedListing.id,
      action,
      notes: adminNotes
    });
  };

  const renderListingDetails = (listing: any, entityType: 'venue' | 'service_provider') => {
    if (entityType === 'venue') {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{listing.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Capacity: {listing.capacity}</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">KSh {listing.price_per_day?.toLocaleString()}/day</span>
            </div>
            <div>
              <Badge variant="outline">{listing.venue_type}</Badge>
            </div>
          </div>
          
          <div>
            <Label className="font-semibold">Description</Label>
            <p className="text-sm text-muted-foreground mt-1">{listing.description}</p>
          </div>

          {listing.amenities && listing.amenities.length > 0 && (
            <div>
              <Label className="font-semibold">Amenities</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {listing.amenities.map((amenity: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Badge variant="outline">{listing.service_category}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{listing.years_experience}+ years exp</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">KSh {listing.price_per_event?.toLocaleString()}/event</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Responds in {listing.response_time_hours}h</span>
            </div>
          </div>
          
          <div>
            <Label className="font-semibold">Bio</Label>
            <p className="text-sm text-muted-foreground mt-1">{listing.bio}</p>
          </div>

          {listing.specialties && listing.specialties.length > 0 && (
            <div>
              <Label className="font-semibold">Specialties</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {listing.specialties.map((specialty: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {listing.certifications && listing.certifications.length > 0 && (
            <div>
              <Label className="font-semibold">Certifications</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {listing.certifications.map((cert: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Pending Listings...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalPending = (pendingListings?.venues.length || 0) + (pendingListings?.providers.length || 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Listing Verification Queue
          <Badge variant="secondary">{totalPending} pending</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="venues" className="space-y-4">
          <TabsList>
            <TabsTrigger value="venues">
              Venues ({pendingListings?.venues.length || 0})
            </TabsTrigger>
            <TabsTrigger value="providers">
              Service Providers ({pendingListings?.providers.length || 0})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="venues" className="space-y-4">
            {pendingListings?.venues.map((venue) => (
              <div key={venue.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{venue.name}</h3>
                      <ValidationStatusBadge 
                        status={venue.verification_status} 
                        score={venue.verification_score}
                      />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Owner: {venue.owner?.full_name} ({venue.owner?.email})</p>
                      <p>Location: {venue.location}</p>
                      <p>Price: KSh {venue.price_per_day?.toLocaleString()}/day</p>
                      <p>Security Score: {venue.verification_score}%</p>
                      {venue.validation_notes && (
                        <p className="text-red-600">Issues: {venue.validation_notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedListing({...venue, entity_type: 'venue'})}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Venue Verification: {venue.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {renderListingDetails(venue, 'venue')}
                        
                        <div>
                          <Label htmlFor="admin-notes">Admin Notes</Label>
                          <Textarea
                            id="admin-notes"
                            placeholder="Add notes about this listing verification..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={() => handleVerification('approve')}
                            disabled={verificationMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve & Go Live
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleVerification('reject')}
                            disabled={verificationMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="providers" className="space-y-4">
            {pendingListings?.providers.map((provider) => (
              <div key={provider.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{provider.service_category}</h3>
                      <ValidationStatusBadge 
                        status={provider.verification_status} 
                        score={provider.verification_score}
                      />
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Provider: {provider.user?.full_name} ({provider.user?.email})</p>
                      <p>Experience: {provider.years_experience}+ years</p>
                      <p>Price: KSh {provider.price_per_event?.toLocaleString()}/event</p>
                      <p>Security Score: {provider.verification_score}%</p>
                      {provider.validation_notes && (
                        <p className="text-red-600">Issues: {provider.validation_notes}</p>
                      )}
                    </div>
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedListing({...provider, entity_type: 'service_provider'})}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Review
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Service Provider Verification: {provider.service_category}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        {renderListingDetails(provider, 'service_provider')}
                        
                        <div>
                          <Label htmlFor="admin-notes">Admin Notes</Label>
                          <Textarea
                            id="admin-notes"
                            placeholder="Add notes about this listing verification..."
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="flex gap-2 pt-4">
                          <Button
                            onClick={() => handleVerification('approve')}
                            disabled={verificationMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve & Go Live
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleVerification('reject')}
                            disabled={verificationMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {totalPending === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>No pending listings to review</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListingVerificationPanel;
