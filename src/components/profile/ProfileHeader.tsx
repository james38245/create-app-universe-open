
import React from 'react';
import { Button } from '@/components/ui/button';
import { Edit, X } from 'lucide-react';
import ProfileImageUpload from './ProfileImageUpload';

interface ProfileHeaderProps {
  profileData: {
    full_name: string;
    avatar_url: string;
  } | null;
  isEditing: boolean;
  onEditToggle: () => void;
  onImageUpdate: (imageUrl: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  isEditing,
  onEditToggle,
  onImageUpdate
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <ProfileImageUpload
        profileImage={profileData?.avatar_url || '/placeholder.svg'}
        userName={profileData?.full_name || 'User'}
        isEditing={isEditing}
        onImageUpdate={onImageUpdate}
      />

      <Button
        variant={isEditing ? "destructive" : "outline"}
        size="sm"
        onClick={onEditToggle}
      >
        {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
        {isEditing ? 'Cancel' : 'Edit'}
      </Button>
    </div>
  );
};

export default ProfileHeader;
