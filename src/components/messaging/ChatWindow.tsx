
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { Conversation, Message } from '@/types/messaging';
import ChatHeader from './ChatHeader';
import MessagesList from './MessagesList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  selectedConversation: Conversation | undefined;
  messages: Message[];
  newMessage: string;
  conversations: Conversation[];
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onVoiceCall: () => void;
  onShowGoodStart: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  selectedConversation,
  messages,
  newMessage,
  conversations,
  onMessageChange,
  onSendMessage,
  onVoiceCall,
  onShowGoodStart
}) => {
  return (
    <Card className="lg:col-span-2 flex flex-col">
      {selectedConversation ? (
        <>
          <ChatHeader conversation={selectedConversation} onVoiceCall={onVoiceCall} />
          <MessagesList messages={messages} />
          <MessageInput 
            newMessage={newMessage}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-muted-foreground mb-4">Choose a conversation to start messaging</p>
            {conversations.length === 0 && (
              <Button
                variant="outline"
                onClick={onShowGoodStart}
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
  );
};

export default ChatWindow;
