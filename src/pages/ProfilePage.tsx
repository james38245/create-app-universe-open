
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileForm from '@/components/profile/ProfileForm';
import BookingHistory from '@/components/profile/BookingHistory';
import ServiceProviderProfile from '@/components/profile/ServiceProviderProfile';
import DocumentsSection from '@/components/profile/DocumentsSection';
import PaymentsSection from '@/components/profile/PaymentsSection';

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254 700 123 456',
    location: 'Nairobi, Kenya',
    bio: 'Professional event planner with 8+ years of experience in organizing corporate events, weddings, and social gatherings.',
    profileImage: '/placeholder.svg',
    isServiceProvider: true
  });

  const [serviceProviderData, setServiceProviderData] = useState({
    businessName: 'Elite Events Planning',
    services: ['Wedding Planning', 'Corporate Events', 'Birthday Parties'],
    experience: '8 years',
    portfolio: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    certifications: ['Certified Event Planner', 'Project Management Professional'],
    pricing: 'KSh 50,000 - 200,000 per event',
    cvUploaded: true,
    cvFileName: 'john_doe_cv.pdf'
  });

  // Mock booking history
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
    },
    {
      id: '3',
      type: 'venue',
      name: 'KICC Amphitheatre',
      date: '2023-12-10',
      status: 'completed',
      amount: 300000
    }
  ];

  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('payment_account_type, payment_account_number, payment_account_name')
          .eq('id', user.id)
          .single();
        setUserProfile(data);
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast({
      title: "Profile updated successfully!",
      description: "Your profile information has been saved.",
    });
  };

  const handleFileUpload = (type: 'profile' | 'cv' | 'portfolio') => {
    if (type === 'cv') {
      setServiceProviderData(prev => ({
        ...prev,
        cvUploaded: true,
        cvFileName: 'updated_cv.pdf'
      }));
    }
    
    toast({
      title: "File uploaded successfully!",
      description: `Your ${type} has been updated.`,
    });
  };

  const handleBecomeProvider = () => {
    setProfileData(prev => ({ ...prev, isServiceProvider: true }));
    toast({
      title: "Welcome to our provider network!",
      description: "You can now start offering your services on our platform.",
    });
  };

  const handleAddService = () => {
    const newService = 'New Service';
    setServiceProviderData(prev => ({
      ...prev,
      services: [...prev.services, newService]
    }));
  };

  const handleAddCertification = () => {
    const newCert = 'New Certification';
    setServiceProviderData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert]
    }));
  };

  const handlePaymentAccountSave = () => {
    if (user) {
      supabase
        .from('profiles')
        .select('payment_account_type, payment_account_number, payment_account_name')
        .eq('id', user.id)
        .single()
        .then(({ data }) => setUserProfile(data));
    }
  };

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
                    onFileUpload={handleFileUpload}
                  />

                  <ProfileForm
                    profileData={profileData}
                    isEditing={isEditing}
                    onProfileChange={setProfileData}
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
                onBecomeProvider={handleBecomeProvider}
                onServiceProviderChange={setServiceProviderData}
                onAddService={handleAddService}
                onFileUpload={handleFileUpload}
              />
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <DocumentsSection
                profileData={profileData}
                serviceProviderData={serviceProviderData}
                onFileUpload={handleFileUpload}
                onAddCertification={handleAddCertification}
                onServiceProviderChange={setServiceProviderData}
              />
            </TabsContent>

            {/* Payments Tab */}
            <TabsContent value="payments" className="space-y-6">
              <PaymentsSection
                userProfile={userProfile}
                onPaymentAccountSave={handlePaymentAccountSave}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
