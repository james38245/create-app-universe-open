
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BookingTermsSettingsProps {
  form: UseFormReturn<any>;
}

const BookingTermsSettings: React.FC<BookingTermsSettingsProps> = ({ form }) => {
  const paymentType = form.watch('booking_terms.payment_type');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Terms & Conditions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Type Selection */}
        <FormField
          control={form.control}
          name="booking_terms.payment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Structure</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value || "deposit_only"}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value="deposit_only" id="deposit_only" />
                    <div>
                      <label htmlFor="deposit_only" className="text-sm font-medium cursor-pointer">
                        Deposit + Balance
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Require deposit upfront, balance later
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value="full_payment" id="full_payment" />
                    <div>
                      <label htmlFor="full_payment" className="text-sm font-medium cursor-pointer">
                        Full Payment
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Require 100% payment upfront
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-3">
                    <RadioGroupItem value="installments" id="installments" />
                    <div>
                      <label htmlFor="installments" className="text-sm font-medium cursor-pointer">
                        Installments
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Multiple payment installments
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Deposit Settings - Show only for deposit_only and installments */}
        {(paymentType === 'deposit_only' || paymentType === 'installments') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="booking_terms.deposit_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {paymentType === 'installments' ? 'First Payment (%)' : 'Deposit Required (%)'}
                  </FormLabel>
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
                    {paymentType === 'installments' 
                      ? 'Percentage for first installment'
                      : 'Percentage of total amount required as deposit'
                    }
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
                  <FormLabel>
                    {paymentType === 'installments' ? 'Final Payment Due (Days Before)' : 'Full Payment Due (Days Before)'}
                  </FormLabel>
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
                    Days before event when remaining amount is due
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Installment-specific settings */}
        {paymentType === 'installments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="booking_terms.installment_count"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Installments</FormLabel>
                  <FormControl>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select installments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 Installments</SelectItem>
                        <SelectItem value="3">3 Installments</SelectItem>
                        <SelectItem value="4">4 Installments</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>
                    Total number of payment installments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.installment_interval_days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Days Between Installments</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="30"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                    />
                  </FormControl>
                  <FormDescription>
                    Days between each installment payment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Common booking settings */}
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

        {/* Cancellation Policy */}
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
                  <SelectItem value="Deposit non-refundable, balance refunded if cancelled 48 hours before">
                    Deposit non-refundable
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

        {/* Late Payment Policy */}
        <FormField
          control={form.control}
          name="booking_terms.late_payment_policy"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Late Payment Policy (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select late payment policy" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="no_policy">No specific policy</SelectItem>
                  <SelectItem value="Booking cancelled if payment late">
                    Cancel booking if payment late
                  </SelectItem>
                  <SelectItem value="5% late fee per day">
                    5% late fee per day
                  </SelectItem>
                  <SelectItem value="10% late fee after 3 days">
                    10% late fee after 3 days
                  </SelectItem>
                  <SelectItem value="Flat 500 KSh late fee">
                    Flat 500 KSh late fee
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Policy for handling late payments
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Special Terms */}
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
