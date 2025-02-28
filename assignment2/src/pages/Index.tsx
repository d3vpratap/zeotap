
import React from 'react';
import { ChatProvider } from '@/context/ChatContext';
import ChatInterface from '@/components/Chat/ChatInterface';
import CDPSelector from '@/components/Chat/CDPSelector';

const Index = () => {
  return (
    <ChatProvider>
      <div className="min-h-screen flex flex-col py-8 px-4 sm:px-6 md:px-8 max-w-4xl mx-auto">
        <header className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold tracking-tight mb-2">CDP Support Agent</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ask "how-to" questions about Segment, mParticle, Lytics, and Zeotap.
          </p>
        </header>

        <CDPSelector />
        
        <div className="flex-grow">
          <ChatInterface />
        </div>
        
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>Data sourced from official documentation of Segment, mParticle, Lytics, and Zeotap.</p>
        </footer>
      </div>
    </ChatProvider>
  );
};

export default Index;
