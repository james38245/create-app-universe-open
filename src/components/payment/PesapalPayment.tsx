
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PesapalPaymentProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingId: string;
  bookingDetails: {
    itemName: string;
    date: string;
    duration: string;
  };
}

const PesapalPayment: React.FC<PesapalPaymentProps> = ({ 
  isOpen, 
  onClose, 
  amount, 
  bookingId,
  bookingDetails 
}) => {
  const { user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid M-Pesa phone number",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    setPaymentError('');

    try {
      // Call Pesapal payment edge function
      const { data, error } = await supabase.functions.invoke('process-pesapal-payment', {
        body: {
          amount,
          phoneNumber,
          bookingId,
          customerEmail: user?.email,
          customerName: user?.user_metadata?.full_name || 'Customer',
          txRef: `booking_${bookingId}_${Date.now()}`
        }
      });

      if (error) throw error;

      if (data.success) {
        // If Pesapal returns a redirect URL, open it in new tab
        if (data.data.redirect_url) {
          window.open(data.data.redirect_url, '_blank');
        }
        
        setIsSuccess(true);
        toast({
          title: "Payment Initiated!",
          description: "Complete the payment in the new tab to confirm your booking.",
        });
        
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
        }, 3000);
      } else {
        throw new Error(data.message || 'Payment failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentError(error.message || 'Payment processing failed');
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
            <h3 className="text-xl font-semibold">Payment Initiated!</h3>
            <p className="text-center text-muted-foreground">
              Please complete the payment process to confirm your booking for {bookingDetails.itemName}.
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
          <DialogTitle>Complete Payment via M-Pesa</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Booking Summary */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <h4 className="font-medium">{bookingDetails.itemName}</h4>
            <p className="text-sm text-muted-foreground">Date: {bookingDetails.date}</p>
            <p className="text-sm text-muted-foreground">Duration: {bookingDetails.duration}</p>
            <Separator className="my-2" />
            <div className="flex justify-between font-semibold">
              <span>Total Amount:</span>
              <span>KSh {amount.toLocaleString()}</span>
            </div>
          </div>

          {/* M-Pesa Payment Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone className="h-6 w-6 text-green-600" />
              <span className="font-medium">M-Pesa Payment via Pesapal</span>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="phone">M-Pesa Phone Number</Label>
              <Input
                id="phone"
                placeholder="254XXXXXXXXX"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isProcessing}
              />
              <p className="text-xs text-muted-foreground">
                You will be redirected to complete the M-Pesa payment
              </p>
            </div>

            {paymentError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-sm text-red-700">{paymentError}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
            <Button 
              onClick={handleMpesaPayment} 
              disabled={isProcessing || !phoneNumber}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? 'Processing...' : `Pay KSh ${amount.toLocaleString()}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PesapalPayment;
