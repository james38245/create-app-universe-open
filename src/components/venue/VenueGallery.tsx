
import React, { useState } from 'react';
import ImageModal from '@/components/ImageModal';

interface VenueGalleryProps {
  images: string[];
  venueName: string;
}

const VenueGallery: React.FC<VenueGalleryProps> = ({ images, venueName }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openModal = (index: number) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2">
          <img 
            src={images[0]} 
            alt={venueName}
            className="w-full h-64 md:h-96 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => openModal(0)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          {images.slice(1).map((image, index) => (
            <img 
              key={index}
              src={image} 
              alt={`${venueName} ${index + 2}`}
              className="w-full h-32 md:h-44 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => openModal(index + 1)}
            />
          ))}
        </div>
      </div>

      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrevious={previousImage}
        venueName={venueName}
      />
    </>
  );
};

export default VenueGallery;
