
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X, User, LogOut, Building, Settings } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">EventSpace</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/venues" className="text-gray-700 hover:text-purple-600 font-medium">
                Venues
              </Link>
              <Link to="/providers" className="text-gray-700 hover:text-purple-600 font-medium">
                Providers
              </Link>
              {user && (
                <>
                  <Link to="/listings" className="text-gray-700 hover:text-purple-600 font-medium">
                    My Listings
                  </Link>
                  <Link to="/bookings" className="text-gray-700 hover:text-purple-600 font-medium">
                    My Bookings
                  </Link>
                  <Link to="/messages" className="text-gray-700 hover:text-purple-600 font-medium">
                    Messages
                  </Link>
                  <Link to="/admin" className="text-gray-700 hover:text-purple-600 font-medium">
                    Admin
                  </Link>
                </>
              )}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/profile')}>
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/listings')}>
                      <Building className="h-4 w-4 mr-2" />
                      My Listings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/venues" 
                  className="text-gray-700 hover:text-purple-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Venues
                </Link>
                <Link 
                  to="/providers" 
                  className="text-gray-700 hover:text-purple-600 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Providers
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/listings" 
                      className="text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      My Listings
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/messages" 
                      className="text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link 
                      to="/admin" 
                      className="text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Button onClick={handleSignOut} variant="outline" className="w-fit">
                      Sign Out
                    </Button>
                  </>
                )}
                {!user && (
                  <Button onClick={() => setShowAuthModal(true)} className="w-fit">
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};

export default Navigation;
