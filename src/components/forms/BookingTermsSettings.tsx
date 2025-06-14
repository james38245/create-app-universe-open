
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface BookingTermsSettingsProps {
  form: UseFormReturn<any>;
}

const BookingTermsSettings: React.FC<BookingTermsSettingsProps> = ({ form }) => {
  const paymentType = form.watch('booking_terms.payment_type');
  const cancellationTimeUnit = form.watch('booking_terms.cancellation_time_unit');

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

          <div className="space-y-2">
            <FormLabel>Minimum Booking Duration</FormLabel>
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="booking_terms.minimum_booking_duration"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="4"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="booking_terms.minimum_booking_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} defaultValue={field.value || "hours"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hours">Hours</SelectItem>
                          <SelectItem value="days">Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormDescription>
              Minimum duration for a booking
            </FormDescription>
          </div>
        </div>

        {/* Enhanced Cancellation Policy */}
        <div className="space-y-4">
          <FormLabel className="text-base font-semibold">Cancellation & Refund Policy</FormLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="booking_terms.cancellation_time_value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cancellation Notice Period</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="48"
                      min="1"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.cancellation_time_unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time Unit</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value || "hours"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hours">Hours</SelectItem>
                        <SelectItem value="days">Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.refund_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Refund Percentage (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100"
                      min="0"
                      max="100"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Refund Deductions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="booking_terms.transaction_fee_deduction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction Fee Deduction (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="3"
                      min="0"
                      max="10"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Percentage deducted from refund for transaction fees
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.processing_fee_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Processing Fee (Fixed Amount KSh)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="500"
                      min="0"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormDescription>
                    Fixed amount deducted from refund for processing
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Enhanced Late Payment Policy */}
        <div className="space-y-4">
          <FormLabel className="text-base font-semibold">Late Payment Penalties (Mandatory)</FormLabel>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              All late payment penalties are chargeable without exception. Non-compliance may result in legal action.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="booking_terms.late_payment_daily_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Daily Late Fee (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2"
                      min="0"
                      max="10"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                    />
                  </FormControl>
                  <FormDescription>
                    Daily percentage charged for late payments
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.maximum_late_fee_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Late Fee Cap (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="25"
                      min="0"
                      max="50"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 25)}
                    />
                  </FormControl>
                  <FormDescription>
                    Maximum total late fee as percentage of booking amount
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="booking_terms.grace_period_hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grace Period (Hours)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="24"
                    min="0"
                    max="72"
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 24)}
                  />
                </FormControl>
                <FormDescription>
                  Hours after due date before late fees apply
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Platform Terms & Legal Compliance */}
        <div className="space-y-4">
          <FormLabel className="text-base font-semibold">Platform Terms & Legal Compliance</FormLabel>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="booking_terms.platform_commission_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Commission (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="10"
                      min="5"
                      max="20"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                    />
                  </FormControl>
                  <FormDescription>
                    Platform commission on successful bookings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.dispute_resolution_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dispute Resolution Fee (KSh)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="2000"
                      min="500"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value) || 2000)}
                    />
                  </FormControl>
                  <FormDescription>
                    Fee charged for dispute resolution services
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Mandatory Seller Agreements */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="booking_terms.agree_to_platform_terms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      I agree to platform terms and commission structure
                    </FormLabel>
                    <FormDescription>
                      Mandatory agreement to platform terms of service
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.agree_to_legal_compliance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      I agree to legal compliance and fraud liability
                    </FormLabel>
                    <FormDescription>
                      Any fraudulent activity is chargeable by law
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="booking_terms.agree_to_service_delivery"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-medium">
                      I guarantee service delivery and integrity
                    </FormLabel>
                    <FormDescription>
                      Commitment to deliver services as promised
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Special Terms */}
        <FormField
          control={form.control}
          name="booking_terms.special_terms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Terms & Conditions</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Any additional terms, restrictions, or special conditions..."
                  className="min-h-[100px]"
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
