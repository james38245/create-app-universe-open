
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import BookingHistory from '@/components/profile/BookingHistory';
import ServiceProviderProfile from '@/components/profile/ServiceProviderProfile';
import DocumentsSection from '@/components/profile/DocumentsSection';
import PaymentsSection from '@/components/profile/PaymentsSection';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuth();
  const { profileData, loading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (data: any) => {
    const success = await updateProfile(data);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleImageUpdate = async (imageUrl: string) => {
    await updateProfile({ avatar_url: imageUrl });
  };

  // Mock data for service provider and booking history
  const serviceProviderData = {
    businessName: 'Elite Events Planning',
    services: ['Wedding Planning', 'Corporate Events', 'Birthday Parties'],
    experience: '8 years',
    portfolio: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    certifications: ['Certified Event Planner', 'Project Management Professional'],
    pricing: 'KSh 50,000 - 200,000 per event',
    cvUploaded: true,
    cvFileName: 'john_doe_cv.pdf'
  };

  const bookingHistory = [
    {
      id: '1',
      type: 'venue',
      name: 'Safari Park Hotel',
      date: '2024-01-15',
      status: 'completed',
      amount: 150000
    },
    {
      id: '2',
      type: 'service',
      name: 'James Mwangi - Photography',
      date: '2024-01-20',
      status: 'upcoming',
      amount: 45000
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardContent className="space-y-6 pt-6">
                  <ProfileHeader
                    profileData={profileData}
                    isEditing={isEditing}
                    onEditToggle={() => setIsEditing(!isEditing)}
                    onImageUpdate={handleImageUpdate}
                  />

                  <ProfileForm
                    profileData={profileData}
                    isEditing={isEditing}
                    onSave={handleSaveProfile}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <BookingHistory bookingHistory={bookingHistory} />
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <ServiceProviderProfile
                profileData={profileData}
                serviceProviderData={serviceProviderData}
                onBecomeProvider={() => {}}
                onServiceProviderChange={() => {}}
                onAddService={() => {}}
                onFileUpload={() => {}}
              />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <DocumentsSection
                profileData={profileData}
                serviceProviderData={serviceProviderData}
                onFileUpload={() => {}}
                onAddCertification={() => {}}
                onServiceProviderChange={() => {}}
              />
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <PaymentsSection
                userProfile={profileData}
                onPaymentAccountSave={() => {}}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
