
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BookingTermsSettingsProps {
  form: UseFormReturn<any>;
}

const BookingTermsSettings: React.FC<BookingTermsSettingsProps> = ({ form }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="booking_terms.deposit_percentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit Required (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="30"
                    min="0"
                    max="100"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormDescription>
                  Percentage of total amount required as deposit
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="booking_terms.payment_due_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Payment Due (Days Before)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="7"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>
                  Days before event when full payment is due
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="booking_terms.advance_booking_days"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Advance Booking (Days)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="2"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>
                  Minimum days required to book in advance
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="booking_terms.minimum_booking_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Booking Duration (Hours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="4"
                    min="1"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                  />
                </FormControl>
                <FormDescription>
                  Minimum hours for a booking
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="booking_terms.cancellation_policy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cancellation Policy</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cancellation policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Full refund if cancelled 7 days before event">
                    Full refund - 7 days notice
                  </SelectItem>
                  <SelectItem value="Full refund if cancelled 48 hours before event">
                    Full refund - 48 hours notice
                  </SelectItem>
                  <SelectItem value="50% refund if cancelled 24 hours before event">
                    50% refund - 24 hours notice
                  </SelectItem>
                  <SelectItem value="No refund for cancellations">
                    No refund policy
                  </SelectItem>
                  <SelectItem value="Custom policy - see special terms">
                    Custom policy
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="booking_terms.special_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Special Terms & Conditions (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional terms, restrictions, or special conditions..."
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Additional terms that clients should be aware of
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default BookingTermsSettings;
