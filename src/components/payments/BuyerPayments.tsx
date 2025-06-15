
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CreditCard, RefreshCw, Receipt } from 'lucide-react';

const BuyerPayments = () => {
  const { user } = useAuth();

  const { data: payments, isLoading } = useQuery({
    queryKey: ['buyer-payments', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          booking_type,
          total_amount,
          payment_status,
          payment_method,
          refund_amount,
          refund_reason,
          created_at,
          refund_processed_at,
          venues(name),
          service_providers(service_category),
          transactions(*)
        `)
        .eq('client_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const totalSpent = payments?.reduce((sum, payment) => sum + (payment.total_amount || 0), 0) || 0;
  const totalRefunded = payments?.reduce((sum, payment) => sum + (payment.refund_amount || 0), 0) || 0;
  const pendingPayments = payments?.filter(p => p.payment_status === 'pending').length || 0;

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-blue-600">
                  KSh {totalSpent.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <RefreshCw className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Refunded</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {totalRefunded.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Receipt className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingPayments}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service/Venue</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Refund</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {payment.venues?.name || payment.service_providers?.service_category || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.booking_type}</Badge>
                  </TableCell>
                  <TableCell>KSh {payment.total_amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      payment.payment_status === 'paid' ? "default" : 
                      payment.payment_status === 'refunded' ? "destructive" : 
                      "secondary"
                    }>
                      {payment.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{payment.payment_method || 'M-Pesa'}</TableCell>
                  <TableCell>
                    {new Date(payment.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {payment.refund_amount ? (
                      <div className="text-sm">
                        <p className="text-green-600">KSh {payment.refund_amount.toLocaleString()}</p>
                        {payment.refund_reason && (
                          <p className="text-gray-500 text-xs">{payment.refund_reason}</p>
                        )}
                      </div>
                    ) : (
                      '-'
                    )}
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

export default BuyerPayments;
