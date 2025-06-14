
import React, { createContext, useContext } from 'react';
import { MessagingContextType } from '@/types/messaging';

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessagingContext = () => {
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessagingContext must be used within a MessagingProvider');
  }
  return context;
};

export { MessagingContext };
