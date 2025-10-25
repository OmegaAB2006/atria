# Perfect Team - Quick Start Guide

## Your Application is Running! 🎉

### Access URLs
- **Frontend (React)**: http://localhost:3002/
- **Backend (Flask)**: http://localhost:5000/

## What's Been Done

### 1. Backend Integration ✅
- Updated to use **Google Gemini API** (key: `AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw`)
- Installed `google-generativeai` package
- All quiz generation now powered by Gemini 1.5 Flash

### 2. Frontend Integration ✅
- Created new React application combining:
  - Your original "Perfect Team" UI design
  - Quiz functionality
  - All features in one unified app
- Installed React, Vite, and dependencies
- Navigation includes all features

### 3. File Changes
- [backend/quiz_generator.py](backend/quiz_generator.py) - Updated to use Gemini API
- [backend/app.py](backend/app.py) - Updated API key configuration
- [backend/.env](backend/.env) - Set GEMINI_API_KEY
- [backend/requirements.txt](backend/requirements.txt) - Updated dependencies
- [frontend/src/App.jsx](frontend/src/App.jsx) - Complete React application
- [frontend/src/index.jsx](frontend/src/index.jsx) - React entry point
- [frontend/index.html](frontend/index.html) - HTML template
- [frontend/vite.config.js](frontend/vite.config.js) - Vite configuration
- [frontend/package.json](frontend/package.json) - Added React dependencies

## Features Available

### 🌌 Skill Galaxy
- Visual constellation of your skills
- GitHub import functionality
- Manual skill addition
- Progress tracking

### 📊 Team Matrix
- Team skill comparison
- Gap analysis
- Collaborative view

### 📝 Take Quiz
- AI-generated questions using Google Gemini
- MCQ and coding challenges
- Instant feedback
- Auto-updates skill progress

### 💡 Recommendations
- Personalized learning paths
- AI-powered suggestions
- Resource recommendations

## How to Use

### 1. Open the Application
Navigate to http://localhost:3002/ in your browser

### 2. Add Skills
- Click "Skill Galaxy" in the navigation
- Use "+ Add New Skill" button OR
- Import from GitHub using your username

### 3. Take a Quiz
- Click "Take Quiz" in the navigation
- Select a skill from dropdown
- Choose difficulty
- Answer questions
- Submit and see results

### 4. View Recommendations
- Click "Recommendations"
- Get AI-powered learning suggestions

## Stopping the Servers

To stop both servers:
```bash
# Find and kill the processes
pkill -f "python app.py"
pkill -f "vite"
```

Or press CTRL+C in the terminals where they're running.

## Restarting the Application

### Backend:
```bash
cd "/home/abhignanbs/Desktop/hackathon test page/backend"
source venv/bin/activate
python app.py
```

### Frontend:
```bash
cd "/home/abhignanbs/Desktop/hackathon test page/frontend"
npm run start-react
```

## Troubleshooting

### Port Already in Use
If you see "Port 3000 is in use":
- The app will automatically try the next available port
- Check the terminal output for the actual port (e.g., 3002)

### Backend Errors
- Verify `.env` file has `GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw`
- Check that virtual environment is activated
- Ensure all packages are installed: `pip install -r requirements.txt`

### Frontend Won't Load
- Clear browser cache
- Check console for errors (F12)
- Verify backend is running on port 5000

## API Key Information

**Google Gemini API Key**: `AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw`
- Used for quiz generation
- Used for recommendations
- Located in `backend/.env`

## Next Steps

1. **Explore the UI**: Navigate through all pages
2. **Test Quiz**: Add skills and take a quiz
3. **Try GitHub Import**: Import skills from a GitHub profile
4. **Customize**: Modify colors, text, or features as needed

## Need Help?

Check the following files for more information:
- [SETUP.md](SETUP.md) - Detailed setup instructions
- [backend/app.py](backend/app.py) - Backend API endpoints
- [frontend/src/App.jsx](frontend/src/App.jsx) - React components

Enjoy building your Perfect Team! 🚀
