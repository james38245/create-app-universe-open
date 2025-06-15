
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, DollarSign, Users, CreditCard } from 'lucide-react';

const AdminPayments = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: transactions, isLoading } = useQuery({
    queryKey: ['admin-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          bookings(
            total_amount,
            commission_amount,
            seller_amount,
            transaction_fee,
            payment_status,
            venues(name, owner_id),
            service_providers(service_category, user_id),
            profiles!bookings_client_id_fkey(full_name, email)
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  const { data: summary } = useQuery({
    queryKey: ['admin-payment-summary'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('total_amount, commission_amount, transaction_fee, payment_status');
      
      if (error) throw error;
      
      const totalRevenue = data.reduce((sum, booking) => sum + (booking.total_amount || 0), 0);
      const totalCommissions = data.reduce((sum, booking) => sum + (booking.commission_amount || booking.total_amount * 0.1), 0);
      const totalTransactionFees = data.reduce((sum, booking) => sum + (booking.transaction_fee || booking.total_amount * 0.03), 0);
      const paidBookings = data.filter(b => b.payment_status === 'paid').length;
      
      return {
        totalRevenue,
        totalCommissions,
        totalTransactionFees,
        totalTransactions: data.length,
        paidBookings
      };
    }
  });

  const filteredTransactions = transactions?.filter(transaction => {
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesSearch = !searchTerm || 
      transaction.bookings?.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.bookings?.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.mpesa_transaction_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-600">
                  KSh {summary?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Our Commission</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {(summary?.totalCommissions + summary?.totalTransactionFees)?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paid Bookings</p>
                <p className="text-2xl font-bold text-purple-600">
                  {summary?.paidBookings || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-orange-600">
                  {summary?.totalTransactions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search by customer name, email, or M-Pesa ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processed">Processed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>M-Pesa ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{transaction.bookings?.profiles?.full_name || 'N/A'}</p>
                      <p className="text-gray-500">{transaction.bookings?.profiles?.email || 'N/A'}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.transaction_type}</Badge>
                  </TableCell>
                  <TableCell>KSh {transaction.amount?.toLocaleString()}</TableCell>
                  <TableCell className="text-green-600">
                    KSh {((transaction.bookings?.commission_amount || 0) + (transaction.bookings?.transaction_fee || 0)).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {transaction.mpesa_transaction_id || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                      transaction.status === 'processed' ? "default" : 
                      transaction.status === 'failed' ? "destructive" : 
                      "secondary"
                    }>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.created_at).toLocaleDateString()}
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

export default AdminPayments;
