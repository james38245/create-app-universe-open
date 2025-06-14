
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

const serviceProviderSchema = z.object({
  service_category: z.string().min(1, 'Service category is required'),
  specialties: z.array(z.string()).min(1, 'At least one specialty is required'),
  price_per_event: z.number().min(1, 'Price must be greater than 0'),
  bio: z.string().min(20, 'Bio must be at least 20 characters'),
  years_experience: z.number().min(0, 'Experience cannot be negative'),
  certifications: z.array(z.string()).optional(),
  response_time_hours: z.number().min(1, 'Response time must be at least 1 hour'),
  is_available: z.boolean().default(true)
});

type ServiceProviderFormData = z.infer<typeof serviceProviderSchema>;

interface AddServiceProviderFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const AddServiceProviderForm: React.FC<AddServiceProviderFormProps> = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ServiceProviderFormData>({
    resolver: zodResolver(serviceProviderSchema),
    defaultValues: {
      service_category: '',
      specialties: [],
      price_per_event: 25000,
      bio: '',
      years_experience: 1,
      certifications: [],
      response_time_hours: 24,
      is_available: true
    }
  });

  const serviceCategories = [
    'Photography', 'Event Planning', 'Music & DJ', 'Catering', 'Decoration',
    'Security', 'Transportation', 'Floral Design', 'Entertainment', 'Videography',
    'Sound & Lighting', 'Wedding Planning', 'Corporate Events', 'MC/Host'
  ];

  const specialtiesByCategory: Record<string, string[]> = {
    'Photography': ['Wedding', 'Portrait', 'Corporate', 'Fashion', 'Product', 'Event'],
    'Event Planning': ['Weddings', 'Corporate Events', 'Birthday Parties', 'Conferences', 'Product Launches'],
    'Music & DJ': ['Wedding DJ', 'Club DJ', 'Corporate Events', 'Live Band', 'Sound System'],
    'Catering': ['Wedding Catering', 'Corporate Catering', 'Buffet', 'Fine Dining', 'Outdoor Events'],
    'Decoration': ['Wedding Decor', 'Corporate Decor', 'Birthday Decor', 'Floral Arrangements', 'Lighting'],
    'Security': ['Event Security', 'VIP Protection', 'Crowd Control', 'Access Control'],
    'Transportation': ['Wedding Cars', 'Buses', 'VIP Transport', 'Airport Transfers'],
    'Floral Design': ['Wedding Bouquets', 'Centerpieces', 'Ceremony Decor', 'Corporate Arrangements'],
    'Entertainment': ['Live Music', 'Dance Performances', 'Comedy', 'Magic Shows', 'Cultural Shows'],
    'Videography': ['Wedding Videos', 'Corporate Videos', 'Event Documentation', 'Live Streaming'],
    'Sound & Lighting': ['Sound Systems', 'Stage Lighting', 'LED Screens', 'AV Equipment'],
    'Wedding Planning': ['Full Planning', 'Day Coordination', 'Destination Weddings', 'Traditional Ceremonies'],
    'Corporate Events': ['Conferences', 'Team Building', 'Product Launches', 'Seminars'],
    'MC/Host': ['Wedding MC', 'Corporate Host', 'Event Announcer', 'Bilingual MC']
  };

  const selectedCategory = form.watch('service_category');
  const availableSpecialties = selectedCategory ? specialtiesByCategory[selectedCategory] || [] : [];

  const onSubmit = async (data: ServiceProviderFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('service_providers')
        .insert({
          ...data,
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Service provider profile created successfully!"
      });

      queryClient.invalidateQueries({ queryKey: ['my-service-providers'] });
      onSuccess();
    } catch (error) {
      console.error('Error adding service provider:', error);
      toast({
        title: "Error",
        description: "Failed to create service provider profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create Service Provider Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="service_category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select onValueChange={(value) => {
                    field.onChange(value);
                    form.setValue('specialties', []);
                  }} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your service category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {availableSpecialties.length > 0 && (
              <FormField
                control={form.control}
                name="specialties"
                render={() => (
                  <FormItem>
                    <FormLabel>Specialties (Select at least one)</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {availableSpecialties.map((specialty) => (
                        <FormField
                          key={specialty}
                          control={form.control}
                          name="specialties"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={specialty}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(specialty)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || [];
                                      if (checked) {
                                        field.onChange([...current, specialty]);
                                      } else {
                                        field.onChange(current.filter(item => item !== specialty));
                                      }
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {specialty}
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
            )}

            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell clients about your experience, expertise, and what makes your service special"
                      className="min-h-[120px]"
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
                name="years_experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="5"
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
            </div>

            <FormField
              control={form.control}
              name="response_time_hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Response Time (Hours)</FormLabel>
                  <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="How quickly do you respond?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">Within 1 hour</SelectItem>
                      <SelectItem value="6">Within 6 hours</SelectItem>
                      <SelectItem value="12">Within 12 hours</SelectItem>
                      <SelectItem value="24">Within 24 hours</SelectItem>
                      <SelectItem value="48">Within 48 hours</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_available"
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
                      Available for new bookings
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
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AddServiceProviderForm;
