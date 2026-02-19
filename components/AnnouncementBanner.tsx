'use client';

import { useState, useEffect } from 'react';
import { Pencil, Check, X } from 'lucide-react';

interface AnnouncementBannerProps {
  initialText: string;
  onUpdate?: (text: string) => void;
}

export function AnnouncementBanner({ initialText, onUpdate }: AnnouncementBannerProps) {
  const [text, setText] = useState(initialText);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(text);

  useEffect(() => {
    setText(initialText);
    setEditValue(initialText);
  }, [initialText]);

  const handleSave = () => {
    setText(editValue);
    onUpdate?.(editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(text);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="w-full bg-card/80 backdrop-blur-md border-b border-border px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Update announcement..."
            autoFocus
          />
          <button
            onClick={handleSave}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 ease-in-out"
            aria-label="Save announcement"
          >
            <Check size={18} />
          </button>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-all duration-300 ease-in-out"
            aria-label="Cancel editing"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-40 overflow-hidden">
      <div className="flex items-center gap-4 px-6 py-4 h-16">
        <div className="flex-1 overflow-hidden">
          <div className="animate-scroll whitespace-nowrap">
            <span className="inline-block text-sm font-medium text-accent glow-text pr-8">
              📢 {text}
            </span>
            <span className="inline-block text-sm font-medium text-accent glow-text pr-8">
              📢 {text}
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 ease-in-out flex-shrink-0"
          aria-label="Edit announcement"
        >
          <Pencil size={18} />
        </button>
      </div>
    </div>
  );
}
