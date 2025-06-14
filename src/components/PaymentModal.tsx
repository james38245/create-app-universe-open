
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Smartphone, CreditCard, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingDetails: {
    venueName: string;
    date: string;
    duration: string;
  };
}

const PaymentModal: React.FC<PaymentModalProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  bookingDetails 
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'card'>('mpesa');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast({
        title: "Payment Successful!",
        description: "Your booking has been confirmed.",
      });
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2000);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-center text-muted-foreground">
              Your booking for {bookingDetails.venueName} has been confirmed.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-medium">{bookingDetails.venueName}</h4>
            <p className="text-sm text-muted-foreground">Date: {bookingDetails.date}</p>
            <p className="text-sm text-muted-foreground">Duration: {bookingDetails.duration}</p>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>KSh {amount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>Choose Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={paymentMethod === 'mpesa' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('mpesa')}
                className="h-16 flex-col gap-2"
              >
                <Smartphone className="h-6 w-6" />
                <span className="text-xs">M-Pesa</span>
              </Button>
              <Button
                variant={paymentMethod === 'card' ? 'default' : 'outline'}
                onClick={() => setPaymentMethod('card')}
                className="h-16 flex-col gap-2"
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-xs">Card</span>
              </Button>
            </div>
          </div>

          {/* Payment Form */}
          {paymentMethod === 'mpesa' ? (
            <div className="space-y-3">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="254XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                You will receive an STK push notification to complete the payment
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handlePayment} 
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? 'Processing...' : `Pay KSh ${amount.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
