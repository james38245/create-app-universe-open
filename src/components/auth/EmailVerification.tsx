
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface EmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
  onResendCode: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerificationComplete,
  onResendCode
}) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerification = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      // Here you would implement actual email verification
      // For now, we'll simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Email Verified!",
        description: "Your email has been successfully verified.",
      });
      
      onVerificationComplete();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid verification code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendTimer(60);
    setCanResend(false);
    
    try {
      await onResendCode();
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Failed to resend verification code. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle>Verify Your Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center text-gray-600">
          <p className="text-sm">
            We've sent a 6-digit verification code to:
          </p>
          <p className="font-medium text-gray-900 mt-1">{email}</p>
          <p className="text-sm mt-2">
            Please check your inbox and enter the code below.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="verification-code">Verification Code</Label>
          <Input
            id="verification-code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="000000"
            maxLength={6}
            className="text-center text-lg tracking-widest font-mono"
            autoComplete="one-time-code"
          />
        </div>

        <Button 
          onClick={handleVerification}
          className="w-full"
          disabled={loading || verificationCode.length !== 6}
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the code?
          </p>
          <Button 
            variant="link" 
            size="sm"
            onClick={handleResend}
            disabled={!canResend}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
