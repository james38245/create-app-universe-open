
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import BuyerPayments from '@/components/payments/BuyerPayments';
import SellerPayments from '@/components/payments/SellerPayments';
import AdminPayments from '@/components/payments/AdminPayments';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet } from 'lucide-react';

const PaymentsPage = () => {
  const { user } = useAuth();
  const { profileData } = useProfile();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <p>Please sign in to view your payments.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const userType = profileData?.user_type || 'client';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-8 w-8 text-purple-600" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Payments & Transactions
              </h1>
            </div>
            <p className="text-gray-600 text-lg">
              Track your payments, refunds, and transaction history
            </p>
          </div>

          {userType === 'admin' ? (
            <AdminPayments />
          ) : userType === 'service_provider' || userType === 'venue_owner' ? (
            <SellerPayments />
          ) : (
            <BuyerPayments />
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;
