
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface VenueAmenitiesFieldProps {
  form: UseFormReturn<any>;
}

const VenueAmenitiesField: React.FC<VenueAmenitiesFieldProps> = ({ form }) => {
  const amenitiesList = [
    'Parking', 'WiFi', 'Air Conditioning', 'Sound System', 'Projector', 
    'Catering Kitchen', 'Bar', 'Dance Floor', 'Garden/Outdoor Space', 
    'Security', 'Wheelchair Accessible', 'Restrooms'
  ];

  return (
    <FormField
      control={form.control}
      name="amenities"
      render={() => (
        <FormItem>
          <FormLabel>Amenities</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenitiesList.map((amenity) => (
              <FormField
                key={amenity}
                control={form.control}
                name="amenities"
                render={({ field }) => {
                  return (
                    <FormItem
                      key={amenity}
                      className="flex flex-row items-start space-x-3 space-y-0"
                    >
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(amenity)}
                          onCheckedChange={(checked) => {
                            const current = field.value || [];
                            if (checked) {
                              field.onChange([...current, amenity]);
                            } else {
                              field.onChange(current.filter(item => item !== amenity));
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal">
                        {amenity}
                      </FormLabel>
                    </FormItem>
                  );
                }}
              />
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default VenueAmenitiesField;
