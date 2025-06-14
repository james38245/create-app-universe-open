
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InfoIcon } from 'lucide-react';

interface PaymentBreakdownProps {
  totalAmount: number;
  commissionPercentage?: number;
  transactionFeePercentage?: number;
  showSellerView?: boolean;
}

const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({
  totalAmount,
  commissionPercentage = 10,
  transactionFeePercentage = 3,
  showSellerView = false
}) => {
  const commissionAmount = totalAmount * (commissionPercentage / 100);
  const transactionFee = totalAmount * (transactionFeePercentage / 100);
  const sellerAmount = totalAmount - commissionAmount - transactionFee;
  const appRetains = commissionAmount + transactionFee;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <InfoIcon className="h-5 w-5" />
          Payment Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="font-semibold">KSh {totalAmount.toLocaleString()}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Platform Commission ({commissionPercentage}%)
              </span>
              <span className="text-red-600">- KSh {commissionAmount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Transaction Fee ({transactionFeePercentage}%)
              </span>
              <span className="text-red-600">- KSh {transactionFee.toLocaleString()}</span>
            </div>
          </div>
          
          <Separator />
          
          {showSellerView ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-700">You Receive</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  KSh {sellerAmount.toLocaleString()}
                </Badge>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-xs text-amber-800">
                  <strong>Payment Schedule:</strong> Funds will be transferred to your account automatically 
                  after the refund period expires and payment is confirmed.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <span className="font-medium">Platform Retains</span>
              <span className="font-semibold text-blue-600">KSh {appRetains.toLocaleString()}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentBreakdown;
