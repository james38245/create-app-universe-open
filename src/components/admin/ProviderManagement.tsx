
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

const ProviderManagement = () => {
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch service providers
  const { data: providers } = useQuery({
    queryKey: ['admin-providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_providers')
        .select(`
          *,
          profiles!service_providers_user_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const updateProviderMutation = useMutation({
    mutationFn: async (provider: any) => {
      const { error } = await supabase
        .from('service_providers')
        .update(provider)
        .eq('id', provider.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
      toast.success('Provider updated successfully');
      setEditingProvider(null);
    },
    onError: (error) => {
      toast.error('Failed to update provider: ' + error.message);
    }
  });

  const deleteProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', providerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
      toast.success('Provider deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete provider: ' + error.message);
    }
  });

  const toggleProviderStatus = async (providerId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('service_providers')
      .update({ is_available: !currentStatus })
      .eq('id', providerId);

    if (error) {
      console.error('Error updating provider status:', error);
      toast.error('Failed to update provider status');
    } else {
      queryClient.invalidateQueries({ queryKey: ['admin-providers'] });
      toast.success('Provider status updated successfully');
    }
  };

  return (
    <div className="space-y-6">
      <ListingVerificationPanel />
      
      <Card>
        <CardHeader>
          <CardTitle>All Service Providers</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {providers?.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.profiles?.full_name || provider.profiles?.email || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{provider.service_category}</Badge>
                  </TableCell>
                  <TableCell>{provider.years_experience}+ years</TableCell>
                  <TableCell>KSh {provider.price_per_event?.toLocaleString()}</TableCell>
                  <TableCell>
                    <ValidationStatusBadge 
                      status={provider.verification_status as VerificationStatus} 
                      score={provider.verification_score}
                    />
                  </TableCell>
                  <TableCell>
                    <Badge variant={provider.is_available ? "default" : "secondary"}>
                      {provider.is_available ? "Available" : "Busy"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setEditingProvider(provider)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Service Provider</DialogTitle>
                          </DialogHeader>
                          {editingProvider && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="service_category">Service Category</Label>
                                <Input
                                  id="service_category"
                                  value={editingProvider.service_category || ''}
                                  onChange={(e) => setEditingProvider({...editingProvider, service_category: e.target.value})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="price_per_event">Price per Event</Label>
                                <Input
                                  id="price_per_event"
                                  type="number"
                                  value={editingProvider.price_per_event || ''}
                                  onChange={(e) => setEditingProvider({...editingProvider, price_per_event: parseFloat(e.target.value)})}
                                />
                              </div>
                              <div>
                                <Label htmlFor="years_experience">Years of Experience</Label>
                                <Input
                                  id="years_experience"
                                  type="number"
                                  value={editingProvider.years_experience || ''}
                                  onChange={(e) => setEditingProvider({...editingProvider, years_experience: parseInt(e.target.value)})}
                                />
                              </div>
                              <Button onClick={() => updateProviderMutation.mutate(editingProvider)}>
                                Save Changes
                              </Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleProviderStatus(provider.id, provider.is_available)}
                      >
                        {provider.is_available ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
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
                              This action cannot be undone. This will permanently delete the service provider.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => deleteProviderMutation.mutate(provider.id)}>
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

export default ProviderManagement;
