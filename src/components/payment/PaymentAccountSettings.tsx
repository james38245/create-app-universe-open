
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, CreditCard } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const paymentAccountSchema = z.object({
  payment_account_type: z.enum(['mpesa', 'till', 'paybill', 'pochi'], {
    required_error: 'Please select a payment method'
  }),
  payment_account_number: z.string().min(1, 'Account number is required'),
  payment_account_name: z.string().min(1, 'Account name is required')
});

type PaymentAccountFormData = z.infer<typeof paymentAccountSchema>;

interface PaymentAccountSettingsProps {
  initialData?: {
    payment_account_type?: string;
    payment_account_number?: string;
    payment_account_name?: string;
  };
  onSave?: () => void;
}

const PaymentAccountSettings: React.FC<PaymentAccountSettingsProps> = ({ 
  initialData, 
  onSave 
}) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<PaymentAccountFormData>({
    resolver: zodResolver(paymentAccountSchema),
    defaultValues: {
      payment_account_type: initialData?.payment_account_type as any || undefined,
      payment_account_number: initialData?.payment_account_number || '',
      payment_account_name: initialData?.payment_account_name || ''
    }
  });

  const onSubmit = async (data: PaymentAccountFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          payment_account_type: data.payment_account_type,
          payment_account_number: data.payment_account_number,
          payment_account_name: data.payment_account_name
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Payment account updated",
        description: "Your payment information has been saved successfully."
      });

      onSave?.();
    } catch (error) {
      console.error('Error updating payment account:', error);
      toast({
        title: "Error",
        description: "Failed to update payment account",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasPaymentAccount = initialData?.payment_account_type && 
                          initialData?.payment_account_number && 
                          initialData?.payment_account_name;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Account Settings
          </CardTitle>
          {hasPaymentAccount ? (
            <Badge variant="default" className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertCircle className="h-3 w-3 mr-1" />
              Required
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="payment_account_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payment Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="mpesa">M-Pesa (Send Money)</SelectItem>
                      <SelectItem value="till">M-Pesa Till Number</SelectItem>
                      <SelectItem value="paybill">M-Pesa Paybill</SelectItem>
                      <SelectItem value="pochi">Pochi la Biashara</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_account_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {form.watch('payment_account_type') === 'mpesa' && 'M-Pesa Number'}
                    {form.watch('payment_account_type') === 'till' && 'Till Number'}
                    {form.watch('payment_account_type') === 'paybill' && 'Paybill Number'}
                    {form.watch('payment_account_type') === 'pochi' && 'Pochi Number'}
                    {!form.watch('payment_account_type') && 'Account Number'}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter account details" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="payment_account_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name on account" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <strong>Important:</strong> Ensure your payment details are accurate. 
                All payouts will be sent to this account after the refund period expires.
              </p>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving...' : 'Save Payment Details'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentAccountSettings;
