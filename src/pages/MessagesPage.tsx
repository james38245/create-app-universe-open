
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessagingOperations } from '@/hooks/useMessagingOperations';
import ConversationsList from '@/components/messaging/ConversationsList';
import ChatWindow from '@/components/messaging/ChatWindow';

const MessagesPage = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [showGoodStart, setShowGoodStart] = useState(false);

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

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
    loadMessages(chatId);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    try {
      await sendMessage(newMessage, selectedChat);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleStartConversation = async (userId: string, userName: string, userRole: string) => {
    try {
      const conversationId = await startConversation(userId, userName, userRole);
      setSelectedChat(conversationId);
      setShowGoodStart(false);
      loadMessages(conversationId);
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  const handleVoiceCall = () => {
    const selectedConversation = conversations.find(conv => conv.userId === selectedChat);
    if (selectedConversation) {
      const phoneNumber = selectedConversation.phoneNumber || '+254700000000';
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const selectedConversation = conversations.find(conv => conv.userId === selectedChat);

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
            <ConversationsList
              conversations={conversations}
              selectedChat={selectedChat}
              showGoodStart={showGoodStart}
              onSelectChat={handleSelectChat}
              onToggleGoodStart={() => setShowGoodStart(!showGoodStart)}
              onStartConversation={handleStartConversation}
            />
            
            <ChatWindow
              selectedConversation={selectedConversation}
              messages={messages}
              newMessage={newMessage}
              conversations={conversations}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onVoiceCall={handleVoiceCall}
              onShowGoodStart={() => setShowGoodStart(true)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
