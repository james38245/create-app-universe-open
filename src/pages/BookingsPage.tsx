
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, MapPin, Clock, Phone, MessageSquare, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const BookingsPage = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');

  // Mock bookings data
  const bookings = {
    upcoming: [
      {
        id: '1',
        type: 'venue',
        name: 'Safari Park Hotel',
        location: 'Nairobi',
        date: '2024-02-15',
        time: '10:00 AM - 6:00 PM',
        status: 'confirmed',
        amount: 150000,
        image: '/placeholder.svg',
        contact: '+254 700 123 456',
        guests: 200
      },
      {
        id: '2',
        type: 'service',
        providerName: 'James Mwangi',
        service: 'Wedding Photography',
        location: 'Karen',
        date: '2024-02-20',
        time: '2:00 PM - 8:00 PM',
        status: 'pending',
        amount: 45000,
        image: '/placeholder.svg',
        contact: '+254 722 456 789',
        rating: 4.9
      }
    ],
    past: [
      {
        id: '3',
        type: 'venue',
        name: 'KICC Amphitheatre',
        location: 'Nairobi CBD',
        date: '2024-01-10',
        time: '9:00 AM - 5:00 PM',
        status: 'completed',
        amount: 300000,
        image: '/placeholder.svg',
        contact: '+254 711 789 012',
        guests: 500,
        rating: 4.8
      },
      {
        id: '4',
        type: 'service',
        providerName: 'Sarah Kimani',
        service: 'Event Coordination',
        location: 'Westlands',
        date: '2024-01-05',
        time: 'Full Day',
        status: 'completed',
        amount: 60000,
        image: '/placeholder.svg',
        contact: '+254 733 012 345',
        rating: 4.7
      }
    ],
    cancelled: [
      {
        id: '5',
        type: 'venue',
        name: 'Villa Rosa Kempinski',
        location: 'Westlands',
        date: '2024-01-25',
        time: '6:00 PM - 11:00 PM',
        status: 'cancelled',
        amount: 200000,
        image: '/placeholder.svg',
        contact: '+254 755 345 678',
        guests: 150,
        refundAmount: 180000
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Image */}
          <div className="md:w-1/3">
            <img 
              src={booking.image} 
              alt={booking.name || booking.providerName}
              className="w-full h-48 md:h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-semibold">
                    {booking.type === 'venue' ? booking.name : booking.providerName}
                  </h3>
                  <Badge className={`${getStatusColor(booking.status)} text-white`}>
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                
                {booking.type === 'service' && (
                  <p className="text-muted-foreground mb-2">{booking.service}</p>
                )}
                
                <div className="space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(booking.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{booking.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.location}</span>
                  </div>
                  
                  {booking.guests && (
                    <div className="flex items-center gap-2">
                      <span>{booking.guests} guests</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-2xl font-bold mb-2">
                  KSh {booking.amount.toLocaleString()}
                </p>
                
                {booking.rating && (
                  <div className="flex items-center gap-1 mb-3 md:justify-end">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{booking.rating}</span>
                  </div>
                )}

                {booking.refundAmount && (
                  <p className="text-sm text-green-600 mb-2">
                    Refund: KSh {booking.refundAmount.toLocaleString()}
                  </p>
                )}

                <div className="flex flex-col gap-2">
                  {booking.status === 'confirmed' && (
                    <>
                      <Button size="sm" className="w-full md:w-auto">
                        View Details
                      </Button>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none">
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Link to="/messages" className="flex-1 md:flex-none">
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Message
                          </Button>
                        </Link>
                      </div>
                    </>
                  )}
                  
                  {booking.status === 'pending' && (
                    <>
                      <Button variant="destructive" size="sm" className="w-full md:w-auto">
                        Cancel Booking
                      </Button>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        Contact Provider
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'completed' && (
                    <>
                      <Button size="sm" className="w-full md:w-auto">
                        Leave Review
                      </Button>
                      <Button variant="outline" size="sm" className="w-full md:w-auto">
                        Book Again
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <Button variant="outline" size="sm" className="w-full md:w-auto">
                      Rebook Similar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              Manage your venue and service provider bookings
            </p>
          </div>

          {/* Bookings Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">
                Upcoming ({bookings.upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({bookings.past.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({bookings.cancelled.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {bookings.upcoming.length > 0 ? (
                bookings.upcoming.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No upcoming bookings</h3>
                    <p className="text-muted-foreground mb-4">
                      Ready to plan your next event?
                    </p>
                    <Link to="/venues">
                      <Button>Browse Venues</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {bookings.past.map(booking => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {bookings.cancelled.length > 0 ? (
                bookings.cancelled.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">No cancelled bookings</h3>
                    <p className="text-muted-foreground">
                      All your bookings are on track!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
