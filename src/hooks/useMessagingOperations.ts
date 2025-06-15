
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types/messaging';
import { 
  formatMessageFromDB, 
  createConversationFromMessage, 
  calculateUnreadCount,
  markMessagesAsRead 
} from '@/utils/messageUtils';

export const useMessagingOperations = (user: any) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const loadConversations = async () => {
    if (!user) return;

    try {
      console.log('Loading conversations for user:', user.id);
      
      const { data: userMessages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url, phone),
          recipient:profiles!messages_recipient_id_fkey(id, full_name, avatar_url, phone)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error loading messages:', messagesError);
        return;
      }

      console.log('Loaded messages:', userMessages);

      const conversationMap = new Map();
      
      userMessages?.forEach((message) => {
        const otherParticipantId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        
        if (!message.sender || !message.recipient) return;

        if (!conversationMap.has(otherParticipantId)) {
          const conversation = createConversationFromMessage(message, user.id);
          conversationMap.set(otherParticipantId, conversation);
        }
      });

      const conversationsList = Array.from(conversationMap.values());
      
      for (const conversation of conversationsList) {
        conversation.unread = await calculateUnreadCount(conversation.userId, user.id);
      }

      console.log('Final conversations list:', conversationsList);
      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
      setConversations([]);
    }
  };

  const loadMessages = async (conversationId: string) => {
    if (!user || !conversationId) return;

    try {
      console.log('Loading messages for conversation:', conversationId, 'user:', user.id);
      
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading messages:', error);
        return;
      }

      console.log('Loaded messages data:', messagesData);

      const formattedMessages: Message[] = messagesData?.map(msg => 
        formatMessageFromDB(msg, user.id)
      ) || [];

      console.log('Formatted messages:', formattedMessages);
      setMessages(formattedMessages);

      await markMessagesAsRead(conversationId, user.id);
      loadConversations();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const sendMessage = async (content: string, recipientId: string) => {
    if (!user || !recipientId) {
      console.error('Missing user or recipientId:', { user: user?.id, recipientId });
      return;
    }

    try {
      console.log('Sending message to:', recipientId, 'from:', user.id, 'content:', content);
      
      // Verify recipient exists in profiles table
      const { data: recipientProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', recipientId)
        .single();

      if (profileError || !recipientProfile) {
        console.error('Recipient not found in profiles:', profileError);
        throw new Error('Cannot send message: recipient not found');
      }

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
        throw error;
      }

      console.log('Message sent successfully:', data);

      const newMessage = formatMessageFromDB(data, user.id);
      setMessages(prev => [...prev, newMessage]);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const startConversation = async (userId: string, userName: string, userRole: string, phoneNumber?: string): Promise<string> => {
    if (!userId || userId === user?.id) {
      throw new Error('Invalid user ID for conversation');
    }

    console.log('Starting conversation with:', { userId, userName, userRole, phoneNumber });

    const existingConversation = conversations.find(conv => conv.userId === userId);
    
    if (existingConversation) {
      console.log('Found existing conversation:', existingConversation);
      return existingConversation.id;
    }

    // Verify the user exists in the profiles table
    const { data: userProfile, error } = await supabase
      .from('profiles')
      .select('id, full_name, avatar_url, phone')
      .eq('id', userId)
      .single();

    if (error || !userProfile) {
      console.error('User not found in profiles:', error);
      throw new Error('Cannot start conversation: user not found');
    }

    console.log('Found user profile:', userProfile);

    const newConversation: Conversation = {
      id: userId,
      name: userProfile.full_name || userName,
      role: userRole,
      avatar: userProfile.avatar_url || '/placeholder.svg',
      lastMessage: 'Start a conversation...',
      timestamp: 'now',
      unread: 0,
      isOnline: Math.random() > 0.5,
      userId,
      phoneNumber: userProfile.phone || phoneNumber || '+254700000000'
    };

    console.log('Created new conversation:', newConversation);
    setConversations(prev => [newConversation, ...prev]);
    return userId;
  };

  return {
    conversations,
    messages,
    loadConversations,
    loadMessages,
    sendMessage,
    startConversation
  };
};
