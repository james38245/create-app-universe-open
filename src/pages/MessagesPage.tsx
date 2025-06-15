
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMessaging } from '@/hooks/useMessaging';
import { useToast } from '@/hooks/use-toast';
import ConversationsList from '@/components/messaging/ConversationsList';
import ChatWindow from '@/components/messaging/ChatWindow';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const [newMessage, setNewMessage] = useState('');
  const [showGoodStart, setShowGoodStart] = useState(false);
  const { toast } = useToast();
  const {
    conversations,
    messages,
    selectedChat,
    setSelectedChat,
    sendMessage,
    loadMessages,
    startConversation
  } = useMessaging();

  // Check if user is new (no conversations) to show Good Start feature
  useEffect(() => {
    setShowGoodStart(conversations.length === 0);
  }, [conversations]);

  // Handle URL parameters for starting conversations
  useEffect(() => {
    const userId = searchParams.get('user');
    const userName = searchParams.get('name');
    const userRole = searchParams.get('role');

    if (userId && userName && userRole) {
      const initConversation = async () => {
        const conversationId = await startConversation(userId, userName, userRole);
        setSelectedChat(conversationId);
      };
      initConversation();
    }
  }, [searchParams, startConversation, setSelectedChat]);

  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat);
    }
  }, [selectedChat, loadMessages]);

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      await sendMessage(newMessage, selectedConversation.userId);
      setNewMessage('');
    }
  };

  const handleVoiceCall = () => {
    if (!selectedConversation) return;
    
    const phoneNumber = selectedConversation.phoneNumber || "+254700000000";
    const telLink = `tel:${phoneNumber}`;
    window.location.href = telLink;
    
    toast({
      title: "Initiating Voice Call",
      description: `Calling ${selectedConversation.name} at ${phoneNumber}`,
    });
  };

  const handleGoodStartConversation = async (sellerId: string, sellerName: string, sellerRole: string) => {
    const conversationId = await startConversation(sellerId, sellerName, sellerRole);
    setSelectedChat(conversationId);
    setShowGoodStart(false);
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChat(chatId);
  };

  const handleToggleGoodStart = () => {
    setShowGoodStart(!showGoodStart);
  };

  const handleShowGoodStart = () => {
    setShowGoodStart(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            <ConversationsList
              conversations={conversations}
              selectedChat={selectedChat}
              showGoodStart={showGoodStart}
              onSelectChat={handleSelectChat}
              onToggleGoodStart={handleToggleGoodStart}
              onStartConversation={handleGoodStartConversation}
            />
            
            <ChatWindow
              selectedConversation={selectedConversation}
              messages={messages}
              newMessage={newMessage}
              conversations={conversations}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              onVoiceCall={handleVoiceCall}
              onShowGoodStart={handleShowGoodStart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
