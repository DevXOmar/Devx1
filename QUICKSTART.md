# Quick Start Guide 🚀

## Option 1: Automatic Start (Recommended)

Run both servers with one command:

```bash
./start.sh
```

This will:
- Set up the backend if needed
- Install dependencies if needed
- Start the FastAPI backend on port 8000
- Start the Next.js frontend on port 3000

## Option 2: Manual Start

### Terminal 1 - Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
uvicorn main:app --reload
```

### Terminal 2 - Frontend
```bash
pnpm install
pnpm dev
```

## Access the App

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

## First Time Setup

Make sure you have:
- Python 3.8+
- Node.js 18+
- pnpm (or npm)

## Features to Try

1. ✅ Create a new event
2. ❤️ Add reactions to events
3. 💬 Submit anonymous feedback
4. 📢 Update the announcement banner
5. 📊 View dashboard statistics

## Need Help?

Check [README_FULL.md](README_FULL.md) for complete documentation.
