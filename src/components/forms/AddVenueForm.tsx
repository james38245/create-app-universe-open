
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, X, Image } from 'lucide-react';

const venueSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.string().min(2, 'Location is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1'),
  price_per_day: z.number().min(1, 'Price must be greater than 0'),
  venue_type: z.string().min(1, 'Venue type is required'),
  amenities: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  is_active: z.boolean().default(true)
});

type VenueFormData = z.infer<typeof venueSchema>;

interface AddVenueFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddVenueForm: React.FC<AddVenueFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      name: '',
      description: '',
      location: '',
      capacity: 50,
      price_per_day: 10000,
      venue_type: '',
      amenities: [],
      images: [],
      is_active: true
    }
  });

  const amenitiesList = [
    'Parking', 'WiFi', 'Air Conditioning', 'Sound System', 'Projector', 
    'Catering Kitchen', 'Bar', 'Dance Floor', 'Garden/Outdoor Space', 
    'Security', 'Wheelchair Accessible', 'Restrooms'
  ];

  const venueTypes = [
    'Hotel', 'Conference Center', 'Restaurant', 'Club', 'Hall', 
    'Garden', 'Beach Resort', 'Community Center', 'Church', 'School'
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || !user) return;

    setIsUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from('venue-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('venue-images')
          .getPublicUrl(data.path);

        newImageUrls.push(publicUrl);
      }

      const updatedImages = [...uploadedImages, ...newImageUrls];
      setUploadedImages(updatedImages);
      form.setValue('images', updatedImages);

      toast({
        title: "Success",
        description: `${newImageUrls.length} image(s) uploaded successfully!`
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Error",
        description: "Failed to upload images",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const updatedImages = uploadedImages.filter((_, index) => index !== indexToRemove);
    setUploadedImages(updatedImages);
    form.setValue('images', updatedImages);
  };

  const onSubmit = async (data: VenueFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const venueData = {
        name: data.name,
        description: data.description,
        location: data.location,
        capacity: data.capacity,
        price_per_day: data.price_per_day,
        venue_type: data.venue_type,
        amenities: data.amenities || [],
        images: uploadedImages,
        is_active: data.is_active,
        owner_id: user.id
      };

      const { error } = await supabase
        .from('venues')
        .insert(venueData);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Venue added successfully!"
      });

      queryClient.invalidateQueries({ queryKey: ['my-venues'] });
      onSuccess();
    } catch (error) {
      console.error('Error adding venue:', error);
      toast({
        title: "Error",
        description: "Failed to add venue",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New Venue</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="City, Area" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>

            {/* Image Upload Section */}
            <FormItem>
              <FormLabel>Venue Images</FormLabel>
              <div className="space-y-4">
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-4 text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> venue images
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10MB)</p>
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                </div>

                {isUploading && (
                  <div className="flex items-center justify-center">
                    <div className="text-sm text-gray-600">Uploading images...</div>
                  </div>
                )}

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Venue image ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </FormItem>

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

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="flex-1"
              >
                {isSubmitting ? 'Adding...' : 'Add Venue'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddVenueForm;
