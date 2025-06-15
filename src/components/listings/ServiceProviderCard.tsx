
import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Edit, Trash2, Clock, DollarSign } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ValidationStatusBadge from './ValidationStatusBadge';

interface ServiceProviderCardProps {
  provider: any;
  onDelete: (providerId: string) => void;
}

const ServiceProviderCard = ({ provider, onDelete }: ServiceProviderCardProps) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const deleteProviderMutation = useMutation({
    mutationFn: async (providerId: string) => {
      const { error } = await supabase
        .from('service_providers')
        .delete()
        .eq('id', providerId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-service-providers'] });
      toast({
        title: "Success",
        description: "Service provider profile deleted successfully"
      });
      onDelete(provider.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete service provider profile",
        variant: "destructive"
      });
    }
  });

  const handleView = () => {
    navigate(`/provider/${provider.id}`);
  };

  const handleEdit = () => {
    navigate('/listings', { state: { editProvider: provider } });
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this service provider profile? This action cannot be undone.')) {
      deleteProviderMutation.mutate(provider.id);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{provider.service_category}</CardTitle>
          <div className="flex gap-2 flex-wrap">
            <ValidationStatusBadge 
              status={provider.verification_status} 
              score={provider.verification_score}
            />
            <Badge variant={provider.is_available ? "default" : "secondary"}>
              {provider.is_available ? "Available" : "Draft"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {provider.years_experience || 0} years experience
          </div>
          
          <div className="flex items-center gap-2 text-sm font-semibold">
            <DollarSign className="h-4 w-4" />
            KSh {provider.price_per_event?.toLocaleString()}/event
          </div>
          
          <div className="text-xs text-muted-foreground">
            Response time: {provider.response_time_hours}h
          </div>

          {provider.verification_status === 'pending' && (
            <div className="text-xs text-muted-foreground bg-yellow-50 p-2 rounded">
              📋 Under admin review - estimated completion within 24 hours
            </div>
          )}

          {provider.verification_status === 'rejected' && provider.validation_notes && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              ❌ Issues to resolve: {provider.validation_notes}
            </div>
          )}

          {provider.verification_status === 'verified' && !provider.is_available && (
            <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
              ✅ Approved by admin - Waiting to go live
            </div>
          )}

          {provider.specialties && provider.specialties.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {provider.specialties.slice(0, 2).map((specialty: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {specialty}
                </Badge>
              ))}
              {provider.specialties.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{provider.specialties.length - 2} more
                </Badge>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleView}>
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleDelete}
            disabled={deleteProviderMutation.isPending}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceProviderCard;
