
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';
import ForgotPasswordForm from './ForgotPasswordForm';

interface SignInFormProps {
  formData: {
    email: string;
    password: string;
  };
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const SignInForm = ({ formData, errors, loading, onInputChange, onSubmit }: SignInFormProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);

  if (forgotPasswordMode) {
    return (
      <ForgotPasswordForm
        initialEmail={formData.email}
        onCancel={() => setForgotPasswordMode(false)}
      />
    );
  }

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="signin-email">Email Address</Label>
        <Input
          id="signin-email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
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
            onChange={(e) => onInputChange('password', e.target.value)}
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
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setForgotPasswordMode(true)}
          className="text-xs text-blue-600 hover:underline focus:outline-none"
        >
          Forgot Password?
        </button>
      </div>
      
      <Button 
        onClick={onSubmit} 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
    </>
  );
};

export default SignInForm;
