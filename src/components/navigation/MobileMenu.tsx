
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Users, 
  Calendar, 
  MessageSquare, 
  Plus,
  X,
  ArrowLeft,
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  showBackButton: boolean;
  onBackNavigation: () => void;
}

const MobileMenu = ({ isOpen, onClose, showBackButton, onBackNavigation }: MobileMenuProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const navItems = [
    { 
      path: '/venues', 
      label: 'Venues', 
      icon: Building,
      description: 'Browse event venues'
    },
    { 
      path: '/providers', 
      label: 'Service Providers', 
      icon: Users,
      description: 'Find event services'
    },
    { 
      path: '/bookings', 
      label: 'My Bookings', 
      icon: Calendar,
      description: 'Manage your bookings'
    },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: MessageSquare,
      description: 'Chat with providers',
      badge: 3
    },
    { 
      path: '/listings', 
      label: 'My Listings', 
      icon: Plus,
      description: 'Manage your listings'
    }
  ];

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

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  const isActive = (path: string) => location.pathname === path;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onBackNavigation();
                  onClose();
                }}
                className="p-2"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2" onClick={onClose}>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">V</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Vendoor
              </span>
            </Link>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  {item.badge && (
                    <Badge variant="destructive" className="h-6 w-6 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Account Section */}
          {user && (
            <>
              <div className="mt-8 pt-6 border-t">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Account</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                
                <div className="space-y-2">
                  {accountMenuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={onClose}
                        className="flex items-center space-x-3 p-4 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        <Icon className="h-5 w-5" />
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <Button
                  onClick={() => {
                    handleSignOut();
                    onClose();
                  }}
                  variant="outline"
                  className="w-full text-red-600 border-red-200 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
