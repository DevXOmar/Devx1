'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { EventCard, type EventData } from '@/components/EventCard';
import { CreateEventModal } from '@/components/CreateEventModal';
import { FeedbackModal } from '@/components/FeedbackModal';

// Local storage keys
const STORAGE_KEYS = {
  EVENTS: 'eventpulse_events',
  ANNOUNCEMENT: 'eventpulse_announcement',
  VERSION: 'eventpulse_version',
};

const CURRENT_VERSION = '2.0'; // Updated version for new KMIT events

export default function Home() {
  const [announcement, setAnnouncement] = useState(
    'Welcome to Event Pulse - Your hub for campus events and engagement!'
  );

  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<EventData | null>(null);

  // Load events from localStorage on mount
  useEffect(() => {
    setIsLoading(true);
    
    // Sample events to use
    const sampleEvents: EventData[] = [
      {
        id: '1',
        title: 'KMIT Evening — Saanjh',
        description: 'An evening of culture, expression, and community that brings the campus together beyond academics. Saanjh celebrates music, performances, and shared moments — creating an atmosphere where creativity, energy, and connection take center stage.',
        date: 'March 15, 2026',
        time: '05:00 PM',
        reactions: 42,
        feedback: 12,
      },
      {
        id: '2',
        title: 'Patang Utsav',
        description: 'A vibrant celebration of tradition and joy, Patang Utsav transforms the skies into a canvas of colors. Blending festivity, competition, and collective excitement, the event captures the spirit of freedom, playfulness, and cultural nostalgia.',
        date: 'March 22, 2026',
        time: '10:00 AM',
        reactions: 87,
        feedback: 23,
      },
      {
        id: '3',
        title: 'V-MUN',
        description: 'A dynamic Model United Nations experience designed to foster diplomacy, critical thinking, and impactful debate. V-MUN empowers delegates to engage with global issues, sharpen negotiation skills, and experience the intensity of real-world policymaking.',
        date: 'April 5, 2026',
        time: '09:00 AM',
        reactions: 56,
        feedback: 18,
      },
    ];
    
    // Check version
    const storedVersion = localStorage.getItem(STORAGE_KEYS.VERSION);
    const needsUpdate = storedVersion !== CURRENT_VERSION;
    
    if (needsUpdate) {
      // Force update to new events
      setEvents(sampleEvents);
      localStorage.setItem(STORAGE_KEYS.VERSION, CURRENT_VERSION);
    } else {
      // Load events from localStorage
      const storedEvents = localStorage.getItem(STORAGE_KEYS.EVENTS);
      if (storedEvents) {
        try {
          const parsedEvents = JSON.parse(storedEvents);
          setEvents(parsedEvents);
        } catch (error) {
          console.error('Failed to parse stored events:', error);
          setEvents(sampleEvents);
        }
      } else {
        // Add sample events if no events exist
        setEvents(sampleEvents);
      }
    }
    
    // Load announcement from localStorage
    const storedAnnouncement = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENT);
    if (storedAnnouncement) {
      setAnnouncement(storedAnnouncement);
    }
    
    setIsLoading(false);
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    }
  }, [events, isLoading]);

  const handleCreateEvent = useCallback((newEvent: Omit<EventData, 'id' | 'reactions' | 'feedback'>) => {
    // Generate a unique ID
    const id = Date.now().toString();
    
    // Parse the date to format it nicely
    const eventDate = new Date(newEvent.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    // Create the event
    const event: EventData = {
      id,
      title: newEvent.title,
      description: newEvent.description,
      date: formattedDate,
      time: formattedTime,
      reactions: 0,
      feedback: 0,
    };
    
    // Add to the beginning of the events array
    setEvents((prev) => [event, ...prev]);
  }, []);

  const handleReactToEvent = useCallback((eventId: string) => {
    // Update event reactions count
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
      // Update local state
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

          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">Loading events...</p>
            </div>
          ) : (
            <>
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
            </>
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
