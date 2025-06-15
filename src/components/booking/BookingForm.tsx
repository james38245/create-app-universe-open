
import React from 'react';
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
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    guestCount: '',
    specialRequests: ''
  });

  const packages = type === 'venue' ? [
    { id: 'half-day', name: 'Half Day', duration: '4 hours', price: 75000 },
    { id: 'full-day', name: 'Full Day', duration: '8 hours', price: 150000 },
    { id: 'weekend', name: 'Weekend Package', duration: '2 days', price: 280000 }
  ] : [
    { id: 'basic', name: 'Basic Package', price: 25000 },
    { id: 'premium', name: 'Premium Package', price: 45000 },
    { id: 'deluxe', name: 'Deluxe Package', price: 75000 }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      selectedPackage,
      selectedDates,
      type
    });
  };

  return (
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

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
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
  );
};

export default BookingForm;
