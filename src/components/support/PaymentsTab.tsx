
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet, CreditCard, TrendingUp, Info } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

const PaymentsTab = () => {
  const { user } = useAuth();

  // Mock wallet balance - in real implementation, this would fetch from Pesapal API
  const { data: walletBalance, isLoading } = useQuery({
    queryKey: ['wallet-balance', user?.id],
    queryFn: async () => {
      // This would normally call Pesapal API to get real balance
      // For now, we'll simulate the data structure
      return {
        available_balance: 45750.00,
        pending_balance: 12300.00,
        total_transactions: 156,
        last_updated: new Date().toISOString()
      };
    },
    enabled: !!user
  });

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
      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Wallet className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Available Balance</p>
                <p className="text-2xl font-bold text-green-600">
                  KSh {walletBalance?.available_balance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Balance</p>
                <p className="text-2xl font-bold text-orange-600">
                  KSh {walletBalance?.pending_balance?.toLocaleString() || '0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {walletBalance?.total_transactions || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Pesapal Wallet Integration</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Your earnings are automatically processed through Pesapal</p>
              <p>• Available balance can be withdrawn to your registered bank account</p>
              <p>• Pending balance includes funds under refund protection period</p>
              <p>• All transactions are secured with industry-standard encryption</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-medium text-green-800 mb-2">Withdrawal Information</h4>
            <div className="space-y-2 text-sm text-green-700">
              <p>• Minimum withdrawal amount: KSh 500</p>
              <p>• Withdrawals are processed within 1-2 business days</p>
              <p>• No withdrawal fees for amounts above KSh 1,000</p>
              <p>• Withdrawal fees: 2% for amounts below KSh 1,000</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Account Status</h4>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                Verified
              </Badge>
              <span className="text-sm text-amber-700">
                Last updated: {new Date(walletBalance?.last_updated || new Date()).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsTab;
