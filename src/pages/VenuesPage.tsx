
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import VenueCard from '@/components/VenueCard';
import SearchBar from '@/components/SearchBar';
import { MapPin, Filter, Grid, List } from 'lucide-react';

const VenuesPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredVenues, setFilteredVenues] = useState<any[]>([]);

  // Mock venues data with enhanced information
  const venues = [
    {
      id: '1',
      name: 'Safari Park Hotel',
      location: 'Nairobi',
      price: 150000,
      rating: 4.8,
      reviews: 324,
      capacity: 500,
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945',
      amenities: ['WiFi', 'Parking', 'Catering', 'Photography'],
      description: 'Luxury hotel venue perfect for weddings and corporate events'
    },
    {
      id: '2',
      name: 'KICC Amphitheatre',
      location: 'Nairobi CBD',
      price: 300000,
      rating: 4.9,
      reviews: 156,
      capacity: 1000,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
      amenities: ['Sound System', 'Lighting', 'Security', 'Parking'],
      description: 'Grand amphitheatre for large conferences and events'
    },
    {
      id: '3',
      name: 'Villa Rosa Kempinski',
      location: 'Westlands',
      price: 200000,
      rating: 4.7,
      reviews: 89,
      capacity: 300,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
      amenities: ['Fine Dining', 'Spa', 'Valet', 'Gardens'],
      description: 'Elegant hotel with beautiful gardens and luxury amenities'
    },
    {
      id: '4',
      name: 'Nairobi National Museum',
      location: 'Museum Hill',
      price: 120000,
      rating: 4.6,
      reviews: 67,
      capacity: 200,
      image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
      amenities: ['Cultural Setting', 'Guides', 'Exhibits', 'Gardens'],
      description: 'Unique cultural venue with historical significance'
    },
    {
      id: '5',
      name: 'The Hub Karen',
      location: 'Karen',
      price: 80000,
      rating: 4.5,
      reviews: 123,
      capacity: 150,
      image: 'https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0',
      amenities: ['Modern Facilities', 'Tech Setup', 'Catering', 'Parking'],
      description: 'Modern event space perfect for corporate meetings'
    },
    {
      id: '6',
      name: 'Carnivore Restaurant',
      location: 'Langata',
      price: 100000,
      rating: 4.4,
      reviews: 234,
      capacity: 250,
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
      amenities: ['Unique Dining', 'Entertainment', 'Music', 'Dancing'],
      description: 'Famous restaurant with entertainment and unique atmosphere'
    }
  ];

  const [displayedVenues, setDisplayedVenues] = useState(venues);

  const handleSearch = (searchTerm: string, capacity?: number, location?: string) => {
    let filtered = venues;

    if (searchTerm) {
      filtered = filtered.filter(venue => 
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (capacity) {
      filtered = filtered.filter(venue => venue.capacity >= capacity);
    }

    if (location) {
      filtered = filtered.filter(venue => 
        venue.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    setDisplayedVenues(filtered);
    setFilteredVenues(filtered);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Find Your Perfect Venue
            </h1>
            <p className="text-gray-600 text-lg">
              Discover amazing venues for your next event
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search venues by name, location, or amenities..."
            />
          </div>

          {/* Results Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">
                {displayedVenues.length} venue{displayedVenues.length !== 1 ? 's' : ''} found
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? 'bg-purple-600 hover:bg-purple-700' : ''}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Venues Grid/List */}
          {displayedVenues.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
              : 'space-y-4'
            }>
              {displayedVenues.map((venue) => (
                <VenueCard 
                  key={venue.id} 
                  venue={venue} 
                  layout={viewMode}
                />
              ))}
            </div>
          ) : (
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="text-center py-16">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-gray-900">No venues found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or browse all venues
                </p>
                <Button 
                  onClick={() => {
                    setDisplayedVenues(venues);
                    setFilteredVenues([]);
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Show All Venues
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VenuesPage;
