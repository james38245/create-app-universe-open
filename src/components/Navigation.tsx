
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar, Menu, X, User, LogOut, Building, Settings, HelpCircle, MessageSquare } from 'lucide-react';
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
      <nav className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Vendoor
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/venues" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Venues
              </Link>
              <Link to="/providers" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                Providers
              </Link>
              {user && (
                <>
                  <Link to="/listings" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                    My Listings
                  </Link>
                  <Link to="/bookings" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                    My Bookings
                  </Link>
                  <Link to="/messages" className="text-gray-700 hover:text-purple-600 font-medium transition-colors">
                    Messages
                  </Link>
                </>
              )}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-2 hover:bg-purple-50">
                      <User className="h-4 w-4" />
                      <span>Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-white border border-gray-200 shadow-lg">
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="hover:bg-purple-50">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/settings')} className="hover:bg-purple-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/faq')} className="hover:bg-purple-50">
                      <HelpCircle className="h-4 w-4 mr-2" />
                      FAQ
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/support')} className="hover:bg-purple-50">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Support
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/listings')} className="hover:bg-purple-50">
                      <Building className="h-4 w-4 mr-2" />
                      My Listings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="hover:bg-purple-50">
                      <Settings className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-50 text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => setShowAuthModal(true)} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
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
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col space-y-4">
                <Link 
                  to="/venues" 
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Venues
                </Link>
                <Link 
                  to="/providers" 
                  className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Providers
                </Link>
                {user && (
                  <>
                    <Link 
                      to="/listings" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Listings
                    </Link>
                    <Link 
                      to="/bookings" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      My Bookings
                    </Link>
                    <Link 
                      to="/messages" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link 
                      to="/faq" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      FAQ
                    </Link>
                    <Link 
                      to="/support" 
                      className="text-gray-700 hover:text-purple-600 font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Support
                    </Link>
                    <Button onClick={handleSignOut} variant="outline" className="w-fit">
                      Sign Out
                    </Button>
                  </>
                )}
                {!user && (
                  <Button onClick={() => setShowAuthModal(true)} className="w-fit bg-gradient-to-r from-purple-600 to-blue-600">
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
