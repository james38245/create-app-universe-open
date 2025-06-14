
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentAccountSettings from '@/components/payment/PaymentAccountSettings';

interface PaymentsSectionProps {
  userProfile: any;
  onPaymentAccountSave: () => void;
}

const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  userProfile,
  onPaymentAccountSave
}) => {
  return (
    <>
      <PaymentAccountSettings
        initialData={userProfile}
        onSave={onPaymentAccountSave}
      />

      <Card>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">How Payments Work</h4>
            <div className="space-y-2 text-sm text-blue-700">
              <p>• Customers pay the full amount upfront via M-Pesa</p>
              <p>• A 10% platform commission and 3% transaction fee are deducted</p>
              <p>• Remaining amount is held until the refund period expires</p>
              <p>• Funds are automatically transferred to your registered account</p>
              <p>• You'll receive payment notifications via SMS and email</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 className="font-medium text-amber-800 mb-2">Payout Schedule</h4>
            <p className="text-sm text-amber-700">
              Payouts are processed automatically 24-48 hours after the refund deadline 
              expires and payment is confirmed. Ensure your payment details are accurate 
              to avoid delays.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PaymentsSection;
