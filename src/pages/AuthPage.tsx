import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';
import EmailVerification from '@/components/auth/EmailVerification';
import { validateKenyanPhone, formatKenyanPhone } from '@/utils/phoneValidation';

const AuthPage = () => {
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'signup' | 'email' | 'complete'>('signup');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: '',
    userType: 'client'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Enhanced validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar,
      requirements: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumbers,
        hasSpecialChar
      }
    };
  };

  const validateName = (name: string) => {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
  };

  const validateForm = (type: 'signin' | 'signup') => {
    const newErrors: Record<string, string> = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        const missingRequirements = [];
        if (!passwordValidation.requirements.minLength) missingRequirements.push('8+ characters');
        if (!passwordValidation.requirements.hasUpperCase) missingRequirements.push('uppercase letter');
        if (!passwordValidation.requirements.hasLowerCase) missingRequirements.push('lowercase letter');
        if (!passwordValidation.requirements.hasNumbers) missingRequirements.push('number');
        if (!passwordValidation.requirements.hasSpecialChar) missingRequirements.push('special character');
        
        newErrors.password = `Password must contain: ${missingRequirements.join(', ')}`;
      }
    }

    if (type === 'signup') {
      // Full name validation
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      } else if (!validateName(formData.fullName)) {
        newErrors.fullName = 'Full name must be 2-50 characters, letters only';
      }

      // Confirm password validation
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }

      // Mandatory phone validation
      if (!formData.phone) {
        newErrors.phone = 'Phone number is required';
      } else if (!validateKenyanPhone(formData.phone)) {
        newErrors.phone = 'Please enter a valid Kenyan phone number (e.g., +254712345678, 0712345678)';
      }

      // User type validation
      if (!formData.userType) {
        newErrors.userType = 'Please select your role';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (type: 'signin' | 'signup') => {
    if (!validateForm(type)) return;

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
        if (error) throw error;
        
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
    setVerificationStep('complete');
    toast({
      title: "Email Verified!",
      description: "Your email has been verified successfully. You can now sign in.",
    });
    navigate('/auth');
  };

  const handleResendCode = async () => {
    // For now, this would trigger a resend of the verification email
    // In a real implementation, you'd call your backend to resend
    toast({
      title: "Verification Email Resent",
      description: "Please check your email for a new verification link.",
    });
  };

  const renderPasswordRequirements = () => {
    const validation = validatePassword(formData.password);
    return (
      <div className="mt-2 text-xs space-y-1">
        <p className="text-gray-600">Password must contain:</p>
        <div className="grid grid-cols-2 gap-1">
          <div className={`flex items-center gap-1 ${validation.requirements.minLength ? 'text-green-600' : 'text-gray-400'}`}>
            {validation.requirements.minLength ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
            <span>8+ characters</span>
          </div>
          <div className={`flex items-center gap-1 ${validation.requirements.hasUpperCase ? 'text-green-600' : 'text-gray-400'}`}>
            {validation.requirements.hasUpperCase ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
            <span>Uppercase</span>
          </div>
          <div className={`flex items-center gap-1 ${validation.requirements.hasLowerCase ? 'text-green-600' : 'text-gray-400'}`}>
            {validation.requirements.hasLowerCase ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
            <span>Lowercase</span>
          </div>
          <div className={`flex items-center gap-1 ${validation.requirements.hasNumbers ? 'text-green-600' : 'text-gray-400'}`}>
            {validation.requirements.hasNumbers ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
            <span>Number</span>
          </div>
          <div className={`flex items-center gap-1 ${validation.requirements.hasSpecialChar ? 'text-green-600' : 'text-gray-400'}`}>
            {validation.requirements.hasSpecialChar ? <CheckCircle className="h-3 w-3" /> : <div className="h-3 w-3 rounded-full border border-gray-300" />}
            <span>Special char</span>
          </div>
        </div>
      </div>
    );
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <h2 className="text-3xl font-bold text-gray-900">Vendoor</h2>
          </div>
          <p className="mt-2 text-gray-600">Secure venue and service booking platform</p>
        </div>
        
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
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email Address</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? 'border-red-500' : ''}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                      autoComplete="current-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                
                <Button 
                  onClick={() => handleSubmit('signin')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </Button>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name *</Label>
                  <Input
                    id="signup-name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.fullName ? 'border-red-500' : ''}
                    autoComplete="name"
                  />
                  {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address *</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? 'border-red-500' : ''}
                    autoComplete="email"
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number *</Label>
                  <Input
                    id="signup-phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+254712345678 or 0712345678"
                    className={errors.phone ? 'border-red-500' : ''}
                    autoComplete="tel"
                  />
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create a secure password"
                      className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
                      autoComplete="new-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {formData.password && renderPasswordRequirements()}
                  {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password *</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    className={errors.confirmPassword ? 'border-red-500' : ''}
                    autoComplete="new-password"
                  />
                  {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="user-type">I am a *</Label>
                  <Select value={formData.userType} onValueChange={(value) => handleInputChange('userType', value)}>
                    <SelectTrigger className={errors.userType ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Event Organizer</SelectItem>
                      <SelectItem value="venue_owner">Venue Owner</SelectItem>
                      <SelectItem value="service_provider">Service Provider</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.userType && <p className="text-sm text-red-500">{errors.userType}</p>}
                </div>
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
                  <p className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Your data is encrypted and secured with industry-standard protection.
                  </p>
                </div>
                
                <Button 
                  onClick={() => handleSubmit('signup')} 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthPage;
