import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import FlutterwavePayment from '@/components/payment/FlutterwavePayment';
import PesapalPayment from '@/components/payment/PesapalPayment';

interface BookingFormProps {
  type: 'venue' | 'service';
  selectedPackage: any;
  selectedDates: { start: Date | null; end: Date | null };
  onPackageSelect: (packageId: string) => void;
  onDateSelect: (dates: { start: Date | null; end: Date | null }) => void;
  onSubmit: (formData: any) => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  type,
  selectedPackage,
  selectedDates,
  onPackageSelect,
  onDateSelect,
  onSubmit
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    specialRequests: ''
  });

  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true);
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [bookingId, setBookingId] = React.useState<string>('');

  // Load user profile data on component mount
  useEffect(() => {
    const loadUserProfile = async () => {
      if (user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('full_name, email, phone')
            .eq('id', user.id)
            .single();

          if (error) {
            console.error('Error loading profile:', error);
          } else if (profile) {
            setFormData(prev => ({
              ...prev,
              name: profile.full_name || '',
              email: profile.email || '',
              phone: profile.phone || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setIsLoadingProfile(false);
    };

    loadUserProfile();
  }, [user]);

  const packages = type === 'venue' ? [
    { id: 'half-day', name: 'Half Day', duration: '4 hours', price: 75000 },
    { id: 'full-day', name: 'Full Day', duration: '8 hours', price: 150000 },
    { id: 'weekend', name: 'Weekend Package', duration: '2 days', price: 280000 }
  ] : [
    { id: 'basic', name: 'Basic Package', price: 25000 },
    { id: 'premium', name: 'Premium Package', price: 45000 },
    { id: 'deluxe', name: 'Deluxe Package', price: 75000 }
  ];

  const calculateTotal = () => {
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    return selectedPkg ? selectedPkg.price : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to submit a booking request.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create booking record with pending status
      const { data: booking, error } = await supabase
        .from('bookings')
        .insert({
          client_id: user.id,
          booking_type: type,
          venue_id: type === 'venue' ? selectedPackage : null,
          service_provider_id: type === 'service' ? selectedPackage : null,
          event_date: selectedDates.start?.toISOString(),
          event_type: formData.eventType,
          guest_count: formData.guestCount ? parseInt(formData.guestCount) : null,
          special_requirements: formData.specialRequests,
          total_amount: calculateTotal(),
          status: 'pending',
          payment_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setBookingId(booking.id);
      
      toast({
        title: "Booking Request Created",
        description: "Your booking request has been submitted. Awaiting vendor approval before payment.",
      });

      // For now, we'll show payment modal immediately
      // In production, this would happen after vendor approval
      setShowPaymentModal(true);
      
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Failed to create booking request.",
        variant: "destructive"
      });
    }
  };

  const getBookingDetails = () => {
    const selectedPkg = packages.find(pkg => pkg.id === selectedPackage);
    return {
      itemName: selectedPkg?.name || 'Package',
      date: selectedDates.start ? selectedDates.start.toLocaleDateString() : 'TBD',
      duration: 'duration' in (selectedPkg || {}) ? (selectedPkg as any).duration : 'Event'
    };
  };

  if (isLoadingProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading booking form...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Package Selection */}
            <div className="space-y-2">
              <Label>Select Package</Label>
              <Select onValueChange={onPackageSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a package" />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id}>
                      {pkg.name} - KSh {pkg.price.toLocaleString()}
                      {'duration' in pkg && ` (${pkg.duration})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.start ? format(selectedDates.start, 'PPP') : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDates.start || undefined}
                      onSelect={(date) => onDateSelect({ ...selectedDates, start: date || null })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDates.end ? format(selectedDates.end, 'PPP') : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDates.end || undefined}
                      onSelect={(date) => onDateSelect({ ...selectedDates, end: date || null })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Contact Information - Pre-filled and read-only */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  readOnly
                  className="bg-gray-50"
                  placeholder="Loading from your profile..."
                />
                <p className="text-xs text-muted-foreground">
                  This information is automatically filled from your profile
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  readOnly
                  className="bg-gray-50"
                  placeholder="Loading from your profile..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  readOnly
                  className="bg-gray-50"
                  placeholder="Loading from your profile..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, eventType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate Event</SelectItem>
                  <SelectItem value="birthday">Birthday Party</SelectItem>
                  <SelectItem value="conference">Conference</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {type === 'venue' && (
              <div className="space-y-2">
                <Label htmlFor="guestCount">Expected Number of Guests</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                value={formData.specialRequests}
                onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                placeholder="Any special requirements or requests..."
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Submit Booking Request
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PesapalPayment
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={calculateTotal()}
          bookingId={bookingId}
          bookingDetails={getBookingDetails()}
        />
      )}
    </>
  );
};

export default BookingForm;
