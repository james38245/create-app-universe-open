
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface NavigationLogoProps {
  showBackButton: boolean;
  onBackNavigation: () => void;
}

const NavigationLogo = ({ showBackButton, onBackNavigation }: NavigationLogoProps) => {
  return (
    <div className="flex items-center space-x-4">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBackNavigation}
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
  );
};

export default NavigationLogo;
