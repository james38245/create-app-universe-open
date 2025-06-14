
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface ProfileFormProps {
  profileData: {
    name: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  isEditing: boolean;
  onProfileChange: (data: any) => void;
  onSave: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  profileData,
  isEditing,
  onProfileChange,
  onSave
}) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={profileData.name}
            onChange={(e) => onProfileChange({...profileData, name: e.target.value})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => onProfileChange({...profileData, email: e.target.value})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => onProfileChange({...profileData, phone: e.target.value})}
            disabled={!isEditing}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={profileData.location}
            onChange={(e) => onProfileChange({...profileData, location: e.target.value})}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profileData.bio}
          onChange={(e) => onProfileChange({...profileData, bio: e.target.value})}
          disabled={!isEditing}
          rows={4}
        />
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={onSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      )}
    </>
  );
};

export default ProfileForm;
