import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Search, Phone, MoreVertical, Check, CheckCheck, Sparkles } from 'lucide-react';
import { useMessaging } from '@/hooks/useMessaging';
import { useToast } from '@/hooks/use-toast';
import GoodStartFeature from '@/components/messaging/GoodStartFeature';

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
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{conversations.length}</Badge>
                    {conversations.length === 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowGoodStart(!showGoodStart)}
                        className="flex items-center gap-1"
                      >
                        <Sparkles className="h-4 w-4" />
                        Good Start
                      </Button>
                    )}
                  </div>
                </CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search conversations..." className="pl-10" />
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                {showGoodStart ? (
                  <div className="p-4">
                    <GoodStartFeature onStartConversation={handleGoodStartConversation} />
                  </div>
                ) : (
                  <div className="space-y-1">
                    {conversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        onClick={() => setSelectedChat(conversation.id)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
                          selectedChat === conversation.id ? 'bg-muted' : ''
                        } ${conversation.unread > 0 ? 'border-l-4 border-l-primary' : ''}`}
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
                              <h4 className={`font-medium truncate ${conversation.unread > 0 ? 'font-semibold' : ''}`}>
                                {conversation.name}
                              </h4>
                              <span className={`text-xs ${conversation.unread > 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                {conversation.timestamp}
                              </span>
                            </div>
                            <p className={`text-sm truncate mb-1 ${conversation.unread > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                              {conversation.lastMessage}
                            </p>
                            <p className="text-xs text-muted-foreground">{conversation.role}</p>
                          </div>
                          
                          {conversation.unread > 0 && (
                            <Badge variant="default" className="text-xs bg-primary">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}

                    {conversations.length === 0 && !showGoodStart && (
                      <div className="p-8 text-center text-muted-foreground">
                        <p>No conversations yet</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowGoodStart(true)}
                          className="mt-2 flex items-center gap-1"
                        >
                          <Sparkles className="h-4 w-4" />
                          Get Started
                        </Button>
                      </div>
                    )}
                  </div>
                )}
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
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs opacity-70">
                                {message.timestamp}
                              </span>
                              {message.isOwn && (
                                <div className="ml-2">
                                  {message.isRead ? (
                                    <CheckCheck className="h-3 w-3 opacity-70" />
                                  ) : (
                                    <Check className="h-3 w-3 opacity-70" />
                                  )}
                                </div>
                              )}
                            </div>
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
                    <p className="text-muted-foreground mb-4">Choose a conversation to start messaging</p>
                    {conversations.length === 0 && (
                      <Button
                        variant="outline"
                        onClick={() => setShowGoodStart(true)}
                        className="flex items-center gap-2"
                      >
                        <Sparkles className="h-4 w-4" />
                        Get Started with Good Start
                      </Button>
                    )}
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
