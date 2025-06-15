
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Shield } from 'lucide-react';
import { useVerification } from '@/hooks/useVerification';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyListing, isVerifying } = useVerification();
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>('pending');
  const [errorMessage, setErrorMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('No verification token provided');
      return;
    }

    const handleVerification = async () => {
      const result = await verifyListing(token);
      if (result.success) {
        setVerificationStatus('success');
      } else {
        setVerificationStatus('error');
        setErrorMessage(result.error || 'Verification failed');
      }
    };

    handleVerification();
  }, [token, verifyListing]);

  const handleGoToListings = () => {
    navigate('/listings');
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {verificationStatus === 'pending' && (
              <Loader2 className="h-16 w-16 text-blue-600 animate-spin" />
            )}
            {verificationStatus === 'success' && (
              <CheckCircle className="h-16 w-16 text-green-600" />
            )}
            {verificationStatus === 'error' && (
              <XCircle className="h-16 w-16 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {verificationStatus === 'pending' && 'Verifying Your Listing...'}
            {verificationStatus === 'success' && 'Email Verified Successfully!'}
            {verificationStatus === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          {verificationStatus === 'pending' && (
            <p className="text-muted-foreground">
              Please wait while we verify your email address...
            </p>
          )}
          
          {verificationStatus === 'success' && (
            <>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <Shield className="h-5 w-5" />
                  <span className="font-medium">Email Verified</span>
                </div>
                <p className="text-sm text-green-700">
                  Your email has been successfully verified. Your listing is now under admin review 
                  and will be published once approved. You'll receive a notification email when it's live.
                </p>
              </div>
              <div className="space-y-2">
                <Button onClick={handleGoToListings} className="w-full">
                  View My Listings
                </Button>
                <Button variant="outline" onClick={handleGoHome} className="w-full">
                  Go to Home
                </Button>
              </div>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <p className="text-red-600 mb-4">
                {errorMessage}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                This could happen if the verification link has expired or was already used. 
                Please try submitting your listing again.
              </p>
              <div className="space-y-2">
                <Button onClick={handleGoToListings} className="w-full">
                  Go to My Listings
                </Button>
                <Button variant="outline" onClick={handleGoHome} className="w-full">
                  Go to Home
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationPage;
