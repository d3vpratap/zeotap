
import React, { useState, useRef, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import ChatMessage from './ChatMessage';
import { cn } from '@/lib/utils';
import { ArrowUp, Loader2, Trash2 } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const { messages, isLoading, sendMessage, clearChat } = useChatContext();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      setInput('');
      // Focus the input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-12rem)] bg-card rounded-xl shadow-sm border overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-medium">CDP Assistant</h2>
        <button
          onClick={clearChat}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
          aria-label="Clear chat"
          title="Clear chat history"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center space-x-2 p-3 bg-secondary rounded-2xl rounded-tl-none w-fit animate-pulse">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-200" />
                <div className="w-2 h-2 rounded-full bg-muted-foreground/50 animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about a CDP feature..."
            className={cn(
              "w-full py-3 px-4 pr-12 rounded-xl border focus:ring-2 focus:ring-primary/20",
              "bg-background resize-none min-h-[56px] max-h-[150px] transition-all duration-200",
              "focus:outline-none"
            )}
            rows={1}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={cn(
              "absolute right-3 p-2 rounded-full text-white",
              "transition-all duration-200",
              input.trim() && !isLoading
                ? "bg-primary hover:bg-primary/90"
                : "bg-primary/60 cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowUp className="w-4 h-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
