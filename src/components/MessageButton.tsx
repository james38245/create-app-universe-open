
import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMessaging } from '@/hooks/useMessaging';
import { useAuth } from '@/hooks/useAuth';

interface MessageButtonProps {
  recipientId: string;
  recipientName: string;
  recipientRole: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  className?: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({
  recipientId,
  recipientName,
  recipientRole,
  variant = 'outline',
  size = 'sm',
  className = ''
}) => {
  const navigate = useNavigate();
  const { startConversation, setSelectedChat } = useMessaging();
  const { user } = useAuth();

  const handleMessage = async () => {
    if (!user) {
      // Redirect to auth if not logged in
      navigate('/');
      return;
    }

    try {
      const conversationId = await startConversation(recipientId, recipientName, recipientRole);
      setSelectedChat(conversationId);
      navigate('/messages');
    } catch (error) {
      console.error('Error starting conversation:', error);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleMessage}
      className={`flex items-center gap-2 ${className}`}
    >
      <MessageSquare className="h-4 w-4" />
      Message
    </Button>
  );
};

export default MessageButton;
