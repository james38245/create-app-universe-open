
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Users, Clock, MapPin, AlertTriangle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const BookingPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [eventDate, setEventDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState('');
  const [eventDetails, setEventDetails] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedPackage, setSelectedPackage] = useState('full-day');
  const [paymentMethod, setPaymentMethod] = useState('booking-then-payment');

  // Mock data based on type
  const mockData = {
    venue: {
      name: 'Safari Park Hotel',
      location: 'Nairobi, Kenya',
      capacity: 500,
      packages: [
        { id: 'half-day', name: 'Half Day', duration: '4 hours', price: 75000 },
        { id: 'full-day', name: 'Full Day', duration: '8 hours', price: 150000 },
        { id: 'weekend', name: 'Weekend Package', duration: '2 days', price: 280000 }
      ],
      bookedDates: ['2024-01-15', '2024-01-20', '2024-01-25'],
      bookingTerms: {
        cancellationPolicy: 'Full refund if cancelled 7 days before event',
        depositPercentage: 30,
        paymentDueDays: 7,
        advanceBookingDays: 2
      }
    },
    provider: {
      name: 'Premium Photography Services',
      serviceType: 'Photography',
      basePrice: 50000,
      bookingTerms: {
        cancellationPolicy: 'Full refund if cancelled 48 hours before event',
        depositPercentage: 50,
        paymentDueDays: 3,
        advanceBookingDays: 1
      }
    }
  };

  const currentData = type === 'venue' ? mockData.venue : mockData.provider;
  const selectedPackageData = type === 'venue' ? 
    currentData.packages?.find(pkg => pkg.id === selectedPackage) : 
    { price: currentData.basePrice };
  
  const totalAmount = selectedPackageData?.price || 0;
  const depositAmount = Math.round(totalAmount * (currentData.bookingTerms.depositPercentage / 100));

  const isDateAvailable = (date: Date) => {
    if (type === 'venue') {
      const dateString = format(date, 'yyyy-MM-dd');
      return !mockData.venue.bookedDates.includes(dateString);
    }
    return true; // For services, assume all dates are available for demo
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Booking submitted:', {
      id,
      type,
      eventDate,
      guestCount,
      eventDetails,
      contactName,
      contactEmail,
      contactPhone,
      selectedPackage,
      paymentMethod,
      totalAmount
    });
    // Here you would typically submit to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Book {currentData.name}
            </h1>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{currentData.location || `${currentData.serviceType} Service`}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Package Selection for Venues */}
                    {type === 'venue' && currentData.packages && (
                      <div className="space-y-3">
                        <Label>Select Package *</Label>
                        <RadioGroup value={selectedPackage} onValueChange={setSelectedPackage}>
                          {currentData.packages.map((pkg) => (
                            <div key={pkg.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <RadioGroupItem value={pkg.id} id={pkg.id} />
                              <div className="flex-1 flex justify-between">
                                <div>
                                  <Label htmlFor={pkg.id} className="font-medium cursor-pointer">
                                    {pkg.name}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">{pkg.duration}</p>
                                </div>
                                <span className="font-semibold">KSh {pkg.price.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {/* Event Date */}
                    <div className="space-y-2">
                      <Label htmlFor="event-date">Event Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !eventDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventDate ? format(eventDate, "PPP") : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={eventDate}
                            onSelect={setEventDate}
                            disabled={(date) => !isDateAvailable(date) || date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Guest Count */}
                    <div className="space-y-2">
                      <Label htmlFor="guest-count">Number of Guests *</Label>
                      <Input
                        id="guest-count"
                        type="number"
                        value={guestCount}
                        onChange={(e) => setGuestCount(e.target.value)}
                        placeholder="Enter number of guests"
                        min="1"
                        max={type === 'venue' ? currentData.capacity : undefined}
                        required
                      />
                      {type === 'venue' && (
                        <p className="text-sm text-muted-foreground">
                          Maximum capacity: {currentData.capacity} guests
                        </p>
                      )}
                    </div>

                    {/* Event Details */}
                    <div className="space-y-2">
                      <Label htmlFor="event-details">Event Details</Label>
                      <Textarea
                        id="event-details"
                        value={eventDetails}
                        onChange={(e) => setEventDetails(e.target.value)}
                        placeholder="Describe your event, special requirements, timeline, etc."
                        rows={4}
                      />
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contact-name">Full Name *</Label>
                          <Input
                            id="contact-name"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contact-phone">Phone Number *</Label>
                          <Input
                            id="contact-phone"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            placeholder="+254 700 000 000"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="contact-email">Email Address *</Label>
                        <Input
                          id="contact-email"
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="space-y-3">
                      <Label>Payment Method *</Label>
                      <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                        <div className="space-y-3">
                          <div className="flex items-start space-x-3 p-4 border rounded-lg">
                            <RadioGroupItem value="booking-then-payment" id="booking-then-payment" className="mt-1" />
                            <div className="flex-1">
                              <Label htmlFor="booking-then-payment" className="font-medium cursor-pointer flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Booking-then-Payment (Recommended)
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                Manual approval prevents overlapping rentals. Prices might change depending on conditions.
                              </p>
                              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                                <p>• No upfront payment required</p>
                                <p>• Pay {currentData.bookingTerms.depositPercentage}% deposit after approval</p>
                                <p>• Remaining balance due {currentData.bookingTerms.paymentDueDays} days before event</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>

                    <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                      Submit Booking Request
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{eventDate ? format(eventDate, "PPP") : 'Select date'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{guestCount || '0'} guests</span>
                  </div>
                  
                  {type === 'venue' && selectedPackageData && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{selectedPackageData.duration || 'Package duration'}</span>
                    </div>
                  )}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Base Price:</span>
                      <span>KSh {totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Deposit ({currentData.bookingTerms.depositPercentage}%):</span>
                      <span>KSh {depositAmount.toLocaleString()}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total Amount:</span>
                      <span>KSh {totalAmount.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* Booking Terms */}
                  <div className="space-y-3">
                    <h4 className="font-medium">Booking Terms</h4>
                    <div className="text-sm space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Cancellation Policy:</p>
                          <p className="text-muted-foreground">{currentData.bookingTerms.cancellationPolicy}</p>
                        </div>
                      </div>
                      <div className="text-muted-foreground text-xs space-y-1">
                        <p>• Book at least {currentData.bookingTerms.advanceBookingDays} day(s) in advance</p>
                        <p>• Deposit payment due within {currentData.bookingTerms.paymentDueDays} days of approval</p>
                        <p>• Final pricing confirmed after review</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
