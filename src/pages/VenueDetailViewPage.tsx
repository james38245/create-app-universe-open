
import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Wifi, Car, Coffee, Camera, MapPin, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import Calendar from '@/components/Calendar';

const VenueDetailViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
    venueType: 'Hotel',
    ownerInfo: {
      name: 'Safari Park Management',
      responseTime: '2 hours',
      verificationStatus: 'Verified'
    }
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

          {/* Image Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                  alt={`${venue.name} view ${index + 2}`}
                  className="w-full h-32 md:h-44 object-cover rounded-lg"
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

            {/* Right Column - Calendar & Action */}
            <div className="space-y-6">
              {/* Availability Calendar */}
              <Card>
                <CardHeader>
                  <CardTitle>Availability Calendar</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    View when this venue is available for booking
                  </p>
                </CardHeader>
                <CardContent>
                  <Calendar 
                    bookedDates={venue.bookedDates}
                  />
                </CardContent>
              </Card>

              {/* Book Now Button */}
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
                      No payment required to start booking
                    </p>
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

export default VenueDetailViewPage;
