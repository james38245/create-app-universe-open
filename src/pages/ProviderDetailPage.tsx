
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar,
  Upload,
  FileText,
  Award,
  Heart,
  Share2
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const ProviderDetailPage = () => {
  const { id } = useParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [eventDetails, setEventDetails] = useState('');

  // Mock provider data - in real app, this would be fetched based on ID
  const provider = {
    id: id || '1',
    name: 'James Mwangi',
    service: 'Wedding Photographer',
    location: 'Nairobi',
    rating: 4.9,
    reviews: 156,
    price: 45000,
    avatar: '/placeholder.svg',
    isAvailable: true,
    specialties: ['Wedding', 'Portrait', 'Events', 'Corporate'],
    bio: 'Professional photographer with over 8 years of experience capturing life\'s most precious moments. Specializing in weddings, portraits, and corporate events.',
    experience: '8+ years',
    portfolio: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    certifications: ['Certified Professional Photographer', 'Adobe Certified Expert'],
    responseTime: '2 hours',
    completedProjects: 250,
    availableDates: ['2024-01-20', '2024-01-25', '2024-02-10', '2024-02-15']
  };

  const handleBooking = () => {
    if (!selectedDate || !eventDetails) {
      toast({
        title: "Missing Information",
        description: "Please select a date and provide event details.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Booking Request Sent!",
      description: `Your booking request for ${selectedDate} has been sent to ${provider.name}.`,
    });
  };

  const handleMessage = () => {
    toast({
      title: "Message Started",
      description: `Opening conversation with ${provider.name}...`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-6xl mx-auto p-4 md:p-6">
          
          {/* Header Section */}
          <div className="mb-6">
            <div className="flex items-start gap-4 mb-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24">
                <AvatarImage src={provider.avatar} alt={provider.name} />
                <AvatarFallback className="text-2xl">{provider.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">{provider.name}</h1>
                <p className="text-lg text-muted-foreground mb-2">{provider.service}</p>
                
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{provider.rating}</span>
                    <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {provider.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">{specialty}</Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{provider.completedProjects}</div>
                  <div className="text-sm text-muted-foreground">Projects</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{provider.experience}</div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{provider.responseTime}</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">KSh {provider.price.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Starting Price</div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  <TabsTrigger value="availability">Calendar</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {provider.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                            <FileText className="h-5 w-5 text-primary" />
                            <span>{cert}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Portfolio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {provider.portfolio.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Portfolio ${index + 1}`}
                            className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Reviews</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Mock reviews */}
                        {[1, 2, 3].map((review) => (
                          <div key={review} className="border-b pb-4 last:border-b-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                ))}
                              </div>
                              <span className="font-medium">Sarah M.</span>
                              <span className="text-sm text-muted-foreground">2 days ago</span>
                            </div>
                            <p className="text-muted-foreground">
                              Excellent photographer! James captured our wedding beautifully and was very professional throughout the day.
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="availability" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Dates</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {provider.availableDates.map((date) => (
                          <Button
                            key={date}
                            variant={selectedDate === date ? "default" : "outline"}
                            onClick={() => setSelectedDate(date)}
                            className="h-auto p-3 flex flex-col"
                          >
                            <Calendar className="h-4 w-4 mb-1" />
                            {new Date(date).toLocaleDateString()}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Booking Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Book {provider.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="date">Select Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="details">Event Details</Label>
                    <Textarea
                      id="details"
                      placeholder="Tell us about your event..."
                      value={eventDetails}
                      onChange={(e) => setEventDetails(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-4">
                      <span>Starting Price:</span>
                      <span className="text-xl font-bold">KSh {provider.price.toLocaleString()}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <Button 
                        onClick={handleBooking} 
                        className="w-full"
                        disabled={!provider.isAvailable}
                      >
                        <Calendar className="h-4 w-4 mr-2" />
                        Book Now
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleMessage}
                        className="w-full"
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      
                      <Link to={`tel:+254700123456`}>
                        <Button variant="outline" className="w-full">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4" />
                    <span>+254 700 123 456</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-4 w-4" />
                    <span>Available for chat</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4" />
                    <span>{provider.location}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailPage;
