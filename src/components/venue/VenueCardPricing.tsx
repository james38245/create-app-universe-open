
import React from 'react';

interface VenueCardPricingProps {
  venue: {
    price_per_day: number;
  };
  layout?: 'grid' | 'list';
}

const VenueCardPricing: React.FC<VenueCardPricingProps> = ({ venue, layout = 'grid' }) => {
  if (layout === 'list') {
    return (
      <p className="text-2xl font-bold text-purple-600 mb-4">
        KSh {venue.price_per_day.toLocaleString()}
        <span className="text-sm text-gray-500 font-normal">/day</span>
      </p>
    );
  }

  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <span className="text-2xl font-bold text-purple-600">
          KSh {venue.price_per_day.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">/day</span>
      </div>
    </div>
  );
};

export default VenueCardPricing;
