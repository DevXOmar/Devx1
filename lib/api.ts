/**
 * API service for College PR Event Dashboard
 * Connects to FastAPI backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================
// Types
// ============================================

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  created_at: string;
}

export interface EventCreate {
  title: string;
  description: string;
  date: string;
}

export interface Reactions {
  event_id: number;
  reactions: {
    '🔥': number;
    '😮': number;
    '👏': number;
    '❤️': number;
  };
}

export type ReactionType = '🔥' | '😮' | '👏' | '❤️';

export interface Feedback {
  id: number;
  event_id: number;
  message: string;
  rating: number | null;
  created_at: string;
}

export interface FeedbackSubmit {
  event_id: number;
  message: string;
  rating?: number;
}

export interface Announcement {
  message: string;
  created_at: string | null;
}

export interface Stats {
  total_events: number;
  total_feedback: number;
  total_reactions: number;
}

// ============================================
// API Functions
// ============================================

/**
 * Event endpoints
 */
export const eventApi = {
  create: async (event: EventCreate): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return response.json();
  },

  list: async (): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/api/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return response.json();
  },

  get: async (eventId: number): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    return response.json();
  },
};

/**
 * Reaction endpoints
 */
export const reactionApi = {
  add: async (eventId: number, reaction: ReactionType): Promise<Reactions> => {
    const response = await fetch(`${API_BASE_URL}/api/reactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_id: eventId, reaction }),
    });
    if (!response.ok) throw new Error('Failed to add reaction');
    return response.json();
  },

  get: async (eventId: number): Promise<Reactions> => {
    const response = await fetch(`${API_BASE_URL}/api/reactions/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch reactions');
    return response.json();
  },
};

/**
 * Feedback endpoints
 */
export const feedbackApi = {
  submit: async (feedback: FeedbackSubmit): Promise<Feedback> => {
    const response = await fetch(`${API_BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(feedback),
    });
    if (!response.ok) throw new Error('Failed to submit feedback');
    return response.json();
  },

  listAll: async (): Promise<Feedback[]> => {
    const response = await fetch(`${API_BASE_URL}/api/feedback`);
    if (!response.ok) throw new Error('Failed to fetch feedback');
    return response.json();
  },

  listByEvent: async (eventId: number): Promise<Feedback[]> => {
    const response = await fetch(`${API_BASE_URL}/api/feedback/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event feedback');
    return response.json();
  },
};

/**
 * Announcement endpoints
 */
export const announcementApi = {
  create: async (message: string): Promise<Announcement> => {
    const response = await fetch(`${API_BASE_URL}/api/announcement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) throw new Error('Failed to create announcement');
    return response.json();
  },

  get: async (): Promise<Announcement> => {
    const response = await fetch(`${API_BASE_URL}/api/announcement`);
    if (!response.ok) throw new Error('Failed to fetch announcement');
    return response.json();
  },
};

/**
 * Stats endpoint
 */
export const statsApi = {
  get: async (): Promise<Stats> => {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  },
};
