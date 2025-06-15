
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wifi, Car, Coffee, Camera, MapPin, Users, Star, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ImageModal from '@/components/ImageModal';

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

  // Simple calendar component for showing availability
  const AvailabilityCalendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const firstDayWeekday = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const formatDate = (day: number) => {
      return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };
    
    const isDateBooked = (day: number) => {
      return venue.bookedDates.includes(formatDate(day));
    };
    
    const isDateAvailable = (day: number) => {
      return venue.availableDates.includes(formatDate(day));
    };
    
    const isPastDate = (day: number) => {
      const date = new Date(year, month, day);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    };
    
    const renderCalendarDays = () => {
      const days = [];
      
      // Empty cells for days before the first day of the month
      for (let i = 0; i < firstDayWeekday; i++) {
        days.push(<div key={`empty-${i}`} className="h-10" />);
      }
      
      // Days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const isBooked = isDateBooked(day);
        const isAvailable = isDateAvailable(day);
        const isPast = isPastDate(day);
        
        let dayClass = "h-10 w-10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ";
        
        if (isPast) {
          dayClass += "text-muted-foreground bg-gray-100";
        } else if (isBooked) {
          dayClass += "bg-red-100 text-red-600";
        } else if (isAvailable) {
          dayClass += "bg-green-100 text-green-600";
        } else {
          dayClass += "bg-gray-50 text-gray-400";
        }
        
        days.push(
          <div key={day} className={dayClass}>
            {day}
          </div>
        );
      }
      
      return days;
    };

    return (
      <div className="space-y-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(prev => {
              const newDate = new Date(prev);
              newDate.setMonth(prev.getMonth() - 1);
              return newDate;
            })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium text-lg">
            {monthNames[month]} {year}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(prev => {
              const newDate = new Date(prev);
              newDate.setMonth(prev.getMonth() + 1);
              return newDate;
            })}
          >
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
        
        {/* Legend */}
        <div className="flex flex-wrap gap-4 pt-4 border-t text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded" />
            <span>Not Available</span>
          </div>
        </div>
      </div>
    );
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
              {/* Header */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold">{venue.name}</h1>
                  <Badge variant="secondary">{venue.venueType}</Badge>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{venue.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Up to {venue.capacity} guests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{venue.rating} ({venue.reviews} reviews)</span>
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
                  <AvailabilityCalendar />
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
