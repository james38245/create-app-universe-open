
import React from 'react';
import { HelpCircle } from 'lucide-react';

const SupportHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <HelpCircle className="h-8 w-8 text-purple-600" />
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Support Center
        </h1>
      </div>
      <p className="text-gray-600 text-lg max-w-2xl mx-auto">
        We're here to help! Get in touch with our support team or browse our help articles.
      </p>
    </div>
  );
};

export default SupportHeader;
