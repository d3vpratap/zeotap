
import React from 'react';
import { CDP, useChatContext } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

const CDPSelector: React.FC = () => {
  const { selectedCDP, setSelectedCDP } = useChatContext();

  const cdps: { value: CDP; label: string }[] = [
    { value: 'all', label: 'All CDPs' },
    { value: 'segment', label: 'Segment' },
    { value: 'mparticle', label: 'mParticle' },
    { value: 'lytics', label: 'Lytics' },
    { value: 'zeotap', label: 'Zeotap' },
  ];

  return (
    <div className="flex items-center justify-center mb-6 flex-wrap gap-2">
      {cdps.map((cdp) => (
        <button
          key={cdp.value}
          onClick={() => setSelectedCDP(cdp.value)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-secondary",
            "border animate-fade-in",
            selectedCDP === cdp.value
              ? "bg-primary text-primary-foreground border-transparent"
              : "bg-background text-foreground/80 border-border hover:text-foreground"
          )}
        >
          {cdp.label}
        </button>
      ))}
    </div>
  );
};

export default CDPSelector;
