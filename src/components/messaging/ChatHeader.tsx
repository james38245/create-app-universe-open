
import React from 'react';
import { CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Phone, MoreVertical } from 'lucide-react';
import { Conversation } from '@/types/messaging';

interface ChatHeaderProps {
  conversation: Conversation;
  onVoiceCall: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ conversation, onVoiceCall }) => {
  const handleCall = () => {
    const phoneNumber = conversation.phoneNumber || '+254700000000';
    // Open phone dialer with the user's registered contact number
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <CardHeader className="border-b">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={conversation.avatar} alt={conversation.name} />
              <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {conversation.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-semibold">{conversation.name}</h3>
            <p className="text-sm text-muted-foreground">{conversation.role}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleCall}
            title={`Call ${conversation.phoneNumber || '+254700000000'}`}
          >
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default ChatHeader;
