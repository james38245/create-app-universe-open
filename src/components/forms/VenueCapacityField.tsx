
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface VenueCapacityFieldProps {
  form: UseFormReturn<any>;
}

const VenueCapacityField: React.FC<VenueCapacityFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="capacity"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Capacity (Number of Guests)</FormLabel>
          <FormControl>
            <Input 
              type="number" 
              placeholder="50"
              {...field}
              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VenueCapacityField;
