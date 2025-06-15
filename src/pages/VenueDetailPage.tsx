import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, MapPin, Users, Wifi, Car, Coffee, Camera, Clock } from 'lucide-react';
import Calendar from '@/components/Calendar';
import PaymentModal from '@/components/PaymentModal';
import RefundInfo from '@/components/booking/RefundInfo';

const VenueDetailPage = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('full-day');
  const [guestCount, setGuestCount] = useState<number>(100);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Mock venue data
  const venue = {
    id: '1',
    name: 'Safari Park Hotel',
    location: 'Nairobi, Kenya',
    rating: 4.8,
    reviews: 324,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    description: 'A luxurious hotel venue perfect for weddings, corporate events, and special celebrations. Located in the heart of Nairobi with stunning views and world-class amenities.',
    capacity: 500,
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Parking' },
      { icon: Coffee, label: 'Catering' },
      { icon: Camera, label: 'Photography' }
    ],
    packages: [
      { id: 'half-day', name: 'Half Day', duration: '4 hours', price: 75000 },
      { id: 'full-day', name: 'Full Day', duration: '8 hours', price: 150000 },
      { id: 'weekend', name: 'Weekend Package', duration: '2 days', price: 280000 }
    ],
    bookedDates: ['2024-01-15', '2024-01-20', '2024-01-25']
  };

  const selectedPackageDetails = venue.packages.find(pkg => pkg.id === selectedPackage);
  const totalAmount = selectedPackageDetails ? selectedPackageDetails.price : 0;

  const handleBooking = () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }
    setIsPaymentModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <img 
                src={venue.images[0]} 
                alt={venue.name}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {venue.images.slice(1).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${venue.name} ${index + 2}`}
                  className="w-full h-32 md:h-44 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Venue Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{venue.name}</h1>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{venue.rating}</span>
                    <span className="text-muted-foreground">({venue.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>Up to {venue.capacity} guests</span>
                  </div>
                </div>
              </div>

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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {venue.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <amenity.icon className="h-5 w-5 text-primary" />
                        <span className="text-sm">{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Refund Information */}
              <RefundInfo bookingAmount={totalAmount} />

              {/* Calendar */}
              <Calendar 
                bookedDates={venue.bookedDates}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
              />
            </div>

            {/* Right Column - Booking Form */}
            <div className="space-y-6">
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
                    <Label>Select Package</Label>
                    {venue.packages.map((pkg) => (
                      <div
                        key={pkg.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedPackage === pkg.id 
                            ? 'border-primary bg-primary/5' 
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => setSelectedPackage(pkg.id)}
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

                  {/* Guest Count */}
                  <div className="space-y-2">
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      min="1"
                      max={venue.capacity}
                    />
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
                    onClick={handleBooking}
                    className="w-full"
                    size="lg"
                    disabled={!selectedDate}
                  >
                    {selectedDate ? 'Proceed to Payment' : 'Select a Date'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={totalAmount}
        bookingDetails={{
          venueName: venue.name,
          date: selectedDate ? new Date(selectedDate).toLocaleDateString() : '',
          duration: selectedPackageDetails?.duration || ''
        }}
      />
    </div>
  );
};

export default VenueDetailPage;
