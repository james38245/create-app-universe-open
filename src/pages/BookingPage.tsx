
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import BookingForm from '@/components/booking/BookingForm';
import BookingPolicies from '@/components/booking/BookingPolicies';

const BookingPage = () => {
  const { type, id } = useParams<{ type: 'venue' | 'service'; id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [selectedPackage, setSelectedPackage] = useState<string>('');
  const [selectedDates, setSelectedDates] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });

  // Mock data - in real app, fetch based on type and id
  const itemData = {
    venue: {
      id: '1',
      name: 'Safari Park Hotel',
      type: 'Hotel',
      location: 'Nairobi, Kenya',
      capacity: 500,
      pricePerDay: 150000
    },
    service: {
      id: '1',
      name: 'Elite Photography Services',
      type: 'Photography',
      location: 'Nairobi, Kenya',
      specialties: ['Wedding Photography', 'Event Photography', 'Portrait Photography'],
      basePrice: 25000
    }
  };

  const currentItem = type === 'venue' ? itemData.venue : itemData.service;

  const calculateTotal = () => {
    if (!selectedPackage) return 0;
    
    const packages = type === 'venue' ? [
      { id: 'half-day', price: 75000 },
      { id: 'full-day', price: 150000 },
      { id: 'weekend', price: 280000 }
    ] : [
      { id: 'basic', price: 25000 },
      { id: 'premium', price: 45000 },
      { id: 'deluxe', price: 75000 }
    ];

    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    return selectedPkg ? selectedPkg.price : 0;
  };

  const handleBookingSubmit = (formData: any) => {
    console.log('Booking submitted:', formData);
    toast({
      title: "Booking Request Submitted",
      description: "Your booking request has been sent for vendor approval. You will receive a confirmation within 24 hours.",
    });
    navigate('/bookings');
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
            Back to {type === 'venue' ? 'Venues' : 'Service Providers'}
          </Button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Book {currentItem.name}</h1>
            <p className="text-muted-foreground">
              Complete your booking request for {type === 'venue' ? 'this venue' : 'this service provider'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <BookingForm
                type={type || 'venue'}
                selectedPackage={selectedPackage}
                selectedDates={selectedDates}
                onPackageSelect={setSelectedPackage}
                onDateSelect={setSelectedDates}
                onSubmit={handleBookingSubmit}
              />
            </div>

            {/* Right Column - Summary & Policies */}
            <div className="space-y-6">
              {/* Booking Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium">{currentItem.name}</h4>
                    <p className="text-sm text-muted-foreground">{currentItem.location}</p>
                  </div>
                  
                  {selectedPackage && (
                    <div className="pt-4 border-t">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Package</span>
                        <span className="font-medium">
                          {selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1).replace('-', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span>KSh {calculateTotal().toLocaleString()}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Final price subject to vendor approval
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Policies */}
              <BookingPolicies type={type || 'venue'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
