
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Users, Building, UserCheck, Calendar, DollarSign } from 'lucide-react';

const SystemStatsOverview = () => {
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const [usersRes, venuesRes, providersRes, bookingsRes, transactionsRes] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('service_providers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('amount', { count: 'exact' })
      ]);

      const totalRevenue = transactionsRes.data?.reduce((sum, t) => sum + (Number(t.amount) || 0), 0) || 0;

      return {
        users: usersRes.count || 0,
        venues: venuesRes.count || 0,
        providers: providersRes.count || 0,
        bookings: bookingsRes.count || 0,
        revenue: totalRevenue
      };
    }
  });

  const { data: venueDistribution } = useQuery({
    queryKey: ['venue-distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('venues')
        .select('venue_type')
        .eq('is_active', true);
      
      if (error) throw error;

      const distribution = data.reduce((acc: Record<string, number>, venue) => {
        acc[venue.venue_type] = (acc[venue.venue_type] || 0) + 1;
        return acc;
      }, {});

      const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00', '#ff0080'];
      
      return Object.entries(distribution).map(([type, count], index) => ({
        name: type,
        value: count,
        color: colors[index % colors.length]
      }));
    }
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">{systemStats?.users || 0}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Building className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">{systemStats?.venues || 0}</div>
            <div className="text-sm text-muted-foreground">Active Venues</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <UserCheck className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-purple-600">{systemStats?.providers || 0}</div>
            <div className="text-sm text-muted-foreground">Service Providers</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-orange-600">{systemStats?.bookings || 0}</div>
            <div className="text-sm text-muted-foreground">Total Bookings</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarSign className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-600">
              KSh {(systemStats?.revenue || 0).toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Venue Distribution Chart */}
      {venueDistribution && venueDistribution.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Venue Type Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={venueDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {venueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SystemStatsOverview;
