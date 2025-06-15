
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock, Users } from 'lucide-react';

interface Package {
  id: string;
  name: string;
  duration: string;
  price: number;
}

interface VenueBookingFormProps {
  packages: Package[];
  selectedPackage: string;
  onPackageSelect: (packageId: string) => void;
  selectedDate: string;
  totalAmount: number;
  maxCapacity: number;
  onBooking: () => void;
}

const VenueBookingForm: React.FC<VenueBookingFormProps> = ({
  packages,
  selectedPackage,
  onPackageSelect,
  selectedDate,
  totalAmount,
  maxCapacity,
  onBooking
}) => {
  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Book this venue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Package Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Select Package</label>
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                selectedPackage === pkg.id 
                  ? 'border-primary bg-primary/5' 
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => onPackageSelect(pkg.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{pkg.name}</h4>
                  <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                </div>
                <span className="font-semibold">KSh {pkg.price.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Venue Capacity Display */}
        <div className="p-3 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Venue Capacity</p>
              <p className="text-sm text-muted-foreground">Up to {maxCapacity} guests</p>
            </div>
          </div>
        </div>

        {/* Selected Date Display */}
        {selectedDate && (
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">Selected Date</p>
            <p className="text-sm text-muted-foreground">
              {new Date(selectedDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        )}

        <Separator />

        {/* Price Summary */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Package price</span>
            <span>KSh {totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>KSh {totalAmount.toLocaleString()}</span>
          </div>
        </div>

        {/* Book Button */}
        <Button 
          onClick={onBooking}
          className="w-full"
          size="lg"
          disabled={!selectedDate}
        >
          {selectedDate ? 'Proceed to Payment' : 'Select a Date'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default VenueBookingForm;
