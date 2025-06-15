
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ServiceProviderPricingFieldsProps {
  form: UseFormReturn<any>;
}

const ServiceProviderPricingFields: React.FC<ServiceProviderPricingFieldsProps> = ({ form }) => {
  const selectedPricingUnit = form.watch('pricing_unit');

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold">Pricing Configuration</h3>
      
      <FormField
        control={form.control}
        name="pricing_unit"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Pricing Unit</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select pricing unit" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="event">Per Event</SelectItem>
                <SelectItem value="hour">Per Hour</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedPricingUnit === 'event' && (
        <FormField
          control={form.control}
          name="price_per_event"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Event (KSh)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="25000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {selectedPricingUnit === 'hour' && (
        <FormField
          control={form.control}
          name="price_per_hour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Hour (KSh)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="5000"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ServiceProviderPricingFields;
