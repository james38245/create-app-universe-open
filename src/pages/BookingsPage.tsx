
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus, RefreshCcw, MapPin, Users, Clock, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/hooks/use-toast';
import RefundDialog from '@/components/booking/RefundDialog';
import RefundInfo from '@/components/booking/RefundInfo';

interface Booking {
  id: string;
  event_date: string;
  guest_count: number;
  booking_type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'refunded';
  venues?: {
    name: string;
    location: string;
  };
  service_providers?: {
    service_category: string;
  };
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mock bookings data with payment information
    const mockBookings: Booking[] = [
      {
        id: '1',
        event_date: '2024-08-15',
        guest_count: 50,
        booking_type: 'venue',
        status: 'confirmed',
        payment_status: 'paid',
        total_amount: 25000,
        created_at: '2024-01-20',
        updated_at: '2024-01-25',
        venues: {
          name: 'The Grand Ballroom',
          location: 'Nairobi'
        }
      },
      {
        id: '2',
        event_date: '2024-09-20',
        guest_count: 10,
        booking_type: 'service',
        status: 'pending',
        payment_status: 'pending',
        total_amount: 15000,
        created_at: '2024-02-01',
        updated_at: '2024-02-05',
        service_providers: {
          service_category: 'Photography'
        }
      },
      {
        id: '3',
        event_date: '2024-10-10',
        guest_count: 100,
        booking_type: 'venue',
        status: 'completed',
        payment_status: 'paid',
        total_amount: 45000,
        created_at: '2024-03-01',
        updated_at: '2024-03-05',
        venues: {
          name: 'Safari Park Hotel',
          location: 'Nairobi'
        }
      },
      {
        id: '4',
        event_date: '2024-11-05',
        guest_count: 20,
        booking_type: 'service',
        status: 'cancelled',
        payment_status: 'refunded',
        total_amount: 18000,
        created_at: '2024-04-01',
        updated_at: '2024-04-05',
        service_providers: {
          service_category: 'Catering'
        }
      },
    ];

    setTimeout(() => {
      setBookings(mockBookings);
      setLoading(false);
    }, 500);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (selectedStatus === 'all') return true;
    return booking.status === selectedStatus;
  });

  const handleRebookSimilar = (booking: Booking) => {
    const searchParams = new URLSearchParams();
    
    if (booking.booking_type === 'venue') {
      searchParams.set('type', 'venue');
      searchParams.set('location', booking.venues?.location || '');
      searchParams.set('capacity', booking.guest_count?.toString() || '');
      searchParams.set('date', booking.event_date || '');
      navigate(`/venues?${searchParams.toString()}`);
    } else {
      searchParams.set('type', 'service');
      searchParams.set('category', booking.service_providers?.service_category || '');
      searchParams.set('date', booking.event_date || '');
      navigate(`/providers?${searchParams.toString()}`);
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    if (booking.payment_status === 'paid') {
      setSelectedBooking(booking);
      setShowRefundDialog(true);
    } else {
      // For unpaid bookings, just cancel directly
      setBookings(prevBookings =>
        prevBookings.map(b =>
          b.id === booking.id ? { ...b, status: 'cancelled' } : b
        )
      );
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
                <p className="text-gray-600 mt-1">Manage your venue and service bookings</p>
              </div>
              <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" /> 
                New Booking
              </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Filter by:</span>
                <Select onValueChange={setSelectedStatus} defaultValue={selectedStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button 
                variant="outline" 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    toast({
                      title: "Refreshed",
                      description: "Your bookings have been updated.",
                    });
                  }, 500);
                }} 
                disabled={loading}
              >
                {loading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                Refresh
              </Button>
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCcw className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-3 text-lg text-gray-600">Loading bookings...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 text-lg">Error: {error}</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-500">Get started by creating your first booking.</p>
                <Button onClick={() => navigate('/')} className="mt-4">
                  Create Booking
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBookings.map(booking => (
                <Card key={booking.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {booking.venues?.name || booking.service_providers?.service_category}
                          </h3>
                          <Badge className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(booking.status))}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </Badge>
                          <Badge className={cn("px-3 py-1 rounded-full text-xs font-medium", getPaymentStatusColor(booking.payment_status))}>
                            {booking.payment_status === 'paid' ? 'Paid' : booking.payment_status === 'refunded' ? 'Refunded' : 'Payment Pending'}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <CalendarIcon className="h-4 w-4" />
                            <span className="text-sm">{format(new Date(booking.event_date), 'MMM dd, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span className="text-sm">{booking.guest_count} guests</span>
                          </div>
                          {booking.venues?.location && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4" />
                              <span className="text-sm">{booking.venues.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="text-sm font-medium">KSh {booking.total_amount?.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Refund Info for paid bookings */}
                        {booking.payment_status === 'paid' && booking.status !== 'cancelled' && (
                          <div className="mb-4">
                            <RefundInfo bookingAmount={booking.total_amount} />
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 ml-6">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleRebookSimilar(booking)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Rebook Similar
                        </Button>
                        {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => handleCancelBooking(booking)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            {booking.payment_status === 'paid' ? 'Cancel & Refund' : 'Cancel'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Refund Dialog */}
      {selectedBooking && (
        <RefundDialog
          booking={selectedBooking}
          isOpen={showRefundDialog}
          onClose={() => {
            setShowRefundDialog(false);
            setSelectedBooking(null);
          }}
        />
      )}
    </div>
  );
};

export default BookingsPage;
