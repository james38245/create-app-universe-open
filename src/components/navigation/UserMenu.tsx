
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  Settings,
  FileText,
  CreditCard,
  HelpCircle,
  Phone,
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

const UserMenu = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const { toast } = useToast();
  const { profileData, loading: profileLoading } = useProfile();

  // Show spinner if auth or profile data is loading
  if (loading || profileLoading) {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-purple-500 h-7 w-7" />
      </div>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
      navigate('/auth');
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const accountMenuItems = [
    {
      icon: User,
      label: 'Profile',
      path: '/profile',
      description: 'Manage your profile'
    },
    {
      icon: Settings,
      label: 'Settings',
      path: '/settings',
      description: 'App preferences'
    },
    {
      icon: FileText,
      label: 'Documents',
      path: '/profile?tab=documents',
      description: 'Certificates & CV'
    },
    {
      icon: CreditCard,
      label: 'Payments',
      path: '/profile?tab=payments',
      description: 'Payment methods'
    },
    {
      icon: HelpCircle,
      label: 'FAQ',
      path: '/faq',
      description: 'Common questions'
    },
    {
      icon: Phone,
      label: 'Support',
      path: '/support',
      description: 'Get help'
    },
    {
      icon: Shield,
      label: 'Admin',
      path: '/admin',
      description: 'Admin functions'
    }
  ];

  // ---- Get profile info for UserMenu, fallback to user ----
  // Prioritize `profiles` table (profileData), else fallback to user_metadata
  const displayName = profileData?.full_name || user?.user_metadata?.full_name || user?.email || 'User';
  const displayAvatar = profileData?.avatar_url || user?.user_metadata?.avatar_url || "/placeholder.svg";
  const displayEmail = profileData?.email || user?.email;

  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-purple-100 hover:ring-purple-200 transition-all">
            <Avatar className="h-9 w-9">
              <AvatarImage src={displayAvatar} alt="Profile" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                {displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-72 p-2" align="end" forceMount>
          <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-2">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {displayName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {displayEmail}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {accountMenuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={index} asChild className="cursor-pointer p-3 focus:bg-purple-50">
                <Link to={item.path} className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                </Link>
              </DropdownMenuItem>
            );
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer p-3 focus:bg-red-50 text-red-600"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <LogOut className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Sign Out</div>
                <div className="text-xs text-red-400">Logout from account</div>
              </div>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // Not authenticated state
  return (
    <div className="flex items-center space-x-2">
      <Link to="/auth">
        <Button variant="outline" size="sm">
          Sign In
        </Button>
      </Link>
      <Link to="/auth">
        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          Get Started
        </Button>
      </Link>
    </div>
  );
};

export default UserMenu;

