
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

      setConversations(conversationsList);
    } catch (error) {
      console.error('Error loading conversations:', error);
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

      const formattedMessages: Message[] = messagesData?.map(msg => 
        formatMessageFromDB(msg, user.id)
      ) || [];

      setMessages(formattedMessages);

      await markMessagesAsRead(conversationId, user.id);
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

      const newMessage = formatMessageFromDB(data, user.id);
      setMessages(prev => [...prev, newMessage]);
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const startConversation = async (userId: string, userName: string, userRole: string, phoneNumber?: string): Promise<string> => {
    const existingConversation = conversations.find(conv => conv.userId === userId);
    
    if (existingConversation) {
      return existingConversation.id;
    }

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

  return {
    conversations,
    messages,
    loadConversations,
    loadMessages,
    sendMessage,
    startConversation
  };
};
