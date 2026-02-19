#!/bin/bash

# Startup script for College PR Event Dashboard
# This script starts both backend and frontend servers

echo "🚀 Starting College PR Event Dashboard..."
echo ""

# Check if backend venv exists
if [ ! -d "backend/venv" ]; then
    echo "⚠️  Backend virtual environment not found!"
    echo "Creating virtual environment..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing backend dependencies..."
    pip install -r requirements.txt
    cd ..
    echo "✅ Backend setup complete!"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "⚠️  Frontend dependencies not found!"
    echo "Installing frontend dependencies..."
    pnpm install
    echo "✅ Frontend setup complete!"
    echo ""
fi

# Start backend in the background
echo "🐍 Starting Backend Server (FastAPI)..."
cd backend
source venv/bin/activate
uvicorn main:app --reload > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..
echo "   Backend running on http://localhost:8000 (PID: $BACKEND_PID)"
echo "   API docs: http://localhost:8000/docs"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "⚛️  Starting Frontend Server (Next.js)..."
echo "   Frontend running on http://localhost:3000"
echo ""
echo "📝 Logs:"
echo "   Backend logs: backend.log"
echo "   Frontend logs: below"
echo ""
echo "🛑 Press Ctrl+C to stop both servers"
echo ""

# Start frontend (this will run in foreground)
pnpm dev

# When frontend stops, also stop backend
echo ""
echo "🛑 Stopping servers..."
kill $BACKEND_PID 2>/dev/null
echo "✅ All servers stopped!"
