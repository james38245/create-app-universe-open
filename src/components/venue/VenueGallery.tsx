
import React from 'react';

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

const VenueGallery: React.FC<VenueGalleryProps> = ({ images, venueName }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="md:col-span-2">
        <img 
          src={images[0]} 
          alt={venueName}
          className="w-full h-64 md:h-96 object-cover rounded-lg"
        />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
        {images.slice(1).map((image, index) => (
          <img 
            key={index}
            src={image} 
            alt={`${venueName} ${index + 2}`}
            className="w-full h-32 md:h-44 object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default VenueGallery;
