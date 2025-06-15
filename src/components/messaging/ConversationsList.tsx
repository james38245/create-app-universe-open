
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles } from 'lucide-react';
import { Conversation } from '@/types/messaging';
import GoodStartFeature from '@/components/messaging/GoodStartFeature';

interface ConversationsListProps {
  conversations: Conversation[];
  selectedChat: string | null;
  showGoodStart: boolean;
  onSelectChat: (chatId: string) => void;
  onToggleGoodStart: () => void;
  onStartConversation: (userId: string, userName: string, userRole: string) => Promise<void>;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  selectedChat,
  showGoodStart,
  onSelectChat,
  onToggleGoodStart,
  onStartConversation
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation =>
    conversation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
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
                onClick={onToggleGoodStart}
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
          <Input 
            placeholder="Search conversations..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {showGoodStart ? (
          <div className="p-4">
            <GoodStartFeature onStartConversation={onStartConversation} />
          </div>
        ) : (
          <div className="space-y-1">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectChat(conversation.id)}
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

            {filteredConversations.length === 0 && searchTerm && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No conversations found for "{searchTerm}"</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchTerm('')}
                  className="mt-2"
                >
                  Clear Search
                </Button>
              </div>
            )}

            {conversations.length === 0 && !showGoodStart && (
              <div className="p-8 text-center text-muted-foreground">
                <p>No conversations yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onToggleGoodStart}
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
  );
};

export default ConversationsList;
