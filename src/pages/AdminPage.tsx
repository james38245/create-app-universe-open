
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Users, 
  Building, 
  Calendar, 
  DollarSign, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const AdminPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch pending bookings
  const { data: pendingBookings, isLoading: loadingBookings } = useQuery({
    queryKey: ['admin-bookings', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('bookings')
        .select(`
          *,
          client:profiles!bookings_client_id_fkey(full_name, email),
          venue:venues(name, location),
          service_provider:service_providers(service_category)
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    }
  });

  // Fetch users
  const { data: users, isLoading: loadingUsers } = useQuery({
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
  const { data: venues, isLoading: loadingVenues } = useQuery({
    queryKey: ['admin-venues'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select(`
          *,
          owner:profiles!venues_owner_id_fkey(full_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch analytics
  const { data: analytics } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [bookingsResult, usersResult, venuesResult, revenueResult] = await Promise.all([
        supabase.from('bookings').select('status'),
        supabase.from('profiles').select('created_at'),
        supabase.from('venues').select('is_active'),
        supabase.from('bookings').select('total_amount, status').eq('status', 'completed')
      ]);

      const totalBookings = bookingsResult.data?.length || 0;
      const pendingBookings = bookingsResult.data?.filter(b => b.status === 'pending').length || 0;
      const confirmedBookings = bookingsResult.data?.filter(b => b.status === 'confirmed').length || 0;
      const totalUsers = usersResult.data?.length || 0;
      const totalVenues = venuesResult.data?.length || 0;
      const activeVenues = venuesResult.data?.filter(v => v.is_active).length || 0;
      const totalRevenue = revenueResult.data?.reduce((sum, booking) => sum + (booking.total_amount || 0), 0) || 0;

      return {
        totalBookings,
        pendingBookings,
        confirmedBookings,
        totalUsers,
        totalVenues,
        activeVenues,
        totalRevenue
      };
    }
  });

  // Mutation to approve/reject bookings
  const updateBookingMutation = useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['admin-analytics'] });
      toast({
        title: "Booking updated",
        description: "Booking status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update booking status.",
        variant: "destructive",
      });
    }
  });

  // Mutation to toggle venue status
  const toggleVenueMutation = useMutation({
    mutationFn: async ({ venueId, isActive }: { venueId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('venues')
        .update({ is_active: isActive })
        .eq('id', venueId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-venues'] });
      toast({
        title: "Venue updated",
        description: "Venue status has been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update venue status.",
        variant: "destructive",
      });
    }
  });

  const handleApproveBooking = (bookingId: string) => {
    updateBookingMutation.mutate({ bookingId, status: 'confirmed' });
  };

  const handleRejectBooking = (bookingId: string) => {
    updateBookingMutation.mutate({ bookingId, status: 'cancelled' });
  };

  const handleToggleVenue = (venueId: string, currentStatus: boolean) => {
    toggleVenueMutation.mutate({ venueId, isActive: !currentStatus });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
              <p className="text-muted-foreground">Please sign in to access the admin panel.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage bookings, users, venues, and monitor system analytics
            </p>
          </div>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {analytics?.pendingBookings || 0} pending approval
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Venues</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analytics?.activeVenues || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Out of {analytics?.totalVenues || 0} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KSh {(analytics?.totalRevenue || 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  From completed bookings
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="venues">Venues</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle>Booking Management</CardTitle>
                    <div className="flex gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search bookings..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loadingBookings ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {pendingBookings?.map((booking) => (
                        <div key={booking.id} className="p-4 border rounded-lg">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  {booking.venue?.name || booking.service_provider?.service_category}
                                </h3>
                                <Badge variant={
                                  booking.status === 'pending' ? 'default' :
                                  booking.status === 'confirmed' ? 'default' :
                                  booking.status === 'completed' ? 'default' :
                                  'destructive'
                                }>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>Client: {booking.client?.full_name || 'Unknown'} ({booking.client?.email})</p>
                                <p>Date: {new Date(booking.event_date).toLocaleDateString()}</p>
                                <p>Amount: KSh {booking.total_amount.toLocaleString()}</p>
                                <p>Type: {booking.booking_type}</p>
                                {booking.venue && <p>Location: {booking.venue.location}</p>}
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    size="sm" 
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleApproveBooking(booking.id)}
                                    disabled={updateBookingMutation.isPending}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => handleRejectBooking(booking.id)}
                                    disabled={updateBookingMutation.isPending}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingUsers ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {users?.map((user) => (
                        <div key={user.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold">{user.full_name || 'Unknown'}</h3>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <p className="text-xs text-muted-foreground">
                                Joined: {new Date(user.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Badge variant="outline">{user.user_type || 'client'}</Badge>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Venues Tab */}
            <TabsContent value="venues" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Venue Management</CardTitle>
                </CardHeader>
                <CardContent>
                  {loadingVenues ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 border rounded-lg animate-pulse">
                          <div className="h-4 bg-gray-200 rounded mb-2"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {venues?.map((venue) => (
                        <div key={venue.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">{venue.name}</h3>
                                <Badge variant={venue.is_active ? 'default' : 'secondary'}>
                                  {venue.is_active ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <div className="space-y-1 text-sm text-muted-foreground">
                                <p>Owner: {venue.owner?.full_name || 'Unknown'}</p>
                                <p>Location: {venue.location}</p>
                                <p>Capacity: {venue.capacity} guests</p>
                                <p>Price: KSh {venue.price_per_day.toLocaleString()}/day</p>
                                <p>Type: {venue.venue_type}</p>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button 
                                variant={venue.is_active ? "destructive" : "default"}
                                size="sm"
                                onClick={() => handleToggleVenue(venue.id, venue.is_active)}
                                disabled={toggleVenueMutation.isPending}
                              >
                                {venue.is_active ? 'Deactivate' : 'Activate'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Bookings:</span>
                        <span className="font-semibold">{analytics?.totalBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pending Approval:</span>
                        <span className="font-semibold text-yellow-600">{analytics?.pendingBookings || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confirmed:</span>
                        <span className="font-semibold text-green-600">{analytics?.confirmedBookings || 0}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Total Revenue:</span>
                        <span className="font-semibold">KSh {(analytics?.totalRevenue || 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Commission (10%):</span>
                        <span className="font-semibold">KSh {((analytics?.totalRevenue || 0) * 0.1).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transaction Fees (3%):</span>
                        <span className="font-semibold">KSh {((analytics?.totalRevenue || 0) * 0.03).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
