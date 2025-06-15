
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import LocationInput from './LocationInput';

interface BasicVenueFieldsProps {
  form: UseFormReturn<any>;
}

const BasicVenueFields: React.FC<BasicVenueFieldsProps> = ({ form }) => {
  const venueTypes = [
    'Hotel', 'Conference Center', 'Restaurant', 'Club', 'Hall', 
    'Garden', 'Beach Resort', 'Community Center', 'Church', 'School'
  ];

  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Venue Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter venue name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Describe your venue, its features and what makes it special"
                className="min-h-[100px]"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LocationInput 
          form={form}
          fieldName="location"
          label="Location"
          placeholder="Enter location or use GPS"
        />

        <FormField
          control={form.control}
          name="venue_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Venue Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select venue type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {venueTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default BasicVenueFields;
