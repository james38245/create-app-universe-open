
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Search, Star, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface Seller {
  id: string;
  name: string;
  category: string;
  rating: number;
  price: number;
  avatar: string;
  type: 'venue' | 'service';
}

interface GoodStartFeatureProps {
  onStartConversation: (sellerId: string, sellerName: string, sellerRole: string) => void;
}

const GoodStartFeature: React.FC<GoodStartFeatureProps> = ({ onStartConversation }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [filteredSellers, setFilteredSellers] = useState<Seller[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const navigate = useNavigate();

  useEffect(() => {
    loadSellers();
  }, []);

  useEffect(() => {
    filterSellers();
  }, [searchTerm, selectedCategory, sellers]);

  const loadSellers = async () => {
    try {
      // Load venues
      const { data: venues, error: venuesError } = await supabase
        .from('venues')
        .select(`
          id,
          name,
          venue_type,
          rating,
          price_per_day,
          images,
          owner_id,
          profiles:owner_id(full_name, avatar_url)
        `)
        .eq('is_active', true)
        .limit(10);

      if (venuesError) throw venuesError;

      // Load service providers
      const { data: providers, error: providersError } = await supabase
        .from('service_providers')
        .select(`
          id,
          service_category,
          rating,
          price_per_event,
          portfolio_images,
          user_id,
          profiles:user_id(full_name, avatar_url)
        `)
        .eq('is_available', true)
        .limit(10);

      if (providersError) throw providersError;

      const formattedSellers: Seller[] = [
        ...(venues?.map(venue => ({
          id: venue.id,
          name: venue.name,
          category: venue.venue_type,
          rating: venue.rating || 0,
          price: venue.price_per_day,
          avatar: venue.images?.[0] || '/placeholder.svg',
          type: 'venue' as const
        })) || []),
        ...(providers?.map(provider => ({
          id: provider.id,
          name: provider.profiles?.full_name || 'Service Provider',
          category: provider.service_category,
          rating: provider.rating || 0,
          price: provider.price_per_event,
          avatar: provider.portfolio_images?.[0] || '/placeholder.svg',
          type: 'service' as const
        })) || [])
      ];

      setSellers(formattedSellers);
    } catch (error) {
      console.error('Error loading sellers:', error);
    }
  };

  const filterSellers = () => {
    let filtered = sellers;

    if (searchTerm) {
      filtered = filtered.filter(seller =>
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(seller => seller.category === selectedCategory);
    }

    setFilteredSellers(filtered);
  };

  const categories = Array.from(new Set(sellers.map(seller => seller.category)));

  const handleStartConversation = (seller: Seller) => {
    onStartConversation(seller.id, seller.name, seller.category);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Good Start - Connect with Sellers
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Search and connect with venues and service providers to start your event planning journey.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search venues or services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setSelectedCategory('all')}
          >
            All
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>

        {/* Sellers List */}
        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredSellers.map((seller) => (
            <div
              key={seller.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={seller.avatar} alt={seller.name} />
                  <AvatarFallback>{seller.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium">{seller.name}</h4>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{seller.category}</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{seller.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-primary">
                    KSh {seller.price.toLocaleString()}/{seller.type === 'venue' ? 'day' : 'event'}
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => handleStartConversation(seller)}
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </Button>
            </div>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No sellers found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoodStartFeature;
