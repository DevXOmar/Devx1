'use client';

import { useState } from 'react';
import { X, Check } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  eventTitle?: string;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

export function FeedbackModal({ isOpen, eventTitle, onClose, onSubmit }: FeedbackModalProps) {
  const [feedback, setFeedback] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      onSubmit(feedback);
      setIsSubmitted(true);
      setTimeout(() => {
        setFeedback('');
        setIsSubmitted(false);
        onClose();
      }, 1500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="glass-dark glow-border w-full max-w-md mx-4 rounded-xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Share Feedback</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-300 ease-in-out"
            aria-label="Close modal"
            disabled={isSubmitted}
          >
            <X size={20} />
          </button>
        </div>

        {/* Subtitle */}
        {eventTitle && (
          <p className="text-sm text-muted-foreground">
            Feedback for: <span className="text-accent font-medium">{eventTitle}</span>
          </p>
        )}

        {isSubmitted ? (
          /* Success State */
          <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Check size={24} className="text-primary" />
            </div>
            <p className="text-foreground font-medium">Thank you for your feedback!</p>
            <p className="text-sm text-muted-foreground">Your input helps us improve.</p>
          </div>
        ) : (
          /* Form State */
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              placeholder="Tell us what you think about this event..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-secondary text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ease-in-out resize-none"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 font-medium transition-all duration-300 ease-in-out"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!feedback.trim()}
                className="flex-1 btn-glow disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
