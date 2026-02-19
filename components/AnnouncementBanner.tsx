'use client';

import { useState, useEffect } from 'react';

interface AnnouncementBannerProps {
  initialText: string;
  onUpdate?: (text: string) => void;
}

export function AnnouncementBanner({ initialText }: AnnouncementBannerProps) {
  const [text, setText] = useState(initialText);

  useEffect(() => {
    setText(initialText);
  }, [initialText]);

  return (
    <div className="w-full bg-gradient-to-r from-card/80 via-card/90 to-card/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-40 overflow-hidden">
      <div className="flex items-center py-3.5">
        <div className="w-full overflow-hidden">
          <div className="animate-scroll-banner inline-flex whitespace-nowrap">
            <span className="inline-flex items-center text-base font-semibold text-accent glow-text px-16">
              📢 {text}
            </span>
            <span className="inline-flex items-center text-primary/40 px-4">•</span>
            <span className="inline-flex items-center text-base font-semibold text-accent glow-text px-16">
              📢 {text}
            </span>
            <span className="inline-flex items-center text-primary/40 px-4">•</span>
          </div>
        </div>
      </div>
    </div>
  );
}
