'use client';

import { useState } from 'react';
import { Heart, MessageCircle, Share2, Calendar, Clock } from 'lucide-react';

export interface EventData {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  reactions: number;
  feedback: number;
}

interface EventCardProps {
  event: EventData;
  onReact?: (eventId: string) => void;
  onFeedback?: (eventId: string) => void;
}

export function EventCard({ event, onReact, onFeedback }: EventCardProps) {
  const [hasReacted, setHasReacted] = useState(false);

  const handleReact = () => {
    setHasReacted(!hasReacted);
    onReact?.(event.id);
  };

  return (
    <div className="glass-dark glow-border-hover group rounded-xl p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-accent transition-all duration-300 ease-in-out">
          {event.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {event.description}
        </p>
      </div>

      {/* Date & Time */}
      <div className="flex items-center gap-4 pt-2 border-t border-border/50">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={16} className="text-primary" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock size={16} className="text-accent" />
          <span>{event.time}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 mt-auto">
        <button
          onClick={handleReact}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 ease-in-out ${
            hasReacted
              ? 'bg-primary/20 text-accent'
              : 'bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-accent'
          }`}
          aria-label="React to event"
        >
          <Heart
            size={18}
            fill={hasReacted ? 'currentColor' : 'none'}
          />
          <span className="text-sm font-medium">{event.reactions}</span>
        </button>

        <button
          onClick={() => onFeedback?.(event.id)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 ease-in-out"
          aria-label="Give feedback"
        >
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{event.feedback}</span>
        </button>

        <button
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 ease-in-out"
          aria-label="Share event"
        >
          <Share2 size={18} />
        </button>
      </div>
    </div>
  );
}
