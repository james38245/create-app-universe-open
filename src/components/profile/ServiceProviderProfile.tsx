
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Plus, Award } from 'lucide-react';

interface ServiceProviderProfileProps {
  profileData: {
    isServiceProvider: boolean;
  };
  serviceProviderData: {
    businessName: string;
    services: string[];
    experience: string;
    portfolio: string[];
    pricing: string;
  };
  onBecomeProvider: () => void;
  onServiceProviderChange: (data: any) => void;
  onAddService: () => void;
  onFileUpload: (type: 'portfolio') => void;
}

const ServiceProviderProfile: React.FC<ServiceProviderProfileProps> = ({
  profileData,
  serviceProviderData,
  onBecomeProvider,
  onServiceProviderChange,
  onAddService,
  onFileUpload
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Service Provider Profile</CardTitle>
          {!profileData.isServiceProvider && (
            <Button onClick={onBecomeProvider}>
              Become a Provider
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {profileData.isServiceProvider ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Business Name</Label>
                <Input 
                  value={serviceProviderData.businessName}
                  onChange={(e) => onServiceProviderChange({
                    ...serviceProviderData,
                    businessName: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input 
                  value={serviceProviderData.experience}
                  onChange={(e) => onServiceProviderChange({
                    ...serviceProviderData,
                    experience: e.target.value
                  })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Services Offered</Label>
              <div className="flex flex-wrap gap-2">
                {serviceProviderData.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1">
                    {service}
                    <button 
                      className="ml-2 text-xs"
                      onClick={() => {
                        const newServices = serviceProviderData.services.filter((_, i) => i !== index);
                        onServiceProviderChange({ ...serviceProviderData, services: newServices });
                      }}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" onClick={onAddService}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Pricing Range</Label>
              <Input 
                value={serviceProviderData.pricing}
                onChange={(e) => onServiceProviderChange({
                  ...serviceProviderData,
                  pricing: e.target.value
                })}
              />
            </div>

            <div className="space-y-2">
              <Label>Portfolio</Label>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {serviceProviderData.portfolio.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Portfolio ${index + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      onClick={() => {
                        const newPortfolio = serviceProviderData.portfolio.filter((_, i) => i !== index);
                        onServiceProviderChange({ ...serviceProviderData, portfolio: newPortfolio });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="h-20 border-dashed"
                  onClick={() => onFileUpload('portfolio')}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <Separator />

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <Award className="h-5 w-5" />
                <span className="font-medium">Provider Status: Active</span>
              </div>
              <p className="text-sm text-green-700">
                Your profile is complete and you're listed as an active service provider. Clients can now book your services!
              </p>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Become a Service Provider</h3>
            <p className="text-muted-foreground mb-4">
              Join our platform and offer your services to event organizers
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Requirements: Professional profile, CV/Resume upload, and service portfolio
            </p>
            <Button onClick={onBecomeProvider}>Get Started</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ServiceProviderProfile;
