# College PR Event Dashboard

A full-stack event management dashboard for college PR events with real-time reactions, feedback, and announcements.

## Project Structure

```
Devx1/
├── app/                    # Next.js pages
├── components/             # React components
├── lib/                    # Utilities and API client
├── backend/               # FastAPI backend
│   ├── main.py           # Backend API server
│   ├── requirements.txt  # Python dependencies
│   └── README.md         # Backend docs
└── ...
```

## Tech Stack

### Frontend
- **Framework:** Next.js 16 with React 19
- **Styling:** Tailwind CSS 4
- **UI Components:** Radix UI
- **Language:** TypeScript

### Backend
- **Framework:** FastAPI (Python)
- **Storage:** In-memory (easily upgradeable to SQLite/PostgreSQL)
- **API:** RESTful with async endpoints

## Features

✅ Create and manage events  
✅ Real-time reactions (🔥 😮 👏 ❤️)  
✅ Anonymous feedback system  
✅ Announcement banner  
✅ Dashboard statistics  
✅ Responsive design  
✅ Dark mode support  

## Getting Started

### Prerequisites

- **Node.js** 18+ (for frontend)
- **Python** 3.8+ (for backend)
- **pnpm** (or npm/yarn)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run the backend server
uvicorn main:app --reload
```

The backend will run at: **http://localhost:8000**

API documentation: **http://localhost:8000/docs**

### 2. Frontend Setup

```bash
# Navigate to project root (if in backend, go back)
cd ..

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

The frontend will run at: **http://localhost:3000**

### 3. Open the App

Visit **http://localhost:3000** in your browser

## API Endpoints

### Events
- `POST /api/events` - Create event
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get specific event

### Reactions
- `POST /api/reactions` - Add reaction
- `GET /api/reactions/{event_id}` - Get reactions for event

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback
- `GET /api/feedback/{event_id}` - Get event feedback

### Announcements
- `POST /api/announcement` - Create announcement
- `GET /api/announcement` - Get latest announcement

### Stats
- `GET /api/stats` - Get dashboard statistics

## Development

### Run Both Servers

**Terminal 1 (Backend):**
```bash
cd backend
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 (Frontend):**
```bash
pnpm dev
```

## Environment Variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Production Build

### Frontend
```bash
pnpm build
pnpm start
```

### Backend
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

## Future Enhancements

- [ ] Persistent database (SQLite/PostgreSQL)
- [ ] User authentication
- [ ] Real-time updates (WebSockets)
- [ ] Event categories/tags
- [ ] Image uploads for events
- [ ] Email notifications
- [ ] Event calendar view
- [ ] Search and filters

## License

MIT
