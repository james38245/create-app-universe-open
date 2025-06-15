
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Amenity {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}

interface VenueDetailsProps {
  description: string;
  amenities: Amenity[];
}

const VenueDetails: React.FC<VenueDetailsProps> = ({ description, amenities }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About this venue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {description}
          </p>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <amenity.icon className="h-5 w-5 text-primary" />
                <span className="text-sm">{amenity.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VenueDetails;
