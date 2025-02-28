
import React from 'react';
import { cn } from '@/lib/utils';
import { ChatMessage as ChatMessageType } from '@/context/ChatContext';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const formattedTime = new Intl.DateTimeFormat('en', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(message.timestamp);

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-secondary text-secondary-foreground rounded-tl-none",
          "shadow-sm"
        )}
      >
        {!isUser && message.cdp && message.cdp !== 'all' && (
          <div className="mb-1">
            <span className="inline-block px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground font-medium capitalize">
              {message.cdp}
            </span>
          </div>
        )}
        <div className="whitespace-pre-line text-sm md:text-base">
          {message.text}
        </div>
        <div className="text-xs opacity-70 text-right mt-1">
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
