import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, 
  X, 
  Building, 
  Users, 
  Calendar, 
  MessageSquare, 
  Plus,
  User,
  Settings,
  FileText,
  CreditCard,
  HelpCircle,
  Phone,
  Shield,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { toast } = useToast();

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

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const showBackButton = location.pathname !== '/' && location.pathname !== '/auth';

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

  const isActive = (path: string) => location.pathname === path;

  if (loading) {
    return (
      <nav className="bg-white shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackNavigation}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Vendoor
                </span>
              </Link>
            </div>

            {/* Navigation Items */}
            <div className="flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                      isActive(item.path)
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 shadow-sm'
                        : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="h-5 w-5 text-xs p-0 flex items-center justify-center">
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full ring-2 ring-purple-100 hover:ring-purple-200 transition-all">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src="/placeholder.svg" alt="Profile" />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-72 p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg mb-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {user.user_metadata?.full_name || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
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
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Back Button and Logo */}
            <div className="flex items-center space-x-2">
              {showBackButton && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBackNavigation}
                  className="p-2"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-600" />
                </Button>
              )}
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Vendoor
                </span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
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
                        handleBackNavigation();
                        setIsMobileMenuOpen(false);
                      }}
                      className="p-2"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Button>
                  )}
                  <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
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
                  onClick={() => setIsMobileMenuOpen(false)}
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
                        onClick={() => setIsMobileMenuOpen(false)}
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
                              onClick={() => setIsMobileMenuOpen(false)}
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
                          setIsMobileMenuOpen(false);
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
        )}
      </nav>

      {/* Bottom Navigation for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-40">
        <div className="grid grid-cols-5 gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200 relative ${
                  isActive(item.path)
                    ? 'bg-gradient-to-b from-purple-100 to-blue-100 text-purple-700'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                <Icon className="h-5 w-5 mb-1" />
                <span className="text-xs font-medium truncate">{item.label}</span>
                {item.badge && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 text-xs p-0 flex items-center justify-center">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Navigation;
