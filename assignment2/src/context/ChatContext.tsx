
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';

export type CDP = 'segment' | 'mparticle' | 'lytics' | 'zeotap' | 'all';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  cdp?: CDP;
}

interface ChatContextType {
  messages: ChatMessage[];
  selectedCDP: CDP;
  isLoading: boolean;
  setSelectedCDP: (cdp: CDP) => void;
  sendMessage: (text: string) => void;
  clearChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

// Generate a unique ID for messages
const generateId = () => Math.random().toString(36).substring(2, 11);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: generateId(),
      text: "Hello! I'm your CDP assistant. I can help with questions about Segment, mParticle, Lytics, and Zeotap. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [selectedCDP, setSelectedCDP] = useState<CDP>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Load messages from localStorage on initial render
  useEffect(() => {
    const savedMessages = localStorage.getItem('cdp-chat-messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('cdp-chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: generateId(),
        text: "Hello! I'm your CDP assistant. I can help with questions about Segment, mParticle, Lytics, and Zeotap. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
    localStorage.removeItem('cdp-chat-messages');
  }, []);

  const mockResponse = useCallback((text: string, cdp: CDP): string => {
    // Simple mock responses based on user query and selected CDP
    const lowerText = text.toLowerCase();
    
    // Check if question is not related to CDPs
    if (!lowerText.includes('segment') && 
        !lowerText.includes('mparticle') && 
        !lowerText.includes('lytics') && 
        !lowerText.includes('zeotap') &&
        !lowerText.includes('cdp') &&
        !lowerText.includes('customer data') &&
        !lowerText.includes('data platform') &&
        !lowerText.includes('how do i') &&
        !lowerText.includes('how can i') &&
        !lowerText.includes('how to')) {
      return "I'm specifically designed to answer questions about Customer Data Platforms: Segment, mParticle, Lytics, and Zeotap. Could you please ask something related to these platforms?";
    }
    
    if (lowerText.includes('segment') || (cdp === 'segment' && cdp !== 'all')) {
      if (lowerText.includes('source') || lowerText.includes('set up')) {
        return "To set up a new source in Segment:\n\n1. Navigate to the Segment dashboard\n2. Click on 'Sources' in the left sidebar\n3. Click the 'Add Source' button\n4. Select your source type from the catalog\n5. Follow the on-screen configuration instructions\n6. Save your new source configuration";
      }
      if (lowerText.includes('audience') || lowerText.includes('segment')) {
        return "Creating audience segments in Segment:\n\n1. Go to the 'Personas' section in your Segment workspace\n2. Click on 'Audiences' in the left navigation\n3. Select 'Create New Audience'\n4. Define your audience criteria using traits and events\n5. Name your audience and click 'Create'";
      }
      return "Segment is a customer data platform that helps you collect, clean, and control your customer data. What specific feature or task would you like to know about?";
    }
    
    if (lowerText.includes('mparticle') || (cdp === 'mparticle' && cdp !== 'all')) {
      if (lowerText.includes('profile') || lowerText.includes('user')) {
        return "To create a user profile in mParticle:\n\n1. Access your mParticle dashboard\n2. Navigate to the 'Audiences' section\n3. Use the 'User Lookup' tool to find or create a user\n4. Add user attributes and identities as needed\n5. Save the user profile configuration";
      }
      if (lowerText.includes('audience') || lowerText.includes('segment')) {
        return "Creating audience segments in mParticle:\n\n1. Go to the 'Audiences' section in your mParticle dashboard\n2. Click 'Create Audience'\n3. Define your audience criteria using the audience builder\n4. Configure output settings for your audience\n5. Save and activate your audience";
      }
      return "mParticle is a customer data platform that provides multi-screen customer data and analytics. What specific feature or task would you like to know about?";
    }
    
    if (lowerText.includes('lytics') || (cdp === 'lytics' && cdp !== 'all')) {
      if (lowerText.includes('audience') || lowerText.includes('segment')) {
        return "To build an audience segment in Lytics:\n\n1. Navigate to 'Audiences' in your Lytics account\n2. Click 'Create Audience'\n3. Use the audience builder to define segment criteria\n4. Select user behaviors, properties, or existing segments\n5. Name your audience and save it\n6. Activate the audience to your desired destinations";
      }
      if (lowerText.includes('campaign') || lowerText.includes('personalization')) {
        return "Setting up personalization in Lytics:\n\n1. Go to 'Campaigns' in your Lytics dashboard\n2. Click 'Create Campaign'\n3. Select your campaign type (web, email, etc.)\n4. Define your audience targeting\n5. Create your personalized content variations\n6. Set campaign goals and activate";
      }
      return "Lytics is a customer data platform focused on building customer profiles and powering real-time marketing. What specific feature or task would you like to know about?";
    }
    
    if (lowerText.includes('zeotap') || (cdp === 'zeotap' && cdp !== 'all')) {
      if (lowerText.includes('integrate') || lowerText.includes('integration')) {
        return "To integrate your data with Zeotap:\n\n1. Log in to your Zeotap CDP dashboard\n2. Navigate to 'Sources' in the data section\n3. Select 'Add New Source'\n4. Choose your integration type (API, batch upload, native connector)\n5. Follow the configuration workflow for your chosen integration\n6. Map your data fields to Zeotap's data model\n7. Test and activate your integration";
      }
      if (lowerText.includes('audience') || lowerText.includes('segment')) {
        return "Creating audiences in Zeotap:\n\n1. Go to the 'Audiences' section in Zeotap\n2. Click 'Create New Audience'\n3. Use the audience builder to define your segment rules\n4. Add conditions based on user attributes, events, or other criteria\n5. Preview your audience size and composition\n6. Name and save your audience";
      }
      return "Zeotap is a customer intelligence platform that helps brands better understand their customers and predict behaviors. What specific feature or task would you like to know about?";
    }
    
    if (lowerText.includes('compare') || lowerText.includes('difference')) {
      return "When comparing Segment, mParticle, Lytics, and Zeotap:\n\n• Segment excels at data collection and integration with over 300 tools, making it great for developers and engineering teams.\n\n• mParticle focuses on mobile-first strategy with strong identity resolution and real-time processing.\n\n• Lytics differentiates with its machine learning capabilities for predictive modeling and content affinity.\n\n• Zeotap specializes in identity resolution and has strong compliance features for regulated industries.\n\nFor more specific comparisons between two platforms, please ask about particular features you'd like to compare.";
    }
    
    return "I can help you with how-to questions for Segment, mParticle, Lytics, and Zeotap. Please specify which platform and what task you'd like to accomplish.";
  }, []);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const responseText = mockResponse(text, selectedCDP);
      
      const botMessage: ChatMessage = {
        id: generateId(),
        text: responseText,
        sender: 'bot',
        timestamp: new Date(),
        cdp: selectedCDP,
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  }, [selectedCDP, mockResponse]);

  const value = {
    messages,
    selectedCDP,
    isLoading,
    setSelectedCDP,
    sendMessage,
    clearChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
