
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

interface VenueActiveFieldProps {
  form: UseFormReturn<any>;
}

const VenueActiveField: React.FC<VenueActiveFieldProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="is_active"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              Make venue active and available for booking
            </FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
};

export default VenueActiveField;
