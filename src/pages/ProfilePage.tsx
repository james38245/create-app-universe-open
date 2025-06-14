
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Edit, Save, X, Plus, Star, Calendar, MapPin, FileText, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProfilePage = () => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'upcoming': return 'bg-blue-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-4xl mx-auto p-4 md:p-6">
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="bookings">Bookings</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button
                      variant={isEditing ? "destructive" : "outline"}
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                      {isEditing ? 'Cancel' : 'Edit'}
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Profile Image */}
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profileData.profileImage} alt={profileData.name} />
                      <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    {isEditing && (
                      <Button 
                        variant="outline" 
                        onClick={() => handleFileUpload('profile')}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Upload Photo
                      </Button>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={4}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Bookings Tab */}
            <TabsContent value="bookings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking History</CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-4">
                    {bookingHistory.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="flex flex-col items-center gap-2">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                          </div>
                          
                          <div>
                            <h4 className="font-medium">{booking.name}</h4>
                            <p className="text-sm text-muted-foreground capitalize">
                              {booking.type} • {new Date(booking.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-semibold">KSh {booking.amount.toLocaleString()}</p>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Tab */}
            <TabsContent value="services" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Service Provider Profile</CardTitle>
                    {!profileData.isServiceProvider && (
                      <Button onClick={handleBecomeProvider}>
                        Become a Provider
                      </Button>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {profileData.isServiceProvider ? (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Business Name</Label>
                          <Input 
                            value={serviceProviderData.businessName}
                            onChange={(e) => setServiceProviderData(prev => ({
                              ...prev,
                              businessName: e.target.value
                            }))}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Experience</Label>
                          <Input 
                            value={serviceProviderData.experience}
                            onChange={(e) => setServiceProviderData(prev => ({
                              ...prev,
                              experience: e.target.value
                            }))}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Services Offered</Label>
                        <div className="flex flex-wrap gap-2">
                          {serviceProviderData.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="px-3 py-1">
                              {service}
                              <button 
                                className="ml-2 text-xs"
                                onClick={() => {
                                  const newServices = serviceProviderData.services.filter((_, i) => i !== index);
                                  setServiceProviderData(prev => ({ ...prev, services: newServices }));
                                }}
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                          <Button variant="outline" size="sm" onClick={handleAddService}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add Service
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Pricing Range</Label>
                        <Input 
                          value={serviceProviderData.pricing}
                          onChange={(e) => setServiceProviderData(prev => ({
                            ...prev,
                            pricing: e.target.value
                          }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Portfolio</Label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                          {serviceProviderData.portfolio.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image}
                                alt={`Portfolio ${index + 1}`}
                                className="w-full h-20 object-cover rounded-lg"
                              />
                              <button 
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                                onClick={() => {
                                  const newPortfolio = serviceProviderData.portfolio.filter((_, i) => i !== index);
                                  setServiceProviderData(prev => ({ ...prev, portfolio: newPortfolio }));
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <Button 
                            variant="outline" 
                            className="h-20 border-dashed"
                            onClick={() => handleFileUpload('portfolio')}
                          >
                            <Plus className="h-6 w-6" />
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center gap-2 text-green-800 mb-2">
                          <Award className="h-5 w-5" />
                          <span className="font-medium">Provider Status: Active</span>
                        </div>
                        <p className="text-sm text-green-700">
                          Your profile is complete and you're listed as an active service provider. Clients can now book your services!
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <h3 className="text-lg font-semibold mb-2">Become a Service Provider</h3>
                      <p className="text-muted-foreground mb-4">
                        Join our platform and offer your services to event organizers
                      </p>
                      <p className="text-sm text-muted-foreground mb-4">
                        Requirements: Professional profile, CV/Resume upload, and service portfolio
                      </p>
                      <Button onClick={handleBecomeProvider}>Get Started</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Documents Tab */}
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Documents & Certifications</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Upload your CV/Resume and certifications to complete your provider profile
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* CV/Resume Upload */}
                  <div className="space-y-3">
                    <Label>CV/Resume {profileData.isServiceProvider && <span className="text-red-500">*</span>}</Label>
                    
                    {serviceProviderData.cvUploaded ? (
                      <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">{serviceProviderData.cvFileName}</p>
                            <p className="text-sm text-muted-foreground">Uploaded successfully</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleFileUpload('cv')}
                          >
                            Replace
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload your CV or Resume (PDF, DOC, DOCX)
                        </p>
                        <p className="text-xs text-red-600 mb-3">
                          Required for service provider registration
                        </p>
                        <Button 
                          variant="outline" 
                          onClick={() => handleFileUpload('cv')}
                        >
                          Choose File
                        </Button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Certifications */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Certifications & Awards</Label>
                      <Button variant="outline" size="sm" onClick={handleAddCertification}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Certification
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {serviceProviderData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-yellow-500" />
                            <span>{cert}</span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              const newCerts = serviceProviderData.certifications.filter((_, i) => i !== index);
                              setServiceProviderData(prev => ({ ...prev, certifications: newCerts }));
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Provider Registration Status */}
                  {profileData.isServiceProvider && (
                    <div className="pt-4 border-t">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-medium text-blue-800 mb-2">Registration Complete!</h4>
                        <div className="space-y-2 text-sm text-blue-700">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Profile information completed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 ${serviceProviderData.cvUploaded ? 'bg-green-500' : 'bg-yellow-500'} rounded-full`}></div>
                            <span>CV/Resume {serviceProviderData.cvUploaded ? 'uploaded' : 'pending'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>Services and portfolio added</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
