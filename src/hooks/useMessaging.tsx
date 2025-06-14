
import React, { useState, useEffect } from 'react';
import { MessagingContext } from '@/contexts/MessagingContext';
import { useAuth } from './useAuth';
import { useMessagingOperations } from './useMessagingOperations';

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuth();
  const {
    conversations,
    messages,
    loadConversations,
    loadMessages,
    sendMessage,
    startConversation
  } = useMessagingOperations(user);

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  return (
    <MessagingContext.Provider value={{
      conversations,
      messages,
      selectedChat,
      setSelectedChat,
      sendMessage,
      startConversation,
      loadMessages
    }}>
      {children}
    </MessagingContext.Provider>
  );
};

export const useMessaging = () => {
  const context = React.useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
