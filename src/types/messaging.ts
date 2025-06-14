
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  isRead: boolean;
  bookingId?: string;
}

export interface Conversation {
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

export interface MessagingContextType {
  conversations: Conversation[];
  messages: Message[];
  selectedChat: string | null;
  setSelectedChat: (chatId: string | null) => void;
  sendMessage: (content: string, recipientId: string) => Promise<void>;
  startConversation: (userId: string, userName: string, userRole: string, phoneNumber?: string) => Promise<string>;
  loadMessages: (conversationId: string) => Promise<void>;
}
