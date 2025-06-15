
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import RefundBreakdown from '../payment/RefundBreakdown';

interface RefundDialogProps {
  booking: any;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
}

const RefundDialog: React.FC<RefundDialogProps> = ({
  booking,
  isOpen,
  onClose,
  isAdmin = false
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [refundReason, setRefundReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processRefundMutation = useMutation({
    mutationFn: async ({ reason }: { reason: string }) => {
      if (!user) throw new Error('User not authenticated');

      // Call the refund function
      const { data, error } = await supabase.rpc('process_refund', {
        booking_uuid: booking.id,
        refund_reason: reason,
        cancelled_by_user_id: user.id
      });

      if (error) throw error;
      if (!data) throw new Error('Refund processing failed');

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Refund Processed",
        description: "The refund has been processed successfully. Funds will be transferred within 24-48 hours."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      onClose();
      setRefundReason('');
    },
    onError: (error: any) => {
      toast({
        title: "Refund Failed",
        description: error.message || "Failed to process refund",
        variant: "destructive"
      });
    }
  });

  const handleRefund = () => {
    if (!refundReason.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the refund",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    processRefundMutation.mutate({ reason: refundReason });
  };

  const canProcessRefund = booking?.payment_status === 'paid' && 
                          booking?.status !== 'cancelled' && 
                          booking?.status !== 'refunded';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Process Refund</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <RefundBreakdown originalAmount={booking?.total_amount || 0} />
          
          <div className="space-y-2">
            <Label htmlFor="refund-reason">Refund Reason</Label>
            <Textarea
              id="refund-reason"
              placeholder="Enter reason for refund..."
              value={refundReason}
              onChange={(e) => setRefundReason(e.target.value)}
              rows={3}
            />
          </div>

          {!canProcessRefund && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                This booking cannot be refunded. It may already be cancelled or payment is not confirmed.
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleRefund}
              disabled={!canProcessRefund || isProcessing || processRefundMutation.isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isProcessing || processRefundMutation.isPending ? 'Processing...' : 'Process Refund'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
