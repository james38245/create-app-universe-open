
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface ForgotPasswordFormProps {
  initialEmail: string;
  onCancel: () => void;
}

const ForgotPasswordForm = ({ initialEmail, onCancel }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    
    try {
      if (!email) {
        setError('Please enter your email.');
        return;
      }
      if (!validateEmail(email)) {
        setError('Please enter a valid email address.');
        return;
      }

      const redirectUrl = `${window.location.origin}/auth?type=password_reset`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirectUrl });
      
      if (error) throw error;
      
      toast({
        title: "Password Reset Email Sent",
        description: `A password reset link has been sent to ${email}. Please check your inbox (and spam folder).`,
      });
      
      onCancel();
    } catch (error: any) {
      setError(error.message || "Failed to send password reset email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="forgot-password-email">Enter your email to reset password</Label>
        <Input
          id="forgot-password-email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Enter email"
          autoFocus
          autoComplete="email"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-2">
        <Button
          variant="default"
          className="w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
