
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Wifi, Car, Coffee, Camera } from 'lucide-react';
import Calendar from '@/components/Calendar';
import PaymentModal from '@/components/PaymentModal';
import RefundInfo from '@/components/booking/RefundInfo';
import VenueGallery from '@/components/venue/VenueGallery';
import VenueHeader from '@/components/venue/VenueHeader';
import VenueDetails from '@/components/venue/VenueDetails';
import VenueBookingForm from '@/components/venue/VenueBookingForm';

const VenueDetailPage = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPackage, setSelectedPackage] = useState<string>('full-day');
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
          <VenueGallery images={venue.images} venueName={venue.name} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Venue Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header */}
              <VenueHeader
                name={venue.name}
                location={venue.location}
                rating={venue.rating}
                reviews={venue.reviews}
                capacity={venue.capacity}
              />

              {/* Description and Amenities */}
              <VenueDetails
                description={venue.description}
                amenities={venue.amenities}
              />

              {/* Refund Information */}
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
              <VenueBookingForm
                packages={venue.packages}
                selectedPackage={selectedPackage}
                onPackageSelect={setSelectedPackage}
                selectedDate={selectedDate}
                totalAmount={totalAmount}
                maxCapacity={venue.capacity}
                onBooking={handleBooking}
              />
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
