import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Settings,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Plus
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingVenue, setEditingVenue] = useState<any>(null);
  const [editingProvider, setEditingProvider] = useState<any>(null);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const queryClient = useQueryClient();

  // Fetch overview stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [venuesResult, providersResult, bookingsResult, usersResult] = await Promise.all([
        supabase.from('venues').select('*', { count: 'exact' }),
        supabase.from('service_providers').select('*', { count: 'exact' }),
        supabase.from('bookings').select('*', { count: 'exact' }),
        supabase.from('profiles').select('*', { count: 'exact' })
      ]);

      return {
        totalVenues: venuesResult.count || 0,
        totalProviders: providersResult.count || 0,
        totalBookings: bookingsResult.count || 0,
        totalUsers: usersResult.count || 0
      };
    }
  });

  // Fetch users
  const { data: users } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

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

  // Fetch bookings
  const { data: bookings } = useQuery({
    queryKey: ['admin-bookings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          venues(name),
          service_providers(service_category)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Mutations for CRUD operations
  const updateUserMutation = useMutation({
    mutationFn: async (user: any) => {
      const { error } = await supabase
        .from('profiles')
        .update(user)
        .eq('id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User updated successfully');
      setEditingUser(null);
    },
    onError: (error) => {
      toast.error('Failed to update user: ' + error.message);
    }
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete user: ' + error.message);
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

  const updateBookingMutation = useMutation({
    mutationFn: async (booking: any) => {
      const { error } = await supabase
        .from('bookings')
        .update(booking)
        .eq('id', booking.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking updated successfully');
      setEditingBooking(null);
    },
    onError: (error) => {
      toast.error('Failed to update booking: ' + error.message);
    }
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      toast.success('Booking deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete booking: ' + error.message);
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
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage users, venues, service providers, and bookings
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Venues</CardTitle>
                    <Building className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalVenues || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalProviders || 0}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats?.totalBookings || 0}</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">New venue listed</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Service provider registered</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">New booking created</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>System Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Database</span>
                        <Badge variant="default" className="bg-green-500">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Payment System</span>
                        <Badge variant="default" className="bg-green-500">Online</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Email Service</span>
                        <Badge variant="default" className="bg-green-500">Online</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.full_name || 'N/A'}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.user_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit User</DialogTitle>
                                  </DialogHeader>
                                  {editingUser && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="full_name">Full Name</Label>
                                        <Input
                                          id="full_name"
                                          value={editingUser.full_name || ''}
                                          onChange={(e) => setEditingUser({...editingUser, full_name: e.target.value})}
                                        />
                                      </div>
                                      <div>
                                        <Label htmlFor="user_type">User Type</Label>
                                        <Select
                                          value={editingUser.user_type}
                                          onValueChange={(value) => setEditingUser({...editingUser, user_type: value})}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="client">Client</SelectItem>
                                            <SelectItem value="venue_owner">Venue Owner</SelectItem>
                                            <SelectItem value="service_provider">Service Provider</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                          id="phone"
                                          value={editingUser.phone || ''}
                                          onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                                        />
                                      </div>
                                      <Button onClick={() => updateUserMutation.mutate(editingUser)}>
                                        Save Changes
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
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
                                      This action cannot be undone. This will permanently delete the user.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteUserMutation.mutate(user.id)}>
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
            </TabsContent>

            <TabsContent value="venues" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Price</TableHead>
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
            </TabsContent>

            <TabsContent value="providers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Service Provider Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Experience</TableHead>
                        <TableHead>Price</TableHead>
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
            </TabsContent>

            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Service/Venue</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings?.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <Badge variant="outline">{booking.booking_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {booking.venues?.name || booking.service_providers?.service_category || 'N/A'}
                          </TableCell>
                          <TableCell>
                            {new Date(booking.event_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>KSh {booking.total_amount?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant={booking.status === 'confirmed' ? "default" : "secondary"}>
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm" onClick={() => setEditingBooking(booking)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Edit Booking</DialogTitle>
                                  </DialogHeader>
                                  {editingBooking && (
                                    <div className="space-y-4">
                                      <div>
                                        <Label htmlFor="status">Status</Label>
                                        <Select
                                          value={editingBooking.status}
                                          onValueChange={(value) => setEditingBooking({...editingBooking, status: value})}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="confirmed">Confirmed</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                            <SelectItem value="cancelled">Cancelled</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="payment_status">Payment Status</Label>
                                        <Select
                                          value={editingBooking.payment_status}
                                          onValueChange={(value) => setEditingBooking({...editingBooking, payment_status: value})}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="paid">Paid</SelectItem>
                                            <SelectItem value="refunded">Refunded</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div>
                                        <Label htmlFor="total_amount">Total Amount</Label>
                                        <Input
                                          id="total_amount"
                                          type="number"
                                          value={editingBooking.total_amount || ''}
                                          onChange={(e) => setEditingBooking({...editingBooking, total_amount: parseFloat(e.target.value)})}
                                        />
                                      </div>
                                      <Button onClick={() => updateBookingMutation.mutate(editingBooking)}>
                                        Save Changes
                                      </Button>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
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
                                      This action cannot be undone. This will permanently delete the booking.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => deleteBookingMutation.mutate(booking.id)}>
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
