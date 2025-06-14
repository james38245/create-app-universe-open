
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

    try {
      // First, get all messages where user is sender or recipient
      const { data: userMessages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url, phone),
          recipient:profiles!messages_recipient_id_fkey(full_name, avatar_url, phone)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        return;
      }

      // Group messages by conversation (other participant)
      const conversationMap = new Map();
      
      userMessages?.forEach((message) => {
        const isOwn = message.sender_id === user.id;
        const otherParticipant = isOwn ? message.recipient : message.sender;
        const otherParticipantId = isOwn ? message.recipient_id : message.sender_id;
        
        if (!otherParticipant) return;

        const conversationId = otherParticipantId;
        
        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            name: otherParticipant.full_name || 'Unknown User',
            role: 'User', // You can extend this to include user roles
            avatar: otherParticipant.avatar_url || '/placeholder.svg',
            lastMessage: message.message,
            timestamp: new Date(message.created_at).toLocaleString(),
            unread: 0, // We'll calculate this separately
            isOnline: Math.random() > 0.5, // Mock online status
            userId: conversationId,
            phoneNumber: otherParticipant.phone || '+254700000000'
          });
        }
      });

      const conversationsList = Array.from(conversationMap.values());
      
      // Calculate unread messages for each conversation
      for (const conversation of conversationsList) {
        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('sender_id', conversation.userId)
          .eq('recipient_id', user.id)
          .eq('is_read', false);
        
        conversation.unread = count || 0;
      }

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      // Fallback to mock data if there's an error
      setConversations([]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    try {
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      const formattedMessages: Message[] = messagesData?.map(msg => ({
        id: msg.id,
        senderId: msg.sender_id,
        recipientId: msg.recipient_id,
        content: msg.message,
        timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: msg.sender_id === user.id,
        isRead: msg.is_read,
        bookingId: msg.booking_id
      })) || [];

      setMessages(formattedMessages);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('sender_id', conversationId)
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      // Refresh conversations to update unread counts
      loadConversations();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content: string, recipientId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: content,
          is_read: false
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      // Add the new message to the current messages
      const newMessage: Message = {
        id: data.id,
        senderId: data.sender_id,
        recipientId: data.recipient_id,
        content: data.message,
        timestamp: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        isRead: false,
        bookingId: data.booking_id
      };

      setMessages(prev => [...prev, newMessage]);
      
      // Refresh conversations to update last message
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startConversation = async (userId: string, userName: string, userRole: string, phoneNumber?: string): Promise<string> => {
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.userId === userId);
    
    if (existingConversation) {
      return existingConversation.id;
    }

    // Create new conversation entry
    const newConversation: Conversation = {
      id: userId,
      name: userName,
      role: userRole,
      avatar: '/placeholder.svg',
      lastMessage: 'Start a conversation...',
      timestamp: 'now',
      unread: 0,
      isOnline: Math.random() > 0.5,
      userId,
      phoneNumber: phoneNumber || '+254700000000'
    };

    setConversations(prev => [newConversation, ...prev]);
    return userId;
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
