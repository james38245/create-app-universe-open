
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const { signUp, signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    userType: 'client'
  });

  const handleSubmit = async (type: 'signin' | 'signup') => {
    setLoading(true);
    try {
      if (type === 'signup') {
        const { error } = await signUp(formData.email, formData.password, {
          full_name: formData.fullName,
          user_type: formData.userType
        });
        if (error) throw error;
        toast.success('Account created successfully! Please check your email to verify your account.');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success('Signed in successfully!');
        onOpenChange(false);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to EventSpace</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <Input
                id="signin-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <Input
                id="signin-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password"
              />
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
              <Label htmlFor="signup-name">Full Name</Label>
              <Input
                id="signup-name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <Input
                id="signup-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <Input
                id="signup-password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Create a password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="user-type">I am a</Label>
              <Select value={formData.userType} onValueChange={(value) => setFormData({ ...formData, userType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Event Organizer</SelectItem>
                  <SelectItem value="venue_owner">Venue Owner</SelectItem>
                  <SelectItem value="service_provider">Service Provider</SelectItem>
                </SelectContent>
              </Select>
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
      </DialogContent>
    </Dialog>
  );
};
