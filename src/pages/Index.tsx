
import { useState } from 'react';
import { HeroSection } from '@/components/HeroSection';
import { FeaturedVenues } from '@/components/FeaturedVenues';
import FeaturedProviders from '@/components/FeaturedProviders';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const handleGetStarted = () => {
    if (!user) {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen">
      <HeroSection onGetStarted={handleGetStarted} />
      <FeaturedVenues />
      <FeaturedProviders />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
};

export default Index;
