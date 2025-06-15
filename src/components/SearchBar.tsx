
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Users, Filter, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SearchBarProps {
  onSearch: (searchTerm: string, capacity?: number, location?: string, category?: string) => void;
  placeholder?: string;
  searchType?: 'venues' | 'providers';
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  onSearch, 
  placeholder = "Search...",
  searchType = 'venues'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [capacity, setCapacity] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch(
      searchTerm, 
      capacity ? parseInt(capacity) : undefined, 
      location,
      category
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const serviceCategories = [
    'Photography',
    'Catering', 
    'Music & DJ',
    'Event Planning',
    'Decoration',
    'Security',
    'Transportation',
    'Entertainment'
  ];

  const venueCategories = [
    'hotel',
    'conference_center',
    'restaurant',
    'outdoor',
    'banquet_hall',
    'museum',
    'office'
  ];

  const categories = searchType === 'providers' ? serviceCategories : venueCategories;

  return (
    <div className="w-full space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pl-10 h-12 border-2 border-gray-200 focus:border-purple-500"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="h-12 px-4 border-2 border-gray-200 hover:border-purple-500"
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button 
          onClick={handleSearch}
          className="h-12 px-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          Search
        </Button>
      </div>

      {showFilters && (
        <Card className="border-2 border-gray-100">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {searchType === 'venues' ? (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Minimum Capacity
                  </label>
                  <Select value={capacity} onValueChange={setCapacity}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select capacity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50+ guests</SelectItem>
                      <SelectItem value="100">100+ guests</SelectItem>
                      <SelectItem value="200">200+ guests</SelectItem>
                      <SelectItem value="300">300+ guests</SelectItem>
                      <SelectItem value="500">500+ guests</SelectItem>
                      <SelectItem value="1000">1000+ guests</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Service Category
                  </label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nairobi">Nairobi</SelectItem>
                    <SelectItem value="mombasa">Mombasa</SelectItem>
                    <SelectItem value="kisumu">Kisumu</SelectItem>
                    <SelectItem value="nakuru">Nakuru</SelectItem>
                    <SelectItem value="eldoret">Eldoret</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {searchType === 'venues' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue Type</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SearchBar;
