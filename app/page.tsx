'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { EventCard, type EventData } from '@/components/EventCard';
import { CreateEventModal } from '@/components/CreateEventModal';
import { FeedbackModal } from '@/components/FeedbackModal';

export default function Home() {
  const [announcement, setAnnouncement] = useState(
    'Welcome to Event Pulse - Your hub for campus events and engagement!'
  );

  const [events, setEvents] = useState<EventData[]>([
    {
      id: '1',
      title: 'Spring Career Fair 2024',
      description: 'Meet top employers and explore internship opportunities with leading companies.',
      date: 'March 15, 2024',
      time: '10:00 AM',
      reactions: 24,
      feedback: 8,
    },
    {
      id: '2',
      title: 'Campus Sustainability Summit',
      description: 'Join us for discussions on environmental initiatives and climate action.',
      date: 'March 22, 2024',
      time: '2:00 PM',
      reactions: 18,
      feedback: 5,
    },
    {
      id: '3',
      title: 'Student Leadership Conference',
      description: 'Develop leadership skills and network with student leaders from across campus.',
      date: 'April 5, 2024',
      time: '9:00 AM',
      reactions: 31,
      feedback: 12,
    },
    {
      id: '4',
      title: 'Arts & Culture Week',
      description: 'Celebrate diversity through music, art, dance, and cultural performances.',
      date: 'April 12, 2024',
      time: '6:00 PM',
      reactions: 42,
      feedback: 15,
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<EventData | null>(null);

  const handleCreateEvent = useCallback((newEvent: Omit<EventData, 'id' | 'reactions' | 'feedback'>) => {
    const event: EventData = {
      ...newEvent,
      id: Date.now().toString(),
      reactions: 0,
      feedback: 0,
    };
    setEvents((prev) => [event, ...prev]);
  }, []);

  const handleReactToEvent = useCallback((eventId: string) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === eventId
          ? { ...event, reactions: event.reactions + 1 }
          : event
      )
    );
  }, []);

  const handleOpenFeedback = useCallback((eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEventForFeedback(event);
      setIsFeedbackModalOpen(true);
    }
  }, [events]);

  const handleSubmitFeedback = useCallback((feedbackText: string) => {
    if (selectedEventForFeedback) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === selectedEventForFeedback.id
            ? { ...event, feedback: event.feedback + 1 }
            : event
        )
      );
    }
  }, [selectedEventForFeedback]);

  return (
    <div className="min-h-screen bg-background text-foreground dark">
      {/* Announcement Banner */}
      <AnnouncementBanner
        initialText={announcement}
        onUpdate={setAnnouncement}
      />

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground">
                Event Pulse
              </h1>
              <p className="text-lg text-muted-foreground">
                Discover, engage, and connect with campus events
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-glow flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus size={20} />
              Create Event
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
            <div className="glass-dark glow-border-hover rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-accent">{events.length}</div>
              <div className="text-sm text-muted-foreground mt-2">Upcoming Events</div>
            </div>
            <div className="glass-dark glow-border-hover rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                {events.reduce((sum, e) => sum + e.reactions, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Total Reactions</div>
            </div>
            <div className="glass-dark glow-border-hover rounded-xl p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                {events.reduce((sum, e) => sum + e.feedback, 0)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">Feedback Items</div>
            </div>
          </div>

          {/* Events Grid */}
          <div className="space-y-2 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Upcoming Events</h2>
            <p className="text-muted-foreground">Browse and engage with campus events</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onReact={handleReactToEvent}
                onFeedback={handleOpenFeedback}
              />
            ))}
          </div>

          {events.length === 0 && (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                No events yet. Be the first to create one!
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-glow"
              >
                <Plus size={20} className="inline mr-2" />
                Create Event
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <FeedbackModal
        isOpen={isFeedbackModalOpen}
        eventTitle={selectedEventForFeedback?.title}
        onClose={() => {
          setIsFeedbackModalOpen(false);
          setSelectedEventForFeedback(null);
        }}
        onSubmit={handleSubmitFeedback}
      />
    </div>
  );
}
