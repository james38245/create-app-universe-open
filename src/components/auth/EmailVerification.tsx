
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, RefreshCw, CheckCircle } from 'lucide-react';
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
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

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

  // Check if user has verified their email
  useEffect(() => {
    const checkVerificationStatus = () => {
      // In a real implementation, you would check the auth state
      // For now, we'll simulate checking every few seconds
      console.log('Checking verification status...');
    };

    const interval = setInterval(checkVerificationStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleResend = async () => {
    setResendTimer(60);
    setCanResend(false);
    
    try {
      await onResendCode();
      toast({
        title: "Verification Email Resent",
        description: "A new verification email has been sent to your email address.",
      });
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Failed to resend verification email. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleContinue = () => {
    onVerificationComplete();
  };

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle>Email Verified!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-gray-600">
            <p>Your email has been successfully verified.</p>
          </div>
          
          <Button onClick={handleContinue} className="w-full">
            Continue to Sign In
          </Button>
        </CardContent>
      </Card>
    );
  }

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
            We've sent a verification link to:
          </p>
          <p className="font-medium text-gray-900 mt-1">{email}</p>
          <p className="text-sm mt-2">
            Please check your inbox and click the verification link to activate your account.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Next steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the verification link in the email</li>
              <li>Return here to sign in</li>
            </ul>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">
            Didn't receive the email?
          </p>
          <Button 
            variant="link" 
            size="sm"
            onClick={handleResend}
            disabled={!canResend}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            {canResend ? 'Resend Email' : `Resend in ${resendTimer}s`}
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            onClick={handleContinue}
            className="w-full"
          >
            I'll verify later - Continue to Sign In
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailVerification;
