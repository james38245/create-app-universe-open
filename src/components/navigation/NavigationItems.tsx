
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Building, Users, Calendar, MessageSquare, Plus } from 'lucide-react';

const NavigationItems = () => {
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
  );
};

export default NavigationItems;
