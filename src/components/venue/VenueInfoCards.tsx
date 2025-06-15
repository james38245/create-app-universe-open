
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface VenueInfoCardsProps {
  venue: {
    description: string;
    amenities: Array<{ icon: any; label: string }>;
    packages: Array<{ id: string; name: string; duration: string; price: number }>;
    bookingTerms: {
      cancellationPolicy: string;
      refundPolicy: string;
      paymentMethods: string[];
      depositPercentage: number;
      advanceBookingDays: number;
    };
    ownerInfo: {
      name: string;
      responseTime: string;
      verificationStatus: string;
    };
  };
}

const VenueInfoCards: React.FC<VenueInfoCardsProps> = ({ venue }) => {
  return (
    <div className="space-y-6">
      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About this venue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">
            {venue.description}
          </p>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {venue.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <amenity.icon className="h-5 w-5 text-primary" />
                <span className="text-sm">{amenity.label}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Packages & Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Available Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {venue.packages.map((pkg) => (
              <div key={pkg.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{pkg.name}</h4>
                  <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                </div>
                <span className="font-semibold">KSh {pkg.price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Booking Terms & Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Terms & Policies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Cancellation Policy</h4>
            <p className="text-sm text-muted-foreground">{venue.bookingTerms.cancellationPolicy}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Refund Policy</h4>
            <p className="text-sm text-muted-foreground">{venue.bookingTerms.refundPolicy}</p>
          </div>
          <div>
            <h4 className="font-medium mb-2">Payment Methods</h4>
            <p className="text-sm text-muted-foreground">{venue.bookingTerms.paymentMethods.join(', ')}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <p className="text-sm font-medium">Deposit Required</p>
              <p className="text-sm text-muted-foreground">{venue.bookingTerms.depositPercentage}%</p>
            </div>
            <div>
              <p className="text-sm font-medium">Book in Advance</p>
              <p className="text-sm text-muted-foreground">{venue.bookingTerms.advanceBookingDays} days</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Owner Information */}
      <Card>
        <CardHeader>
          <CardTitle>Venue Owner</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{venue.ownerInfo.name}</h4>
              <p className="text-sm text-muted-foreground">
                Typically responds within {venue.ownerInfo.responseTime}
              </p>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              {venue.ownerInfo.verificationStatus}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VenueInfoCards;
