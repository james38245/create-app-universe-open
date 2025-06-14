import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
  bookingId?: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  userId: string;
  phoneNumber?: string;
}

interface MessagingContextType {
  conversations: Conversation[];
  messages: Message[];
  selectedChat: string | null;
  setSelectedChat: (chatId: string | null) => void;
  sendMessage: (content: string, recipientId: string) => Promise<void>;
  startConversation: (userId: string, userName: string, userRole: string, phoneNumber?: string) => Promise<string>;
  loadMessages: (conversationId: string) => Promise<void>;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const MessagingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const { user } = useAuth();

  // Load conversations when user is available
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;

    // Mock conversations with phone numbers - in real app, this would fetch from Supabase
    const mockConversations: Conversation[] = [
      {
        id: '1',
        name: 'Sarah Kimani',
        role: 'Event Coordinator',
        avatar: '/placeholder.svg',
        lastMessage: 'Perfect! I can help you plan your wedding. When is the date?',
        timestamp: '2 min ago',
        unread: 2,
        isOnline: true,
        userId: 'user-1',
        phoneNumber: '+254701234567'
      },
      {
        id: '2',
        name: 'James Mwangi',
        role: 'Wedding Photographer',
        avatar: '/placeholder.svg',
        lastMessage: 'I have availability for that weekend. Let me send you my portfolio.',
        timestamp: '1 hour ago',
        unread: 0,
        isOnline: false,
        userId: 'user-2',
        phoneNumber: '+254702345678'
      },
      {
        id: '3',
        name: 'Safari Park Hotel',
        role: 'Venue Manager',
        avatar: '/placeholder.svg',
        lastMessage: 'Thank you for your booking inquiry. The venue is available.',
        timestamp: '3 hours ago',
        unread: 1,
        isOnline: true,
        userId: 'user-3',
        phoneNumber: '+254703456789'
      }
    ];

    setConversations(mockConversations);
  };

  const loadMessages = async (conversationId: string) => {
    // Mock messages for now - in real app, this would fetch from Supabase
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: 'user-2',
        recipientId: user?.id || '',
        content: 'Hi! I saw your inquiry about wedding coordination services.',
        timestamp: '10:30 AM',
        isOwn: false,
        isRead: true
      },
      {
        id: '2',
        senderId: user?.id || '',
        recipientId: 'user-2',
        content: 'Yes, I\'m planning a wedding for December 15th. Can you help?',
        timestamp: '10:32 AM',
        isOwn: true,
        isRead: true
      },
      {
        id: '3',
        senderId: 'user-2',
        recipientId: user?.id || '',
        content: 'Absolutely! I specialize in wedding planning. What\'s your estimated guest count?',
        timestamp: '10:33 AM',
        isOwn: false,
        isRead: true
      },
      {
        id: '4',
        senderId: user?.id || '',
        recipientId: 'user-2',
        content: 'We\'re expecting around 200 guests. Looking for a venue in Nairobi.',
        timestamp: '10:35 AM',
        isOwn: true,
        isRead: true
      },
      {
        id: '5',
        senderId: 'user-2',
        recipientId: user?.id || '',
        content: 'Perfect! I can help you plan your wedding. When is the date?',
        timestamp: '10:36 AM',
        isOwn: false,
        isRead: false
      }
    ];

    setMessages(mockMessages);
  };

  const sendMessage = async (content: string, recipientId: string) => {
    if (!user) return;

    // In real app, this would send to Supabase
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      recipientId,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      isRead: false
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const startConversation = async (userId: string, userName: string, userRole: string, phoneNumber?: string): Promise<string> => {
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.userId === userId);
    
    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation
    const newConversation: Conversation = {
      id: Date.now().toString(),
      name: userName,
      role: userRole,
      avatar: '/placeholder.svg',
      lastMessage: 'Start a conversation...',
      timestamp: 'now',
      unread: 0,
      isOnline: Math.random() > 0.5,
      userId,
      phoneNumber: phoneNumber || '+254700000000' // Default number if not provided
    };

    setConversations(prev => [newConversation, ...prev]);
    return newConversation.id;
  };

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
  const context = useContext(MessagingContext);
  if (context === undefined) {
    throw new Error('useMessaging must be used within a MessagingProvider');
  }
  return context;
};
