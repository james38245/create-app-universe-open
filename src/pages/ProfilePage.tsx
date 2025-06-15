
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import DocumentsTab from '@/components/documents/DocumentsTab';
import { Loader2, User, FileText } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profileData, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Check if user is a service provider
  const { data: isServiceProvider } = useQuery({
    queryKey: ['is-service-provider', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('service_providers')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!user
  });

  // Get tab from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const defaultTab = urlParams.get('tab') || 'profile';

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
            
            <Tabs defaultValue={defaultTab} className="mt-6">
              <TabsList className={`grid w-full ${isServiceProvider ? 'grid-cols-2' : 'grid-cols-1'}`}>
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </TabsTrigger>
                {isServiceProvider && (
                  <TabsTrigger value="documents" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Documents
                  </TabsTrigger>
                )}
              </TabsList>
              
              <TabsContent value="profile" className="mt-6">
                <ProfileForm
                  profileData={profileData}
                  isEditing={isEditing}
                  onSave={handleSave}
                />
              </TabsContent>
              
              {isServiceProvider && (
                <TabsContent value="documents" className="mt-6">
                  <DocumentsTab />
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
