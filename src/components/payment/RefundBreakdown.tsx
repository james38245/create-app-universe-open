
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, RefreshCw } from 'lucide-react';

interface RefundBreakdownProps {
  originalAmount: number;
  transactionFeePercentage?: number;
}

const RefundBreakdown: React.FC<RefundBreakdownProps> = ({
  originalAmount,
  transactionFeePercentage = 3
}) => {
  const transactionFee = originalAmount * (transactionFeePercentage / 100);
  const refundAmount = originalAmount - transactionFee;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Refund Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Original Payment</span>
            <span className="font-semibold">KSh {originalAmount.toLocaleString()}</span>
          </div>
          
          <Separator />
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">
                Transaction Fee ({transactionFeePercentage}%) - Non-refundable
              </span>
              <span className="text-red-600">- KSh {transactionFee.toLocaleString()}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between items-center">
            <span className="font-medium text-green-700">Refund Amount</span>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              KSh {refundAmount.toLocaleString()}
            </Badge>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> Refunds exclude transaction fees but no commission is deducted. 
              The refund will be processed to your M-Pesa account within 24-48 hours after approval.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RefundBreakdown;
