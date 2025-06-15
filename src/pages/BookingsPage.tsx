import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon, Plus, RefreshCcw, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from '@/hooks/use-toast';
import ReviewModal from '@/components/booking/ReviewModal';

interface Booking {
  id: string;
  event_date: string;
  guest_count: number;
  booking_type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
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
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Mock bookings data (replace with actual API call)
    const mockBookings: Booking[] = [
      {
        id: '1',
        event_date: '2024-08-15',
        guest_count: 50,
        booking_type: 'venue',
        status: 'confirmed',
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

  const handleRebookSimilar = (booking: any) => {
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
    // Removed toast notification
  };

  const handleCancelBooking = (bookingId: string) => {
    // Mock implementation: In a real app, you'd call an API to cancel the booking
    setBookings(prevBookings =>
      prevBookings.map(booking =>
        booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
      )
    );

    toast({
      title: "Booking Cancelled",
      description: "Your booking has been successfully cancelled.",
    });
  };

  const handleCopyBookingDetails = (booking: any) => {
    const bookingDetails = `
      Booking ID: ${booking.id}
      Event Date: ${booking.event_date}
      Guest Count: ${booking.guest_count}
      Type: ${booking.booking_type}
      Status: ${booking.status}
      ${booking.venues ? `Venue: ${booking.venues.name}, ${booking.venues.location}` : ''}
      ${booking.service_providers ? `Service: ${booking.service_providers.service_category}` : ''}
    `;

    navigator.clipboard.writeText(bookingDetails);

    toast({
      title: "Booking Details Copied",
      description: "Booking details have been copied to your clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-8 flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">My Bookings</CardTitle>
            <Button onClick={() => navigate('/')}>
              <Plus className="w-4 h-4 mr-2" /> New Booking
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Status Filter */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Filter by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={setSelectedStatus} defaultValue={selectedStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Date Filter */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Filter by Date</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="center" side="bottom">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      disabled={(date) =>
                        date > new Date()
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            {/* Refresh Button */}
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full" onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    toast({
                      title: "Bookings Refreshed",
                      description: "Your bookings have been updated.",
                    });
                  }, 500);
                }} disabled={loading}>
                  {loading ? <RefreshCcw className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCcw className="mr-2 h-4 w-4" />}
                  {loading ? 'Refreshing...' : 'Refresh Bookings'}
                </Button>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading bookings...</div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">Error: {error}</div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-8">No bookings found.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {filteredBookings.map(booking => (
                <Card key={booking.id}>
                  <CardHeader className="flex items-center justify-between">
                    <CardTitle>
                      {booking.venues?.name || booking.service_providers?.service_category}
                    </CardTitle>
                    <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                      {booking.status}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Event Date</Label>
                        <p>{booking.event_date}</p>
                      </div>
                      <div>
                        <Label>Guest Count</Label>
                        <p>{booking.guest_count}</p>
                      </div>
                      <div>
                        <Label>Booking Type</Label>
                        <p>{booking.booking_type}</p>
                      </div>
                      <div>
                        <Label>Created At</Label>
                        <p>{booking.created_at}</p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm" onClick={() => handleRebookSimilar(booking)}>
                        Rebook Similar
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleCancelBooking(booking.id)} disabled={booking.status === 'cancelled' || booking.status === 'completed'}>
                        Cancel
                      </Button>
                      <Button variant="secondary" size="sm" onClick={() => handleCopyBookingDetails(booking)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Copy Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
