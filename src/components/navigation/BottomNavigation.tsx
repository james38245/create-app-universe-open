
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Calendar, MessageSquare, Plus } from 'lucide-react';

const BottomNavigation = () => {
  const location = useLocation();

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

  const isActive = (path: string) => location.pathname === path;

  return (
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
  );
};

export default BottomNavigation;
