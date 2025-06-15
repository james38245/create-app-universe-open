
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, RefreshCw, AlertTriangle } from 'lucide-react';

interface RefundInfoProps {
  bookingAmount: number;
  transactionFeePercentage?: number;
}

const RefundInfo: React.FC<RefundInfoProps> = ({
  bookingAmount,
  transactionFeePercentage = 3
}) => {
  const transactionFee = bookingAmount * (transactionFeePercentage / 100);
  const refundAmount = bookingAmount - transactionFee;

  return (
    <Card className="w-full border-blue-200 bg-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-800">
          <InfoIcon className="h-5 w-5" />
          Refund Policy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
            <RefreshCw className="h-5 w-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">Cancellation Refund</h4>
              <p className="text-sm text-gray-600 mt-1">
                If you need to cancel your booking, you can receive a refund with the following breakdown:
              </p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg border p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Your Payment</span>
              <span className="font-semibold">KSh {bookingAmount.toLocaleString()}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Transaction Fee ({transactionFeePercentage}%) - Non-refundable
              </span>
              <span className="text-red-600">- KSh {transactionFee.toLocaleString()}</span>
            </div>
            
            <hr className="border-gray-200" />
            
            <div className="flex justify-between items-center">
              <span className="font-medium text-green-700">You'll Receive</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800 font-semibold">
                KSh {refundAmount.toLocaleString()}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-amber-800">Important Notes</h4>
              <ul className="text-sm text-amber-700 mt-1 space-y-1">
                <li>• Transaction fees are non-refundable</li>
                <li>• No commission is deducted from refunds</li>
                <li>• Refunds are processed within 24-48 hours</li>
                <li>• Money will be sent to your M-Pesa account</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RefundInfo;
