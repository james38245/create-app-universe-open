
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Search, Phone, MoreVertical } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useToast } from '@/hooks/use-toast';

const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const [newMessage, setNewMessage] = useState('');
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
    
    // Mock phone number - in real app, this would come from user profile
    const phoneNumber = "+254700000000"; // Example Kenyan number
    
    // Create tel: link to initiate phone call
    const telLink = `tel:${phoneNumber}`;
    
    // For mobile devices, this will open the phone app
    window.location.href = telLink;
    
    toast({
      title: "Initiating Voice Call",
      description: `Calling ${selectedConversation.name} at ${phoneNumber}`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="pt-16 md:pt-0 pb-20 md:pb-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
            
            {/* Conversations List */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Messages
                  <Badge variant="secondary">{conversations.length}</Badge>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="space-y-1">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedChat(conversation.id)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
                        selectedChat === conversation.id ? 'bg-muted' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={conversation.avatar} alt={conversation.name} />
                            <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {conversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-medium truncate">{conversation.name}</h4>
                            <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground truncate mb-1">
                            {conversation.lastMessage}
                          </p>
                          <p className="text-xs text-muted-foreground">{conversation.role}</p>
                        </div>
                        
                        {conversation.unread > 0 && (
                          <Badge variant="default" className="text-xs">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={selectedConversation.avatar} alt={selectedConversation.name} />
                            <AvatarFallback>{selectedConversation.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {selectedConversation.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{selectedConversation.name}</h3>
                          <p className="text-sm text-muted-foreground">{selectedConversation.role}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={handleVoiceCall}
                          title="Voice Call (will open phone app)"
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Messages */}
                  <CardContent className="flex-1 overflow-y-auto p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              message.isOwn
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <span className="text-xs opacity-70 mt-1 block">
                              {message.timestamp}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  {/* Message Input */}
                  <Separator />
                  <div className="p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="flex-1"
                      />
                      <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
                    <p className="text-muted-foreground">Choose a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
