
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import EmailVerification from '@/components/auth/EmailVerification';
import AuthHeader from '@/components/auth/AuthHeader';
import SignInForm from '@/components/auth/SignInForm';
import SignUpForm from '@/components/auth/SignUpForm';
import { validateForm } from '@/utils/authValidation';
import { formatKenyanPhone } from '@/utils/phoneValidation';

const AuthPage = () => {
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'auth' | 'email' | 'complete'>('auth');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    userType: 'client'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect authenticated users only if email verified
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const handleSubmit = async (type: 'signin' | 'signup') => {
    const validationErrors = validateForm(formData, type);
    setErrors(validationErrors);
    
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      if (type === 'signup') {
        const formattedPhone = formatKenyanPhone(formData.phone);
        
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName.trim(),
          phone: formattedPhone,
          user_type: formData.userType
        });
        
        if (error) throw error;
        
        setVerificationStep('email');
        toast({
          title: "Registration Successful!",
          description: "Please check your email for a verification link to complete your registration.",
        });
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.code === 'email_not_confirmed') {
            setVerificationStep('email');
            toast({
              title: "Email Verification Required",
              description: error.message,
              variant: "destructive"
            });
            return;
          }
          throw error;
        }
        
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
        navigate('/profile');
      }
    } catch (error: any) {
      let errorMessage = "An error occurred. Please try again.";
      
      if (error.message?.includes('Email already registered')) {
        errorMessage = "An account with this email already exists.";
      } else if (error.message?.includes('Invalid login credentials')) {
        errorMessage = "Invalid email or password.";
      } else if (error.message?.includes('Email not confirmed')) {
        errorMessage = "Please verify your email before signing in.";
        setVerificationStep('email');
      }
      
      toast({
        title: "Authentication Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleVerificationComplete = () => {
    setVerificationStep('auth');
    toast({
      title: "Email Verified!",
      description: "Your email has been verified successfully. You can now sign in.",
    });
  };

  const handleResendCode = async () => {
    toast({
      title: "Verification Email Resent",
      description: "Please check your email for a new verification link.",
    });
  };

  // Show email verification component
  if (verificationStep === 'email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <EmailVerification
          email={formData.email}
          onVerificationComplete={handleVerificationComplete}
          onResendCode={handleResendCode}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <AuthHeader />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Access Your Account</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Create Account</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <SignInForm
                  formData={formData}
                  errors={errors}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onSubmit={() => handleSubmit('signin')}
                />
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <SignUpForm
                  formData={formData}
                  errors={errors}
                  loading={loading}
                  onInputChange={handleInputChange}
                  onSubmit={() => handleSubmit('signup')}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
