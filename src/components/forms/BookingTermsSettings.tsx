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

  // Set default values based on payment type
  React.useEffect(() => {
    if (paymentType) {
      const currentTerms = form.getValues('booking_terms') || {};
      
      let updatedTerms = {
        ...currentTerms,
        payment_type: paymentType,
        payment_structure: getPaymentStructureDefaults(paymentType),
        // Keep common fields
        advance_booking_days: currentTerms.advance_booking_days || 2,
        minimum_booking_duration: currentTerms.minimum_booking_duration || 4,
        minimum_booking_unit: currentTerms.minimum_booking_unit || 'hours',
        platform_commission_percentage: 10, // Fixed by platform
        // Cancellation and refund policies
        cancellation_policy: getCancellationPolicyDefaults(paymentType),
        late_payment_policy: getLatePaymentPolicyDefaults(),
        legal_compliance: getLegalComplianceDefaults(),
        special_terms: currentTerms.special_terms || ''
      };

      form.setValue('booking_terms', updatedTerms);
    }
  }, [paymentType, form]);

  const getPaymentStructureDefaults = (type: string) => {
    switch (type) {
      case 'deposit_only':
        return {
          type: 'deposit_balance',
          deposit_percentage: 30,
          deposit_due: 'on_booking',
          balance_due_days: 7,
          balance_due_timing: 'before_event',
          payment_schedule: [
            {
              stage: 'booking_confirmation',
              percentage: 30,
              description: 'Booking deposit'
            },
            {
              stage: 'final_payment',
              percentage: 70,
              description: 'Balance payment',
              due_days_before: 7
            }
          ]
        };
      
      case 'full_payment':
        return {
          type: 'full_upfront',
          payment_timing: 'on_booking',
          payment_schedule: [
            {
              stage: 'booking_confirmation',
              percentage: 100,
              description: 'Full payment on booking'
            }
          ]
        };
      
      case 'installments':
        return {
          type: 'installment_plan',
          first_payment_percentage: 25,
          installment_count: 3,
          installment_interval_days: 30,
          final_payment_days_before: 7,
          payment_schedule: [
            {
              stage: 'booking_confirmation',
              percentage: 25,
              description: 'First installment'
            },
            {
              stage: 'installment_2',
              percentage: 35,
              description: 'Second installment',
              due_days_after_booking: 30
            },
            {
              stage: 'final_payment',
              percentage: 40,
              description: 'Final installment',
              due_days_before: 7
            }
          ]
        };
      
      default:
        return {};
    }
  };

  const getCancellationPolicyDefaults = (type: string) => {
    const basePolicy = {
      cancellation_time_value: 48,
      cancellation_time_unit: 'hours',
      refund_percentage: 100,
      transaction_fee_deduction: 3,
      processing_fee_amount: 500
    };

    switch (type) {
      case 'full_payment':
        return {
          ...basePolicy,
          refund_percentage: 90, // Lower refund for full payment
          cancellation_time_value: 72, // Longer notice required
        };
      
      case 'installments':
        return {
          ...basePolicy,
          refund_percentage: 85, // Lowest refund for installments
          processing_fee_amount: 1000, // Higher processing fee
        };
      
      default:
        return basePolicy;
    }
  };

  const getLatePaymentPolicyDefaults = () => {
    return {
      grace_period_value: 24,
      grace_period_unit: 'hours',
      late_payment_daily_rate: 2,
      maximum_late_fee_percentage: 25,
      compounding: false,
      enforcement: 'automatic'
    };
  };

  const getLegalComplianceDefaults = () => {
    return {
      agree_to_platform_terms: false,
      agree_to_legal_compliance: false,
      agree_to_service_delivery: false,
      terms_version: '1.0',
      accepted_at: null
    };
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Booking Terms & Payment Structure</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Payment Type Selection */}
        <FormField
          control={form.control}
          name="booking_terms.payment_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Structure Type</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value || "deposit_only"}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="deposit_only" id="deposit_only" />
                    <div>
                      <label htmlFor="deposit_only" className="text-sm font-medium cursor-pointer">
                        Deposit + Balance
                      </label>
                      <p className="text-xs text-muted-foreground">
                        30% deposit, 70% before event
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="full_payment" id="full_payment" />
                    <div>
                      <label htmlFor="full_payment" className="text-sm font-medium cursor-pointer">
                        Full Payment
                      </label>
                      <p className="text-xs text-muted-foreground">
                        100% payment on booking
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 border rounded-lg p-4">
                    <RadioGroupItem value="installments" id="installments" />
                    <div>
                      <label htmlFor="installments" className="text-sm font-medium cursor-pointer">
                        Installment Plan
                      </label>
                      <p className="text-xs text-muted-foreground">
                        3 payments over time
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Payment Structure Details */}
        {paymentType === 'deposit_only' && (
          <Card className="border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Deposit + Balance Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="booking_terms.payment_structure.deposit_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deposit Percentage (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30"
                          min="10"
                          max="50"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                        />
                      </FormControl>
                      <FormDescription>Percentage required as booking deposit</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_terms.payment_structure.balance_due_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Balance Due (Days Before Event)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="7"
                          min="1"
                          max="30"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 7)}
                        />
                      </FormControl>
                      <FormDescription>When remaining 70% is due</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Alert>
                <AlertDescription>
                  Clients pay {form.watch('booking_terms.payment_structure.deposit_percentage') || 30}% deposit on booking, 
                  then {100 - (form.watch('booking_terms.payment_structure.deposit_percentage') || 30)}% balance 
                  {form.watch('booking_terms.payment_structure.balance_due_days') || 7} days before the event.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {paymentType === 'full_payment' && (
          <Card className="border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Full Payment Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertDescription>
                  Clients pay 100% of the booking amount immediately upon confirmation. 
                  This provides immediate cash flow but may reduce booking conversions.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {paymentType === 'installments' && (
          <Card className="border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Installment Plan Structure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="booking_terms.payment_structure.first_payment_percentage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Payment (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="25"
                          min="20"
                          max="40"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 25)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_terms.payment_structure.installment_count"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Installments</FormLabel>
                      <FormControl>
                        <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="3" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2">2 Payments</SelectItem>
                            <SelectItem value="3">3 Payments</SelectItem>
                            <SelectItem value="4">4 Payments</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="booking_terms.payment_structure.installment_interval_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Days Between Payments</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="30"
                          min="14"
                          max="60"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 30)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Alert>
                <AlertDescription>
                  Payment schedule: {form.watch('booking_terms.payment_structure.first_payment_percentage') || 25}% on booking, 
                  then {Math.floor((100 - (form.watch('booking_terms.payment_structure.first_payment_percentage') || 25)) / 
                  ((form.watch('booking_terms.payment_structure.installment_count') || 3) - 1))}% every{' '}
                  {form.watch('booking_terms.payment_structure.installment_interval_days') || 30} days.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}

        {/* Common Booking Settings */}
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
                    onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                  />
                </FormControl>
                <FormDescription>Minimum days required to book in advance</FormDescription>
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
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 4)}
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
            <FormDescription>Minimum duration for a booking</FormDescription>
          </div>
        </div>

        {/* Cancellation Policy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Cancellation & Refund Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="booking_terms.cancellation_policy.cancellation_time_value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notice Period</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="48"
                        min="1"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 48)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="booking_terms.cancellation_policy.cancellation_time_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Unit</FormLabel>
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

              <FormField
                control={form.control}
                name="booking_terms.cancellation_policy.refund_percentage"
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
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 100)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Late Payment Policy */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Late Payment Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                All late payment penalties are automatically enforced and legally binding.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="booking_terms.late_payment_policy.late_payment_daily_rate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Daily Late Fee (%)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="2"
                        min="0"
                        max="5"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 2)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="booking_terms.late_payment_policy.maximum_late_fee_percentage"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Legal Compliance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Legal Compliance & Platform Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="booking_terms.platform_commission_percentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Commission (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      value={10}
                      readOnly
                      className="bg-gray-100 cursor-not-allowed"
                    />
                  </FormControl>
                  <FormDescription>Fixed platform commission (set by admin)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <FormField
                control={form.control}
                name="booking_terms.legal_compliance.agree_to_platform_terms"
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
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="booking_terms.legal_compliance.agree_to_legal_compliance"
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
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="booking_terms.legal_compliance.agree_to_service_delivery"
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
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

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
