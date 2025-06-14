
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin } from 'lucide-react';
import VenueCard from '@/components/VenueCard';
import ServiceProviderCard from '@/components/ServiceProviderCard';

const VenuesPage = () => {
  const [activeTab, setActiveTab] = useState<'venues' | 'providers'>('venues');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data for venues - matching the Venue interface
  const venues = [
    {
      id: '1',
      name: 'Safari Park Hotel',
      location: 'Nairobi',
      capacity: 500,
      price_per_day: 150000,
      rating: 4.8,
      images: ['/placeholder.svg'],
      venue_type: 'Hotel',
      is_active: true,
      total_reviews: 45,
      description: 'Luxury hotel with excellent facilities'
    },
    {
      id: '2',
      name: 'KICC Amphitheatre',
      location: 'Nairobi CBD',
      capacity: 1000,
      price_per_day: 300000,
      rating: 4.6,
      images: ['/placeholder.svg'],
      venue_type: 'Conference Center',
      is_active: true,
      total_reviews: 32,
      description: 'Modern conference facility in the heart of the city'
    },
    {
      id: '3',
      name: 'Villa Rosa Kempinski',
      location: 'Westlands',
      capacity: 300,
      price_per_day: 200000,
      rating: 4.9,
      images: ['/placeholder.svg'],
      venue_type: 'Hotel',
      is_active: true,
      total_reviews: 78,
      description: 'Premium hotel with world-class amenities'
    },
    {
      id: '4',
      name: 'Karen Country Club',
      location: 'Karen',
      capacity: 400,
      price_per_day: 180000,
      rating: 4.7,
      images: ['/placeholder.svg'],
      venue_type: 'Club',
      is_active: false,
      total_reviews: 23,
      description: 'Exclusive club in serene Karen environment'
    }
  ];

  // Mock data for service providers - matching the ServiceProvider interface
  const serviceProviders = [
    {
      id: '1',
      service_category: 'Photography',
      specialties: ['Wedding', 'Portrait', 'Events'],
      price_per_event: 45000,
      rating: 4.9,
      total_reviews: 156,
      is_available: true,
      bio: 'Professional photographer with 10+ years experience',
      years_experience: 10,
      portfolio_images: ['/placeholder.svg'],
      profiles: {
        full_name: 'James Mwangi',
        email: 'james@example.com'
      }
    },
    {
      id: '2',
      service_category: 'Event Planning',
      specialties: ['Corporate Events', 'Weddings', 'Planning'],
      price_per_event: 60000,
      rating: 4.8,
      total_reviews: 89,
      is_available: true,
      bio: 'Experienced event coordinator specializing in luxury events',
      years_experience: 8,
      portfolio_images: ['/placeholder.svg'],
      profiles: {
        full_name: 'Sarah Kimani',
        email: 'sarah@example.com'
      }
    },
    {
      id: '3',
      service_category: 'Music & DJ',
      specialties: ['Wedding DJ', 'Corporate', 'Sound System'],
      price_per_event: 25000,
      rating: 4.7,
      total_reviews: 203,
      is_available: false,
      bio: 'Professional DJ with state-of-the-art equipment',
      years_experience: 6,
      portfolio_images: ['/placeholder.svg'],
      profiles: {
        full_name: 'David Ochieng',
        email: 'david@example.com'
      }
    }
  ];

  const filteredVenues = venues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all' || venue.location === locationFilter;
    const matchesType = typeFilter === 'all' || venue.venue_type === typeFilter;
    
    return matchesSearch && matchesLocation && matchesType;
  });

  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = provider.profiles.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         provider.service_category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = locationFilter === 'all';
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile padding for fixed header */}
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Find Perfect Venues & Services
            </h1>
            <p className="text-muted-foreground">
              Discover amazing venues and professional service providers for your events
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              variant={activeTab === 'venues' ? 'default' : 'outline'}
              onClick={() => setActiveTab('venues')}
              className="flex-1 md:flex-none"
            >
              Venues ({venues.length})
            </Button>
            <Button
              variant={activeTab === 'providers' ? 'default' : 'outline'}
              onClick={() => setActiveTab('providers')}
              className="flex-1 md:flex-none"
            >
              Service Providers ({serviceProviders.length})
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={`Search ${activeTab}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-col md:flex-row gap-3">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Nairobi">Nairobi</SelectItem>
                  <SelectItem value="Mombasa">Mombasa</SelectItem>
                  <SelectItem value="Kisumu">Kisumu</SelectItem>
                  <SelectItem value="Nakuru">Nakuru</SelectItem>
                </SelectContent>
              </Select>

              {activeTab === 'venues' && (
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Hotel">Hotel</SelectItem>
                    <SelectItem value="Conference Center">Conference Center</SelectItem>
                    <SelectItem value="Club">Club</SelectItem>
                    <SelectItem value="Restaurant">Restaurant</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Button variant="outline" className="w-full md:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'venues' 
              ? filteredVenues.map(venue => (
                  <VenueCard key={venue.id} venue={venue} />
                ))
              : filteredProviders.map(provider => (
                  <ServiceProviderCard key={provider.id} provider={provider} />
                ))
            }
          </div>

          {/* Empty State */}
          {((activeTab === 'venues' && filteredVenues.length === 0) || 
            (activeTab === 'providers' && filteredProviders.length === 0)) && (
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;
