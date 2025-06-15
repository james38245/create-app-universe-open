
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Shield } from 'lucide-react';
import PasswordRequirements from './PasswordRequirements';

interface SignUpFormProps {
  formData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    userType: string;
  };
  errors: Record<string, string>;
  loading: boolean;
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
}

const SignUpForm = ({ formData, errors, loading, onInputChange, onSubmit }: SignUpFormProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name *</Label>
        <Input
          id="signup-name"
          value={formData.fullName}
          onChange={(e) => onInputChange('fullName', e.target.value)}
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
          onChange={(e) => onInputChange('email', e.target.value)}
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
          onChange={(e) => onInputChange('phone', e.target.value)}
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
            onChange={(e) => onInputChange('password', e.target.value)}
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
        {formData.password && <PasswordRequirements password={formData.password} />}
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password *</Label>
        <Input
          id="confirm-password"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => onInputChange('confirmPassword', e.target.value)}
          placeholder="Confirm your password"
          className={errors.confirmPassword ? 'border-red-500' : ''}
          autoComplete="new-password"
        />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="user-type">I am a *</Label>
        <Select value={formData.userType} onValueChange={(value) => onInputChange('userType', value)}>
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
        onClick={onSubmit} 
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
    </>
  );
};

export default SignUpForm;
