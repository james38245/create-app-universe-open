
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import { Loader2 } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profileData, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async (data: any) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleImageUpdate = async (imageUrl: string) => {
    await updateProfile({ avatar_url: imageUrl });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileHeader
              profileData={profileData}
              isEditing={isEditing}
              onEditToggle={handleEditToggle}
              onImageUpdate={handleImageUpdate}
            />
            
            <ProfileForm
              profileData={profileData}
              isEditing={isEditing}
              onSave={handleSave}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
