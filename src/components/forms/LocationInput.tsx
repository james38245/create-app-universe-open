
import React, { useState, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface LocationInputProps {
  form: UseFormReturn<any>;
  fieldName?: string;
  label?: string;
  placeholder?: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ 
  form, 
  fieldName = 'location',
  label = 'Location',
  placeholder = 'Enter location or use GPS'
}) => {
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Your browser doesn't support geolocation",
        variant: "destructive"
      });
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });
        
        try {
          // Use reverse geocoding to get address from coordinates
          const response = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=demo&limit=1`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const address = data.results[0].formatted;
            form.setValue(fieldName, address);
            form.setValue('coordinates', { lat: latitude, lng: longitude });
            
            toast({
              title: "Location detected",
              description: "Your current location has been set"
            });
          } else {
            // Fallback to coordinates if reverse geocoding fails
            const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            form.setValue(fieldName, locationString);
            form.setValue('coordinates', { lat: latitude, lng: longitude });
            
            toast({
              title: "GPS coordinates set",
              description: "Location set using GPS coordinates"
            });
          }
        } catch (error) {
          // Fallback to coordinates if API fails
          const locationString = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
          form.setValue(fieldName, locationString);
          form.setValue('coordinates', { lat: latitude, lng: longitude });
          
          toast({
            title: "Location set",
            description: "GPS coordinates have been set"
          });
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        setIsLoadingLocation(false);
        let message = "Unable to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = "Location access denied. Please enable location permissions";
            break;
          case error.POSITION_UNAVAILABLE:
            message = "Location information unavailable";
            break;
          case error.TIMEOUT:
            message = "Location request timed out";
            break;
        }
        
        toast({
          title: "Location Error",
          description: message,
          variant: "destructive"
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  // Update coordinates when form value changes
  useEffect(() => {
    const currentCoords = form.getValues('coordinates');
    if (currentCoords) {
      setCoordinates(currentCoords);
    }
  }, [form]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input 
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  // Clear coordinates when manually typing unless it looks like coordinates
                  const value = e.target.value;
                  const isCoordinates = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/.test(value);
                  
                  if (!isCoordinates && coordinates) {
                    setCoordinates(null);
                    form.setValue('coordinates', null);
                  }
                }}
              />
            </FormControl>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={getCurrentLocation}
              disabled={isLoadingLocation}
              className="shrink-0"
              title="Get current location"
            >
              {isLoadingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
            </Button>
          </div>
          {coordinates && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-muted-foreground">
                📍 GPS: {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
              </p>
            </div>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default LocationInput;
