
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
  role: string;
  userId: string;
  phoneNumber?: string;
}

export const useMessaging = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  // Load conversations from database
  const loadConversations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(full_name, avatar_url),
          recipient:profiles!messages_recipient_id_fkey(full_name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation
      const conversationMap = new Map();
      
      data?.forEach((message) => {
        const otherUser = message.sender_id === user.id ? message.recipient : message.sender;
        const conversationId = [user.id, message.sender_id === user.id ? message.recipient_id : message.sender_id]
          .sort()
          .join('-');

        if (!conversationMap.has(conversationId)) {
          conversationMap.set(conversationId, {
            id: conversationId,
            name: otherUser?.full_name || 'Unknown User',
            avatar: otherUser?.avatar_url || '/placeholder.svg',
            lastMessage: message.message,
            timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            unread: message.sender_id !== user.id && !message.is_read ? 1 : 0,
            isOnline: Math.random() > 0.5, // Simulate online status
            role: 'User',
            userId: message.sender_id === user.id ? message.recipient_id : message.sender_id,
            phoneNumber: '+254700000000'
          });
        }
      });

      setConversations(Array.from(conversationMap.values()));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  // Load messages for a specific conversation
  const loadMessages = async (conversationId: string) => {
    if (!user) return;

    const [userId1, userId2] = conversationId.split('-');
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const formattedMessages: Message[] = data?.map((message) => ({
        id: message.id,
        content: message.message,
        timestamp: new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: message.sender_id === user.id,
        isRead: message.is_read
      })) || [];

      setMessages(formattedMessages);

      // Mark messages as read
      if (data && data.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('recipient_id', user.id)
          .in('id', data.map(m => m.id));
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  // Send a message
  const sendMessage = async (content: string, recipientId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          message: content,
          is_read: false
        });

      if (error) throw error;

      // Reload messages and conversations
      if (selectedChat) {
        loadMessages(selectedChat);
      }
      loadConversations();

      toast({
        title: "Message sent",
        description: "Your message has been delivered.",
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Start a new conversation
  const startConversation = async (userId: string, userName: string, userRole: string) => {
    if (!user) return null;

    const conversationId = [user.id, userId].sort().join('-');
    
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => conv.id === conversationId);
    
    if (!existingConversation) {
      const newConversation: Conversation = {
        id: conversationId,
        name: userName,
        avatar: '/placeholder.svg',
        lastMessage: 'No messages yet',
        timestamp: 'now',
        unread: 0,
        isOnline: true,
        role: userRole,
        userId: userId,
        phoneNumber: '+254700000000'
      };
      
      setConversations(prev => [newConversation, ...prev]);
    }
    
    return conversationId;
  };

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  return {
    conversations,
    messages,
    selectedChat,
    setSelectedChat,
    sendMessage,
    loadMessages,
    startConversation
  };
};
