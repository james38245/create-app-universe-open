
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import NavigationLogo from '@/components/navigation/NavigationLogo';
import NavigationItems from '@/components/navigation/NavigationItems';
import UserMenu from '@/components/navigation/UserMenu';
import MobileMenu from '@/components/navigation/MobileMenu';
import BottomNavigation from '@/components/navigation/BottomNavigation';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { loading } = useAuth();

  const handleBackNavigation = () => {
    navigate(-1);
  };

  const showBackButton = location.pathname !== '/' && location.pathname !== '/auth';

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
            <NavigationLogo 
              showBackButton={showBackButton}
              onBackNavigation={handleBackNavigation}
            />
            <NavigationItems />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden bg-white shadow-lg border-b fixed top-0 left-0 right-0 z-50">
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <NavigationLogo 
              showBackButton={showBackButton}
              onBackNavigation={handleBackNavigation}
            />
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

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          showBackButton={showBackButton}
          onBackNavigation={handleBackNavigation}
        />
      </nav>

      <BottomNavigation />
    </>
  );
};

export default Navigation;
