import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Calendar, MapPin, Clock, Phone, MessageSquare, Star, Eye, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import ReviewModal from '@/components/booking/ReviewModal';

const BookingsPage = () => {
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock bookings data with enhanced status information
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
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
        contact: '+254 700 123 456',
        guests: 200,
        bookingRef: 'VEN-001-2024'
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
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
        contact: '+254 722 456 789',
        rating: 4.9,
        bookingRef: 'SRV-002-2024'
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
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
        contact: '+254 711 789 012',
        guests: 500,
        rating: 4.8,
        bookingRef: 'VEN-003-2024'
      }
    ],
    cancelled: [
      {
        id: '4',
        type: 'venue',
        name: 'Villa Rosa Kempinski',
        location: 'Westlands',
        date: '2024-01-25',
        time: '6:00 PM - 11:00 PM',
        status: 'cancelled',
        amount: 200000,
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
        contact: '+254 755 345 678',
        guests: 150,
        refundAmount: 180000,
        bookingRef: 'VEN-004-2024'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-500 hover:bg-green-600';
      case 'pending': return 'bg-yellow-500 hover:bg-yellow-600';
      case 'completed': return 'bg-blue-500 hover:bg-blue-600';
      case 'cancelled': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500 hover:bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <X className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Awaiting Admin Approval';
      case 'confirmed': return 'Confirmed';
      case 'completed': return 'Completed';
      case 'cancelled': return 'Cancelled';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const handleCall = (contact: string) => {
    window.location.href = `tel:${contact}`;
    toast({
      title: "Initiating Call",
      description: `Calling ${contact}`,
    });
  };

  const handleMessage = (booking: any) => {
    const params = new URLSearchParams({
      user: booking.id,
      name: booking.name || booking.providerName,
      role: booking.type === 'venue' ? 'venue_owner' : 'service_provider'
    });
    navigate(`/messages?${params.toString()}`);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
  };

  const handleCancelBooking = (bookingId: string) => {
    toast({
      title: "Booking Cancelled",
      description: "Your booking has been cancelled. Refund will be processed within 24-48 hours.",
    });
  };

  const handleBookAgain = (booking: any) => {
    // Navigate to the appropriate booking page with pre-filled data
    const bookingData = {
      type: booking.type,
      venueId: booking.type === 'venue' ? booking.id : null,
      serviceProviderId: booking.type === 'service' ? booking.id : null,
      location: booking.location,
      guests: booking.guests,
      eventType: 'event', // You might want to store this in booking data
      amount: booking.amount
    };

    if (booking.type === 'venue') {
      navigate(`/venue/${booking.id}?rebook=true&bookingRef=${booking.bookingRef}`);
    } else {
      navigate(`/providers?rebook=true&bookingRef=${booking.bookingRef}&serviceProvider=${booking.id}`);
    }

    toast({
      title: "Redirecting to Booking",
      description: "Your previous booking details have been pre-filled.",
    });
  };

  const handleRebookSimilar = (booking: any) => {
    // Navigate to search/browse page with similar criteria
    const searchParams = new URLSearchParams({
      location: booking.location,
      guests: booking.guests?.toString() || '',
      type: booking.type,
      priceRange: `0-${booking.amount * 1.2}` // Allow 20% higher price range
    });

    if (booking.type === 'venue') {
      navigate(`/venues?${searchParams.toString()}`);
    } else {
      navigate(`/providers?${searchParams.toString()}&category=${booking.service}`);
    }

    toast({
      title: "Finding Similar Options",
      description: "Showing venues/services similar to your cancelled booking.",
    });
  };

  const BookingCard = ({ booking }: { booking: any }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4 border-l-purple-500">
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
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.type === 'venue' ? booking.name : booking.providerName}
                  </h3>
                  <Badge className={`${getStatusColor(booking.status)} text-white flex items-center gap-1`}>
                    {getStatusIcon(booking.status)}
                    {getStatusText(booking.status)}
                  </Badge>
                </div>
                
                {booking.type === 'service' && (
                  <p className="text-purple-600 font-medium mb-2">{booking.service}</p>
                )}
                
                <div className="space-y-1 text-sm text-gray-600">
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
                      <span className="font-medium">{booking.guests} guests</span>
                    </div>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    Ref: {booking.bookingRef}
                  </div>
                </div>
              </div>

              <div className="mt-4 md:mt-0 md:text-right">
                <p className="text-2xl font-bold text-gray-900 mb-2">
                  KSh {booking.amount.toLocaleString()}
                </p>
                
                {booking.rating && (
                  <div className="flex items-center gap-1 mb-3 md:justify-end">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{booking.rating}</span>
                  </div>
                )}

                {booking.refundAmount && (
                  <p className="text-sm text-green-600 mb-2 font-medium">
                    Refund: KSh {booking.refundAmount.toLocaleString()}
                  </p>
                )}

                <div className="flex flex-col gap-2">
                  {/* View Details Button - Always available */}
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleViewDetails(booking)}
                    className="w-full md:w-auto hover:bg-purple-50 hover:border-purple-300"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>

                  {booking.status === 'confirmed' && (
                    <>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCall(booking.contact)}
                          className="flex-1 md:flex-none hover:bg-green-50 hover:border-green-300"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleMessage(booking)}
                          className="flex-1 md:flex-none hover:bg-blue-50 hover:border-blue-300"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="w-full md:w-auto">
                            Cancel Booking
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to cancel this booking? This action cannot be undone. 
                              A refund will be processed according to the cancellation policy.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  
                  {booking.status === 'pending' && (
                    <>
                      <div className="text-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="h-5 w-5 text-yellow-600 mx-auto mb-1" />
                        <p className="text-sm text-yellow-800 font-medium">Awaiting Admin Approval</p>
                        <p className="text-xs text-yellow-700">You'll be notified once approved</p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleCall(booking.contact)}
                          className="flex-1 hover:bg-green-50"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleMessage(booking)}
                          className="flex-1 hover:bg-blue-50"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm" className="w-full">
                            Cancel Booking
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Cancel Pending Booking</AlertDialogTitle>
                            <AlertDialogDescription>
                              This booking is pending approval. Cancelling now will remove it from the queue.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleCancelBooking(booking.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Cancel Booking
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>
                  )}
                  
                  {booking.status === 'completed' && (
                    <>
                      <ReviewModal booking={booking}>
                        <Button size="sm" className="w-full md:w-auto bg-purple-600 hover:bg-purple-700">
                          Leave Review
                        </Button>
                      </ReviewModal>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full md:w-auto hover:bg-purple-50"
                        onClick={() => handleBookAgain(booking)}
                      >
                        Book Again
                      </Button>
                    </>
                  )}
                  
                  {booking.status === 'cancelled' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full md:w-auto hover:bg-purple-50"
                      onClick={() => handleRebookSimilar(booking)}
                    >
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              My Bookings
            </h1>
            <p className="text-gray-600 text-lg">
              Manage your venue and service provider bookings
            </p>
          </div>

          {/* Bookings Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white shadow-sm">
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Upcoming ({bookings.upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="past" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Past ({bookings.past.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Cancelled ({bookings.cancelled.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {bookings.upcoming.length > 0 ? (
                bookings.upcoming.map(booking => (
                  <BookingCard key={booking.id} booking={booking} />
                ))
              ) : (
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">No upcoming bookings</h3>
                    <p className="text-gray-600 mb-6">
                      Ready to plan your next event?
                    </p>
                    <Link to="/venues">
                      <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                        Browse Venues
                      </Button>
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
                <Card className="border-2 border-dashed border-gray-300">
                  <CardContent className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">No cancelled bookings</h3>
                    <p className="text-gray-600">
                      All your bookings are on track!
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Booking Details Modal */}
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Booking Details
            </DialogTitle>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Booking Reference</label>
                  <p className="font-semibold">{selectedBooking.bookingRef}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Status</label>
                  <Badge className={`${getStatusColor(selectedBooking.status)} text-white ml-2`}>
                    {getStatusText(selectedBooking.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Venue/Service</label>
                  <p className="font-semibold">{selectedBooking.name || selectedBooking.providerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="font-semibold">{new Date(selectedBooking.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Time</label>
                  <p className="font-semibold">{selectedBooking.time}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Amount</label>
                  <p className="font-semibold">KSh {selectedBooking.amount.toLocaleString()}</p>
                </div>
                {selectedBooking.guests && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Guests</label>
                    <p className="font-semibold">{selectedBooking.guests}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-gray-600">Contact</label>
                  <p className="font-semibold">{selectedBooking.contact}</p>
                </div>
              </div>
              {selectedBooking.refundAmount && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-800">
                    Refund Amount: KSh {selectedBooking.refundAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BookingsPage;
