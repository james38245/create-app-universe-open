
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    </div>
  );
};

export default SystemStatsOverview;
