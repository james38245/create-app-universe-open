
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Wallet, TrendingUp, Minus } from 'lucide-react';

const SellerPayments = () => {
  const { user } = useAuth();

  const { data: earnings, isLoading } = useQuery({
    queryKey: ['seller-earnings', user?.id],
    queryFn: async () => {
      // Get bookings for venues owned by user
      const { data: venueBookings, error: venueError } = await supabase
        .from('bookings')
        .select(`
          id,
          total_amount,
          commission_amount,
          seller_amount,
          transaction_fee,
          payment_status,
          payout_status,
          created_at,
          payout_date,
          venues!inner(name, owner_id)
        `)
        .eq('venues.owner_id', user?.id)
        .eq('payment_status', 'paid');

      // Get bookings for service providers by user
      const { data: serviceBookings, error: serviceError } = await supabase
        .from('bookings')
        .select(`
          id,
          total_amount,
          commission_amount,
          seller_amount,
          transaction_fee,
          payment_status,
          payout_status,
          created_at,
          payout_date,
          service_providers!inner(service_category, user_id)
        `)
        .eq('service_providers.user_id', user?.id)
        .eq('payment_status', 'paid');

      if (venueError && serviceError) throw venueError || serviceError;
      
      // Mark each record with its type for proper handling
      const venueEarnings = (venueBookings || []).map(booking => ({
        ...booking,
        type: 'venue' as const
      }));
      
      const serviceEarnings = (serviceBookings || []).map(booking => ({
        ...booking,
        type: 'service' as const
      }));
      
      return [...venueEarnings, ...serviceEarnings];
    },
    enabled: !!user
  });

  const totalEarnings = earnings?.reduce((sum, earning) => sum + (earning.seller_amount || 0), 0) || 0;
  const totalFees = earnings?.reduce((sum, earning) => sum + (earning.commission_amount || 0) + (earning.transaction_fee || 0), 0) || 0;
  const pendingPayouts = earnings?.filter(e => e.payout_status === 'pending').length || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  const getServiceName = (earning: any) => {
    if (earning.type === 'venue') {
      return earning.venues?.name || 'Venue';
    } else {
      return earning.service_providers?.service_category || 'Service';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <Minus className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Fees</p>
                <p className="text-2xl font-bold text-red-600">
                  KSh {totalFees.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payouts</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingPayouts}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service/Venue</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Transaction Fee</TableHead>
                <TableHead>Your Earnings</TableHead>
                <TableHead>Payout Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earnings?.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell>
                    {getServiceName(earning)}
                  </TableCell>
                  <TableCell>KSh {earning.total_amount?.toLocaleString()}</TableCell>
                  <TableCell className="text-red-600">
                    -KSh {(earning.commission_amount || earning.total_amount * 0.1).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-red-600">
                    -KSh {(earning.transaction_fee || earning.total_amount * 0.03).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-green-600 font-semibold">
                    KSh {(earning.seller_amount || (earning.total_amount * 0.87)).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      earning.payout_status === 'processed' ? "default" : 
                      earning.payout_status === 'cancelled' ? "destructive" : 
                      "secondary"
                    }>
                      {earning.payout_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {earning.payout_date ? 
                      new Date(earning.payout_date).toLocaleDateString() : 
                      new Date(earning.created_at).toLocaleDateString()
                    }
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

export default SellerPayments;
