
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import PaymentBreakdown from './PaymentBreakdown';

interface PaymentBreakdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  showSellerView?: boolean;
}

const PaymentBreakdownModal: React.FC<PaymentBreakdownModalProps> = ({
  isOpen,
  onClose,
  totalAmount,
  showSellerView = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Breakdown</DialogTitle>
        </DialogHeader>
        <PaymentBreakdown
          totalAmount={totalAmount}
          showSellerView={showSellerView}
        />
      </DialogContent>
    </Dialog>
  );
};

export default PaymentBreakdownModal;
