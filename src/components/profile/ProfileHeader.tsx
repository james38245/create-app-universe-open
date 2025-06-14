
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Upload, Edit, X } from 'lucide-react';

interface ProfileHeaderProps {
  profileData: {
    name: string;
    profileImage: string;
  };
  isEditing: boolean;
  onEditToggle: () => void;
  onFileUpload: (type: 'profile') => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  isEditing,
  onEditToggle,
  onFileUpload
}) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={profileData.profileImage} alt={profileData.name} />
          <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
        </Avatar>
        
        {isEditing && (
          <Button 
            variant="outline" 
            onClick={() => onFileUpload('profile')}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Upload Photo
          </Button>
        )}
      </div>

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
