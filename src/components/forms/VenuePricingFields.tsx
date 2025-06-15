
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface VenuePricingFieldsProps {
  form: UseFormReturn<any>;
}

const VenuePricingFields: React.FC<VenuePricingFieldsProps> = ({ form }) => {
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
                <SelectItem value="day">Per Day</SelectItem>
                <SelectItem value="hour">Per Hour</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {selectedPricingUnit === 'day' && (
        <FormField
          control={form.control}
          name="price_per_day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price per Day (KSh)</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="10000"
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
                  placeholder="2000"
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

export default VenuePricingFields;
