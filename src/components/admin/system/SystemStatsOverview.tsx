
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';

const SystemStatsOverview = () => {
  const { data: systemStats } = useQuery({
    queryKey: ['system-stats'],
    queryFn: async () => {
      const stats = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('venues').select('*', { count: 'exact', head: true }),
        supabase.from('service_providers').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('transactions').select('*', { count: 'exact', head: true })
      ]);

      return {
        users: stats[0].count || 0,
        venues: stats[1].count || 0,
        providers: stats[2].count || 0,
        bookings: stats[3].count || 0,
        transactions: stats[4].count || 0
      };
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{systemStats?.users}</div>
          <div className="text-sm text-muted-foreground">Total Users</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{systemStats?.venues}</div>
          <div className="text-sm text-muted-foreground">Venues</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{systemStats?.providers}</div>
          <div className="text-sm text-muted-foreground">Providers</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{systemStats?.bookings}</div>
          <div className="text-sm text-muted-foreground">Bookings</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{systemStats?.transactions}</div>
          <div className="text-sm text-muted-foreground">Transactions</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemStatsOverview;
