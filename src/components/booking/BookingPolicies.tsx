
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface BookingPoliciesProps {
  type: 'venue' | 'service';
}

const BookingPolicies: React.FC<BookingPoliciesProps> = ({ type }) => {
  const policies = {
    venue: {
      cancellation: 'Full refund if cancelled 7 days before event',
      refund: 'Full refund available up to 7 days before event. 50% refund 3-7 days before. No refund within 72 hours.',
      payment: ['M-Pesa', 'Bank Transfer', 'Credit Card'],
      deposit: 30
    },
    service: {
      cancellation: 'Full refund if cancelled 48 hours before service',
      refund: 'Full refund available up to 48 hours before service. 50% refund 24-48 hours before. No refund within 24 hours.',
      payment: ['M-Pesa', 'Bank Transfer'],
      deposit: 25
    }
  };

  const currentPolicies = policies[type];

  return (
    <div className="space-y-6">
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Booking-then-Payment:</strong> Manual approval is needed to prevent overlapping rentals. 
          Prices might change depending on conditions (late returns, discounts, etc.)
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Booking Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Cancellation Policy</h4>
            <p className="text-sm text-muted-foreground">{currentPolicies.cancellation}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Refund Policy</h4>
            <p className="text-sm text-muted-foreground">{currentPolicies.refund}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Payment Methods</h4>
            <p className="text-sm text-muted-foreground">{currentPolicies.payment.join(', ')}</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Deposit Required</h4>
            <p className="text-sm text-muted-foreground">{currentPolicies.deposit}% of total booking cost</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Approval Process</h4>
            <p className="text-sm text-muted-foreground">
              All bookings require vendor approval. You will receive a confirmation within 24 hours.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingPolicies;
