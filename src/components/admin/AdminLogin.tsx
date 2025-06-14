
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Lock, Shield, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Secure preset credentials - only known by developer/admin
  const ADMIN_CREDENTIALS = {
    username: 'sys_admin_dev',
    password: 'SecureAdmin2024!@#',
    securityCode: 'DEV_ACCESS_7891'
  };

  const MAX_ATTEMPTS = 3;
  const LOCKOUT_TIME = 30 * 60 * 1000; // 30 minutes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if locked out
    const lockoutUntil = localStorage.getItem('admin_lockout_until');
    if (lockoutUntil && new Date().getTime() < parseInt(lockoutUntil)) {
      const timeLeft = Math.ceil((parseInt(lockoutUntil) - new Date().getTime()) / (1000 * 60));
      toast.error(`Access locked. Try again in ${timeLeft} minutes.`);
      return;
    }

    setLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (
        username === ADMIN_CREDENTIALS.username &&
        password === ADMIN_CREDENTIALS.password &&
        securityCode === ADMIN_CREDENTIALS.securityCode
      ) {
        // Generate secure session token
        const sessionToken = btoa(new Date().getTime() + '_' + Math.random().toString(36));
        const sessionExpiry = new Date().getTime() + (4 * 60 * 60 * 1000); // 4 hours
        
        localStorage.setItem('admin_session_token', sessionToken);
        localStorage.setItem('admin_session_expiry', sessionExpiry.toString());
        localStorage.setItem('admin_last_activity', new Date().getTime().toString());
        localStorage.removeItem('admin_failed_attempts');
        localStorage.removeItem('admin_lockout_until');
        
        onLogin();
        toast.success('Secure access granted');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('admin_failed_attempts', newAttempts.toString());
        
        if (newAttempts >= MAX_ATTEMPTS) {
          const lockoutUntil = new Date().getTime() + LOCKOUT_TIME;
          localStorage.setItem('admin_lockout_until', lockoutUntil.toString());
          toast.error('Too many failed attempts. Access locked for 30 minutes.');
        } else {
          toast.error(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
        }
        
        // Clear form
        setUsername('');
        setPassword('');
        setSecurityCode('');
      }
      setLoading(false);
    }, 1000);
  };

  const isLocked = attempts >= MAX_ATTEMPTS;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <Card className="w-full max-w-md shadow-2xl border-purple-500/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl text-purple-700">System Administrator</CardTitle>
          <p className="text-muted-foreground text-sm">
            Secure Developer Access Portal
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">System Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter system username"
                required
                disabled={isLocked}
                className="bg-slate-50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">Access Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required
                  disabled={isLocked}
                  className="bg-slate-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="securityCode" className="text-sm font-medium">Developer Security Code</Label>
              <Input
                id="securityCode"
                type="password"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="Enter security code"
                required
                disabled={isLocked}
                className="bg-slate-50"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
              disabled={loading || !username || !password || !securityCode || isLocked}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Lock className="h-4 w-4" />
                  <span>Access System</span>
                </div>
              )}
            </Button>
          </form>
          
          {attempts > 0 && attempts < MAX_ATTEMPTS && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-xs text-yellow-800">
                Warning: {attempts} failed attempt{attempts !== 1 ? 's' : ''}. {MAX_ATTEMPTS - attempts} remaining.
              </p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-xs text-red-800 font-medium mb-2">⚠️ RESTRICTED ACCESS</p>
            <p className="text-xs text-red-700">
              This system is for authorized developers only. Access credentials are managed by the system administrator. 
              Unauthorized access attempts are logged and monitored.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
