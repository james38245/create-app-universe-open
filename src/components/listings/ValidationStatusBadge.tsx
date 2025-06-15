
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ValidationStatusBadgeProps {
  status: 'pending' | 'verified' | 'rejected' | 'under_review';
  score?: number;
  className?: string;
}

const ValidationStatusBadge: React.FC<ValidationStatusBadgeProps> = ({ 
  status, 
  score, 
  className = "" 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: CheckCircle,
          text: 'Verified',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending Review',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'under_review':
        return {
          icon: AlertTriangle,
          text: 'Under Review',
          variant: 'outline' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'rejected':
        return {
          icon: XCircle,
          text: 'Rejected',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      default:
        return {
          icon: Shield,
          text: 'Unknown',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${config.className} ${className}`}>
      <Icon className="h-3 w-3 mr-1" />
      {config.text}
      {score && (
        <span className="ml-1 text-xs">
          ({score}%)
        </span>
      )}
    </Badge>
  );
};

export default ValidationStatusBadge;
