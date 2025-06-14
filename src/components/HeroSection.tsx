
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Users, Star } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative container mx-auto px-4 py-24">
        <div className="text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Your Perfect Event
            <span className="block text-yellow-300">Starts Here</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Discover amazing venues and connect with top service providers to make your events unforgettable
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Premium Venues</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Expert Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>Easy Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              <span>5-Star Service</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={onGetStarted} className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
