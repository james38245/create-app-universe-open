
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Calendar, Users, Star, ArrowRight, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import VenueCard from '@/components/VenueCard';
import ServiceProviderCard from '@/components/ServiceProviderCard';

const Index = () => {
  // Mock data for featured venues
  const featuredVenues = [
    {
      id: '1',
      name: 'Safari Park Hotel',
      location: 'Nairobi',
      capacity: 500,
      price: 150000,
      rating: 4.8,
      image: '/placeholder.svg',
      type: 'Hotel',
      availability: 'available' as const
    },
    {
      id: '2',
      name: 'Villa Rosa Kempinski',
      location: 'Westlands',
      capacity: 300,
      price: 200000,
      rating: 4.9,
      image: '/placeholder.svg',
      type: 'Hotel',
      availability: 'limited' as const
    },
    {
      id: '3',
      name: 'Karen Country Club',
      location: 'Karen',
      capacity: 400,
      price: 180000,
      rating: 4.7,
      image: '/placeholder.svg',
      type: 'Club',
      availability: 'available' as const
    }
  ];

  // Mock data for top service providers
  const topProviders = [
    {
      id: '1',
      name: 'James Mwangi',
      service: 'Wedding Photographer',
      location: 'Nairobi',
      rating: 4.9,
      reviews: 156,
      price: 45000,
      avatar: '/placeholder.svg',
      isAvailable: true,
      specialties: ['Wedding', 'Portrait', 'Events']
    },
    {
      id: '2',
      name: 'Sarah Kimani',
      service: 'Event Coordinator',
      location: 'Mombasa',
      rating: 4.8,
      reviews: 89,
      price: 60000,
      avatar: '/placeholder.svg',
      isAvailable: true,
      specialties: ['Corporate Events', 'Weddings', 'Planning']
    }
  ];

  const categories = [
    { name: 'Weddings', count: 150, icon: '💒' },
    { name: 'Corporate Events', count: 89, icon: '🏢' },
    { name: 'Birthday Parties', count: 76, icon: '🎂' },
    { name: 'Conferences', count: 45, icon: '🎤' },
    { name: 'Graduations', count: 32, icon: '🎓' },
    { name: 'Baby Showers', count: 28, icon: '🍼' }
  ];

  const stats = [
    { label: 'Total Venues', value: '500+', icon: MapPin },
    { label: 'Service Providers', value: '1,200+', icon: Users },
    { label: 'Events Hosted', value: '10,000+', icon: Calendar },
    { label: 'Happy Clients', value: '25,000+', icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile padding for fixed header and bottom nav */}
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 md:p-12">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Find Perfect Venues & Services
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover amazing venues and professional service providers for your special events in Kenya
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="flex flex-col md:flex-row gap-3 bg-background p-2 rounded-lg shadow-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search venues, services, or locations..." 
                    className="pl-10 border-0 focus-visible:ring-0"
                  />
                </div>
                <Button size="lg" className="md:w-auto">
                  Search Events
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <h3 className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-12 px-6 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Browse by Category</h2>
              <p className="text-muted-foreground">Find the perfect venue for any occasion</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">{category.icon}</div>
                    <h3 className="font-semibold mb-1">{category.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {category.count} venues
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Venues */}
        <section className="py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Featured Venues</h2>
                <p className="text-muted-foreground">Handpicked venues for exceptional events</p>
              </div>
              <Link to="/venues">
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {featuredVenues.map(venue => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
            
            <div className="text-center md:hidden">
              <Link to="/venues">
                <Button className="w-full">View All Venues</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Top Service Providers */}
        <section className="py-12 px-6 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">Top Service Providers</h2>
                <p className="text-muted-foreground">Professional services for your perfect event</p>
              </div>
              <Link to="/venues">
                <Button variant="outline" className="hidden md:flex items-center gap-2">
                  View All <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {topProviders.map(provider => (
                <ServiceProviderCard key={provider.id} provider={provider} />
              ))}
            </div>
            
            <div className="text-center md:hidden">
              <Link to="/venues">
                <Button className="w-full">View All Providers</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
              <CardContent className="p-8 md:p-12 text-center">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Ready to Start Planning?
                </h2>
                <p className="text-lg mb-6 opacity-90">
                  Join thousands of satisfied customers who trust EventBook for their special occasions
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link to="/venues">
                    <Button size="lg" variant="secondary" className="w-full md:w-auto">
                      Browse Venues
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button size="lg" variant="outline" className="w-full md:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                      Become a Provider
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Index;
