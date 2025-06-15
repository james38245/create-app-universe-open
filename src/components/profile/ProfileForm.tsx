
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Mail } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import LocationInput from '@/components/forms/LocationInput';
import { useForm } from 'react-hook-form';

interface ProfileFormData {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  coordinates?: { lat: number; lng: number } | null;
}

interface ProfileFormProps {
  profileData: {
    full_name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  } | null;
  isEditing: boolean;
  onSave: (data: any) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  isEditing,
  onSave
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<ProfileFormData>({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    coordinates: null
  });
  const [emailChanged, setEmailChanged] = useState(false);
  const [pendingEmailChange, setPendingEmailChange] = useState(false);

  const form = useForm({
    defaultValues: {
      location: '',
      coordinates: null
    }
  });

  useEffect(() => {
    if (profileData) {
      const newFormData: ProfileFormData = {
        full_name: profileData.full_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        location: profileData.location || '',
        bio: profileData.bio || '',
        coordinates: null
      };
      setFormData(newFormData);
      form.setValue('location', profileData.location || '');
    }
  }, [profileData, form]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if email was changed
    const originalEmail = profileData?.email || '';
    const newEmail = formData.email;
    const isEmailChanged = originalEmail !== newEmail;
    
    if (isEmailChanged) {
      // Handle email change with confirmation
      await handleEmailChange(newEmail);
    } else {
      // Save other profile data normally
      const dataToSave = { ...formData };
      delete dataToSave.email; // Don't update email through profile update
      
      // Include coordinates if available
      const coordinates = form.getValues('coordinates');
      if (coordinates) {
        dataToSave.coordinates = coordinates;
      }
      
      onSave(dataToSave);
    }
  };

  const handleEmailChange = async (newEmail: string) => {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase.auth.updateUser({
        email: newEmail
      });

      if (error) throw error;

      setPendingEmailChange(true);
      setEmailChanged(false);
      
      toast({
        title: "Email Change Initiated",
        description: "Please check both your old and new email addresses for confirmation links. Click the confirmation link to complete the email change.",
      });

      // Save other profile data (excluding email)
      const dataToSave = { ...formData };
      delete dataToSave.email;
      
      // Include coordinates if available
      const coordinates = form.getValues('coordinates');
      if (coordinates) {
        dataToSave.coordinates = coordinates;
      }
      
      onSave(dataToSave);
      
    } catch (error: any) {
      toast({
        title: "Email Change Failed",
        description: error.message || "Failed to initiate email change. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'email') {
      setEmailChanged(value !== (profileData?.email || ''));
      // Reset pending state when user starts typing a new email
      if (pendingEmailChange && value !== (profileData?.email || '')) {
        setPendingEmailChange(false);
      }
    }
  };

  const handleLocationChange = (location: string) => {
    setFormData(prev => ({ ...prev, location }));
    form.setValue('location', location);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleChange('full_name', e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isEditing}
              placeholder="Enter your email"
              className={emailChanged ? 'border-amber-500' : ''}
            />
            {emailChanged && (
              <Mail className="absolute right-3 top-3 h-4 w-4 text-amber-500" />
            )}
          </div>
          {emailChanged && isEditing && (
            <p className="text-sm text-amber-600">
              Changing your email will require confirmation via email verification.
            </p>
          )}
          {pendingEmailChange && (
            <p className="text-sm text-blue-600">
              Email change pending - please check your email for confirmation links.
            </p>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            disabled={!isEditing}
            placeholder="Enter your phone number"
          />
        </div>
        
        <div className="space-y-2">
          {isEditing ? (
            <LocationInput
              form={form}
              fieldName="location"
              label="Location"
              placeholder="Enter location or use GPS"
            />
          ) : (
            <>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                disabled={true}
                placeholder="Location not set"
              />
            </>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          disabled={!isEditing}
          rows={4}
          placeholder="Tell us about yourself..."
        />
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            {emailChanged ? 'Save & Request Email Change' : 'Save Changes'}
          </Button>
        </div>
      )}
    </form>
  );
};

export default ProfileForm;
