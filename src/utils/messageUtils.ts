
import { supabase } from '@/integrations/supabase/client';
import { Message, Conversation } from '@/types/messaging';

export const formatMessageFromDB = (msg: any, userId: string): Message => ({
  id: msg.id,
  senderId: msg.sender_id,
  recipientId: msg.recipient_id,
  content: msg.message,
  timestamp: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isOwn: msg.sender_id === userId,
  isRead: msg.is_read,
  bookingId: msg.booking_id
});

export const createConversationFromMessage = (message: any, userId: string): Conversation => {
  const isOwn = message.sender_id === userId;
  const otherParticipant = isOwn ? message.recipient : message.sender;
  const otherParticipantId = isOwn ? message.recipient_id : message.sender_id;
  
  return {
    id: otherParticipantId,
    name: otherParticipant?.full_name || 'Unknown User',
    role: 'User',
    avatar: otherParticipant?.avatar_url || '/placeholder.svg',
    lastMessage: message.message,
    timestamp: new Date(message.created_at).toLocaleString(),
    unread: 0,
    isOnline: Math.random() > 0.5,
    userId: otherParticipantId,
    phoneNumber: otherParticipant?.phone || '+254700000000'
  };
};

export const calculateUnreadCount = async (conversationId: string, userId: string): Promise<number> => {
  const { count } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('sender_id', conversationId)
    .eq('recipient_id', userId)
    .eq('is_read', false);
  
  return count || 0;
};

export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
  await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('sender_id', conversationId)
    .eq('recipient_id', userId)
    .eq('is_read', false);
};
