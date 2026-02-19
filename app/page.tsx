'use client';

import { useState, useCallback, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';
import { EventCard, type EventData } from '@/components/EventCard';
import { CreateEventModal } from '@/components/CreateEventModal';
import { FeedbackModal } from '@/components/FeedbackModal';
import { eventApi, reactionApi, feedbackApi, announcementApi, type Event, type Reactions } from '@/lib/api';

export default function Home() {
  const [announcement, setAnnouncement] = useState(
    'Welcome to Event Pulse - Your hub for campus events and engagement!'
  );

  const [events, setEvents] = useState<EventData[]>([]);
  const [eventReactions, setEventReactions] = useState<Map<string, Reactions>>(new Map());
  const [eventFeedbackCounts, setEventFeedbackCounts] = useState<Map<string, number>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [selectedEventForFeedback, setSelectedEventForFeedback] = useState<EventData | null>(null);

  // Fetch events and announcement on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch events
        const eventsData = await eventApi.list();
        
        // Fetch reactions for each event
        const reactionsPromises = eventsData.map(e => reactionApi.get(e.id));
        const reactionsData = await Promise.all(reactionsPromises);
        
        // Fetch feedback counts for each event
        const feedbackPromises = eventsData.map(e => feedbackApi.listByEvent(e.id));
        const feedbackData = await Promise.all(feedbackPromises);
        
        // Convert to EventData format
        const eventDataList: EventData[] = eventsData.map((event, index) => {
          const reactions = reactionsData[index];
          const totalReactions = Object.values(reactions.reactions).reduce((sum, count) => sum + count, 0);
          const feedbackCount = feedbackData[index].length;
          
          return {
            id: event.id.toString(),
            title: event.title,
            description: event.description,
            date: new Date(event.date).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }),
            time: new Date(event.date).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            }),
            reactions: totalReactions,
            feedback: feedbackCount,
          };
        });
        
        setEvents(eventDataList);
        
        // Store reactions for each event
        const reactionsMap = new Map<string, Reactions>();
        reactionsData.forEach((r) => {
          reactionsMap.set(r.event_id.toString(), r);
        });
        setEventReactions(reactionsMap);
        
        // Store feedback counts
        const feedbackMap = new Map<string, number>();
        feedbackData.forEach((feedbacks, index) => {
          feedbackMap.set(eventsData[index].id.toString(), feedbacks.length);
        });
        setEventFeedbackCounts(feedbackMap);
        
        // Fetch announcement
        const announcementData = await announcementApi.get();
        if (announcementData.message) {
          setAnnouncement(announcementData.message);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleCreateEvent = useCallback(async (newEvent: Omit<EventData, 'id' | 'reactions' | 'feedback'>) => {
    try {
      // Create the event in the backend
      const createdEvent = await eventApi.create({
        title: newEvent.title,
        description: newEvent.description,
        date: new Date(newEvent.date).toISOString(),
      });
      
      // Fetch reactions for the new event
      const reactions = await reactionApi.get(createdEvent.id);
      
      // Convert to EventData format
      const event: EventData = {
        id: createdEvent.id.toString(),
        title: createdEvent.title,
        description: createdEvent.description,
        date: new Date(createdEvent.date).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        time: new Date(createdEvent.date).toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        reactions: 0,
        feedback: 0,
      };
      
      setEvents((prev) => [event, ...prev]);
      setEventReactions((prev) => new Map(prev).set(event.id, reactions));
      setEventFeedbackCounts((prev) => new Map(prev).set(event.id, 0));
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  }, []);

  const handleReactToEvent = useCallback(async (eventId: string) => {
    try {
      // Add a heart reaction (you can make this dynamic later)
      const reactions = await reactionApi.add(parseInt(eventId), '❤️');
      
      // Update local state
      setEventReactions((prev) => new Map(prev).set(eventId, reactions));
      
      // Update event reactions count
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId
            ? { 
                ...event, 
                reactions: Object.values(reactions.reactions).reduce((sum, count) => sum + count, 0)
              }
            : event
        )
      );
    } catch (error) {
      console.error('Failed to add reaction:', error);
    }
  }, []);

  const handleOpenFeedback = useCallback((eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    if (event) {
      setSelectedEventForFeedback(event);
      setIsFeedbackModalOpen(true);
    }
  }, [events]);

  const handleSubmitFeedback = useCallback(async (feedbackText: string) => {
    if (selectedEventForFeedback) {
      try {
        await feedbackApi.submit({
          event_id: parseInt(selectedEventForFeedback.id),
          message: feedbackText,
        });
        
        // Update local state
        setEvents((prev) =>
          prev.map((event) =>
            event.id === selectedEventForFeedback.id
              ? { ...event, feedback: event.feedback + 1 }
              : event
          )
        );
        
        setEventFeedbackCounts((prev) => {
          const newMap = new Map(prev);
          const currentCount = newMap.get(selectedEventForFeedback.id) || 0;
          newMap.set(selectedEventForFeedback.id, currentCount + 1);
          return newMap;
        });
      } catch (error) {
        console.error('Failed to submit feedback:', error);
        alert('Failed to submit feedback. Please try again.');
      }
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
