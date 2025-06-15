
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Star, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface GoodStartUser {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  location: string;
  phone?: string;
}

interface GoodStartFeatureProps {
  onStartConversation: (userId: string, userName: string, userRole: string, phoneNumber?: string) => Promise<void>;
}

const GoodStartFeature: React.FC<GoodStartFeatureProps> = ({ onStartConversation }) => {
  const [suggestedUsers, setSuggestedUsers] = useState<GoodStartUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    try {
      setLoading(true);
      
      // Load venue owners
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select(`
          owner_id,
          name,
          location,
          rating,
          profiles:profiles!venues_owner_id_fkey(id, full_name, avatar_url, phone)
        `)
        .eq('is_active', true)
        .eq('verification_status', 'verified')
        .limit(3);

      // Load service providers
      const { data: providers, error: providersError } = await supabase
        .from('service_providers')
        .select(`
          user_id,
          service_category,
          rating,
          profiles:profiles!service_providers_user_id_fkey(id, full_name, avatar_url, phone)
        `)
        .eq('is_available', true)
        .eq('verification_status', 'verified')
        .limit(3);

      const users: GoodStartUser[] = [];

      // Add venue owners
      venues?.forEach(venue => {
        if (venue.profiles) {
          users.push({
            id: venue.owner_id,
            name: venue.profiles.full_name || 'Venue Owner',
            role: `${venue.name} Owner`,
            avatar: venue.profiles.avatar_url || '/placeholder.svg',
            rating: venue.rating || 0,
            location: venue.location || 'Location not specified',
            phone: venue.profiles.phone
          });
        }
      });

      // Add service providers
      providers?.forEach(provider => {
        if (provider.profiles) {
          users.push({
            id: provider.user_id,
            name: provider.profiles.full_name || 'Service Provider',
            role: provider.service_category || 'Service Provider',
            avatar: provider.profiles.avatar_url || '/placeholder.svg',
            rating: provider.rating || 0,
            location: 'Available for hire',
            phone: provider.profiles.phone
          });
        }
      });

      setSuggestedUsers(users.slice(0, 6));
    } catch (error) {
      console.error('Error loading suggested users:', error);
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartConversation = async (user: GoodStartUser) => {
    try {
      await onStartConversation(user.id, user.name, user.role, user.phone);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Good Start</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading suggestions...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Good Start
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Connect with verified venue owners and service providers
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No verified users available at the moment
          </p>
        ) : (
          suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{user.name}</h4>
                  <p className="text-sm text-muted-foreground">{user.role}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs">{user.rating.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{user.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleStartConversation(user)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-3 w-3" />
                Chat
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default GoodStartFeature;
