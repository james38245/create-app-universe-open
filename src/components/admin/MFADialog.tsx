
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Shield, Mail } from 'lucide-react';

interface MFADialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  action: string;
  description: string;
}

const MFADialog: React.FC<MFADialogProps> = ({
  isOpen,
  onClose,
  onSuccess,
  action,
  description
}) => {
  const [emailCode, setEmailCode] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);

  const sendEmailCode = () => {
    // Simulate sending email code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    console.log('Email verification code:', code); // In real implementation, this would be sent via email
    setEmailCodeSent(true);
    toast({
      title: "Verification Code Sent",
      description: `Code sent to wachira18james@gmail.com. For demo: ${code}`,
    });
  };

  const verifyMFA = () => {
    setIsVerifying(true);
    
    // Verify security code (master admin code)
    if (securityCode !== 'MASTER_DEV_ACCESS_2024') {
      toast({
        title: "Invalid Security Code",
        description: "Please enter the correct master security code.",
        variant: "destructive"
      });
      setIsVerifying(false);
      return;
    }

    // Verify email code (simple validation for demo)
    if (emailCode.length < 6) {
      toast({
        title: "Invalid Email Code",
        description: "Please enter the 6-digit email verification code.",
        variant: "destructive"
      });
      setIsVerifying(false);
      return;
    }

    setTimeout(() => {
      setIsVerifying(false);
      onSuccess();
      onClose();
      setEmailCode('');
      setSecurityCode('');
      setEmailCodeSent(false);
      toast({
        title: "Action Authorized",
        description: `${action} completed successfully.`,
      });
    }, 1000);
  };

  const handleClose = () => {
    setEmailCode('');
    setSecurityCode('');
    setEmailCodeSent(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Multi-Factor Authentication Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Action:</strong> {action}
            </p>
            <p className="text-sm text-amber-700 mt-1">{description}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Master Security Code</Label>
              <Input
                type="password"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="Enter master security code"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Email Verification Code</Label>
                {!emailCodeSent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={sendEmailCode}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Code
                  </Button>
                )}
              </div>
              <Input
                value={emailCode}
                onChange={(e) => setEmailCode(e.target.value)}
                placeholder="Enter 6-digit email code"
                disabled={!emailCodeSent}
              />
              {emailCodeSent && (
                <p className="text-xs text-muted-foreground mt-1">
                  Code sent to wachira18james@gmail.com
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              onClick={verifyMFA} 
              disabled={!emailCodeSent || isVerifying}
              className="bg-red-600 hover:bg-red-700"
            >
              {isVerifying ? 'Verifying...' : 'Authorize Action'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MFADialog;
