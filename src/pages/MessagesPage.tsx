
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useMessaging } from '@/hooks/useMessaging';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ConversationsList from '@/components/messaging/ConversationsList';
import ChatWindow from '@/components/messaging/ChatWindow';
import { Conversation, Message } from '@/types/messaging';

const MessagesPage = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    isLoading, 
    loadConversations, 
    loadMessages, 
    sendMessage: sendMessageHandler, 
    startConversation 
  } = useMessaging();
  
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await loadMessages(conversation.id);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    await sendMessageHandler(newMessage, selectedConversation.userId);
    setNewMessage('');
  };

  const handleBackToList = () => {
    setSelectedConversation(null);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
          <div className="max-w-7xl mx-auto p-4 md:p-6">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Please sign in to view messages</h1>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">
              Chat with clients and service providers
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Mobile back button */}
            {selectedConversation && (
              <div className="lg:hidden mb-4">
                <Button 
                  variant="ghost" 
                  onClick={handleBackToList}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to conversations
                </Button>
              </div>
            )}

            {/* Conversations List */}
            <div className={`lg:col-span-1 ${selectedConversation ? 'hidden lg:block' : ''}`}>
              <Card className="h-full">
                <ConversationsList
                  conversations={conversations}
                  selectedConversation={selectedConversation}
                  onConversationSelect={handleConversationSelect}
                  isLoading={isLoading}
                />
              </Card>
            </div>

            {/* Chat Window */}
            <div className={`lg:col-span-2 ${!selectedConversation ? 'hidden lg:block' : ''}`}>
              <Card className="h-full">
                <ChatWindow
                  selectedConversation={selectedConversation}
                  messages={messages}
                  newMessage={newMessage}
                  onMessageChange={setNewMessage}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
