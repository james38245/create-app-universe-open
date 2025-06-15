
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  location: string;
  bio: string;
  avatar_url: string;
  user_type: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      // Use the latest email from auth.user if available, fallback to profile email
      const updatedData = {
        ...data,
        email: user.email || data.email
      };

      setProfileData(updatedData);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error loading profile",
        description: "Failed to load your profile data.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<ProfileData>) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      // Update local state immediately
      setProfileData(prev => prev ? { ...prev, ...updates } : null);
      
      // Broadcast the update to other components
      window.dispatchEvent(new CustomEvent('profileUpdated', { 
        detail: { ...profileData, ...updates } 
      }));
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      return true;
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  // Listen for auth state changes to refresh profile when email is confirmed
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'USER_UPDATED' && session?.user) {
          // Refresh profile data when user is updated (e.g., email confirmed)
          await fetchProfile();
          
          toast({
            title: "Email Updated",
            description: "Your email has been successfully updated.",
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Listen for profile updates from other components
  useEffect(() => {
    const handleProfileUpdate = (event: CustomEvent) => {
      setProfileData(event.detail);
    };

    window.addEventListener('profileUpdated', handleProfileUpdate as EventListener);
    
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  return {
    profileData,
    loading,
    updateProfile,
    refreshProfile: fetchProfile
  };
};
