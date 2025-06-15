
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const useVerification = () => {
  const [isInitiating, setIsInitiating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const initiateVerification = async (
    entityType: 'venue' | 'service_provider',
    entityId: string,
    userId: string,
    entityName: string,
    userEmail: string,
    userName: string
  ) => {
    setIsInitiating(true);
    
    try {
      // Call the database function to initiate verification
      const { data: tokenData, error: dbError } = await supabase
        .rpc('initiate_verification', {
          p_entity_type: entityType,
          p_entity_id: entityId,
          p_user_id: userId
        });

      if (dbError) throw dbError;

      // Send verification email
      const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: {
          email: userEmail,
          name: userName,
          entityType,
          entityName,
          verificationToken: tokenData
        }
      });

      if (emailError) throw emailError;

      toast({
        title: "Verification Email Sent",
        description: `Please check your email to verify your ${entityType === 'venue' ? 'venue' : 'service provider'} listing.`
      });

      return { success: true, token: tokenData };
    } catch (error: any) {
      console.error('Verification initiation error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Failed to initiate verification process",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsInitiating(false);
    }
  };

  const verifyListing = async (token: string) => {
    setIsVerifying(true);
    
    try {
      const { data, error } = await supabase
        .rpc('verify_listing', {
          p_token: token
        });

      if (error) throw error;

      if (data) {
        toast({
          title: "Email Verified Successfully",
          description: "Your listing has been verified and is now under admin review."
        });
        return { success: true };
      } else {
        throw new Error('Invalid or expired verification token');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.message || "Invalid or expired verification link",
        variant: "destructive"
      });
      return { success: false, error: error.message };
    } finally {
      setIsVerifying(false);
    }
  };

  return {
    initiateVerification,
    verifyListing,
    isInitiating,
    isVerifying
  };
};
