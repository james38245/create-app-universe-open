
import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Check, CheckCheck } from 'lucide-react';
import { Message } from '@/types/messaging';

interface MessagesListProps {
  messages: Message[];
}

const MessagesList: React.FC<MessagesListProps> = ({ messages }) => {
  return (
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
  );
};

export default MessagesList;
