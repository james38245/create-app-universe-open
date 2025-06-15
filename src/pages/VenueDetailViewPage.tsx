
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Car, Coffee, Camera, CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImageModal from '@/components/ImageModal';
import VenueDetailHeader from '@/components/venue/VenueDetailHeader';
import VenueInfoCards from '@/components/venue/VenueInfoCards';
import VenueAvailabilityCalendar from '@/components/venue/VenueAvailabilityCalendar';

const VenueDetailViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock venue data - in real app, fetch based on id
  const venue = {
    id: '1',
    name: 'Safari Park Hotel',
    location: 'Nairobi, Kenya',
    rating: 4.8,
    reviews: 324,
    images: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    description: 'A luxurious hotel venue perfect for weddings, corporate events, and special celebrations. Located in the heart of Nairobi with stunning views and world-class amenities. Our spacious ballrooms and outdoor gardens provide the perfect backdrop for any occasion.',
    capacity: 500,
    pricePerDay: 150000,
    amenities: [
      { icon: Wifi, label: 'Free WiFi' },
      { icon: Car, label: 'Parking Available' },
      { icon: Coffee, label: 'Catering Services' },
      { icon: Camera, label: 'Photography Setup' }
    ],
    packages: [
      { id: 'half-day', name: 'Half Day', duration: '4 hours', price: 75000 },
      { id: 'full-day', name: 'Full Day', duration: '8 hours', price: 150000 },
      { id: 'weekend', name: 'Weekend Package', duration: '2 days', price: 280000 }
    ],
    bookedDates: ['2024-01-15', '2024-01-20', '2024-01-25'],
    availableDates: ['2024-01-16', '2024-01-17', '2024-01-18', '2024-01-19', '2024-01-21', '2024-01-22', '2024-01-23', '2024-01-24'],
    venueType: 'Hotel',
    ownerInfo: {
      name: 'Safari Park Management',
      responseTime: '2 hours',
      verificationStatus: 'Verified'
    },
    bookingTerms: {
      cancellationPolicy: 'Full refund if cancelled 7 days before event',
      refundPolicy: 'Full refund available up to 7 days before event. 50% refund 3-7 days before. No refund within 72 hours.',
      paymentMethods: ['M-Pesa', 'Bank Transfer', 'Credit Card'],
      depositPercentage: 30,
      paymentDueDays: 7,
      advanceBookingDays: 2
    }
  };

  const openImageModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Back Button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Venues
          </Button>

          {/* Image Gallery - Clickable */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="md:col-span-2">
              <img 
                src={venue.images[0]} 
                alt={venue.name}
                className="w-full h-64 md:h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => openImageModal(0)}
              />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
              {venue.images.slice(1).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`${venue.name} view ${index + 2}`}
                  className="w-full h-32 md:h-44 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => openImageModal(index + 1)}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Venue Details */}
            <div className="lg:col-span-2 space-y-6">
              <VenueDetailHeader venue={venue} />
              <VenueInfoCards venue={venue} />
            </div>

            {/* Right Column - Calendar & Booking */}
            <div className="space-y-6">
              {/* Availability Calendar - Read Only */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Availability Calendar
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View when this venue is available for booking
                  </p>
                </CardHeader>
                <CardContent>
                  <VenueAvailabilityCalendar 
                    bookedDates={venue.bookedDates}
                    availableDates={venue.availableDates}
                  />
                </CardContent>
              </Card>

              {/* Booking Action */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Starting from</p>
                      <p className="text-2xl font-bold">KSh {venue.pricePerDay.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">per day</p>
                    </div>
                    <Button 
                      onClick={() => navigate(`/booking/venue/${venue.id}`)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                      size="lg"
                    >
                      Book This Venue
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Booking requires vendor approval
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        images={venue.images}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrevious={previousImage}
        venueName={venue.name}
      />
    </div>
  );
};

export default VenueDetailViewPage;
