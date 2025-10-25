# Perfect Team - WorkDNA Platform Setup Guide

## Overview
Perfect Team is an integrated platform that combines skill tracking, team management, AI-powered quizzes, and personalized learning recommendations. The platform uses Google Gemini API for generating intelligent assessments.

## Features
- 🌌 **Skill Galaxy**: Visual representation of your skills as a cosmic constellation
- 📊 **Team Matrix**: Collaborative team skill mapping and gap analysis
- 📝 **AI-Powered Quizzes**: Google Gemini-generated MCQs and coding challenges
- 💡 **Smart Recommendations**: Personalized learning paths based on your progress
- 🔗 **GitHub Integration**: Import skills automatically from your GitHub profile

## Technology Stack
- **Frontend**: React 18, Tailwind CSS, Vite
- **Backend**: Python Flask, Google Gemini AI
- **API**: Google Gemini 1.5 Flash

## Prerequisites
- Node.js (v18 or higher)
- Python 3.12 or higher
- Google Gemini API Key: `AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw`

## Installation

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw
```

6. Start the Flask server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start-react
```

The frontend will run on `http://localhost:3000`

## Usage Guide

### 1. Skill Galaxy
- Add skills manually using the "Add New Skill" button
- Import skills from GitHub by entering a username or repository URL
- View your skills as an interactive constellation visualization
- Track progress percentage for each skill

### 2. Team Matrix
- View team members and their skill levels
- Compare skills across team members
- Identify skill gaps and strengths

### 3. Take Quiz
- Select a skill from your skill galaxy
- Choose difficulty level (Easy, Medium, Hard)
- Answer AI-generated MCQs and coding challenges
- Get instant feedback and scoring
- Progress automatically updates in your skill galaxy

### 4. Recommendations
- Get personalized learning recommendations based on your current skills
- View suggested topics, resources, and estimated learning time
- Discover complementary skills to expand your expertise

## API Endpoints

### Backend API (Port 5000)

- `POST /api/analyze-github` - Analyze GitHub profile and extract skills
- `POST /api/generate-quiz` - Generate AI-powered quiz for a skill
- `POST /api/submit-quiz` - Submit quiz answers and update progress
- `GET /api/get-progress/:user_id` - Get user's skill progress
- `POST /api/add-skill` - Add a new skill
- `POST /api/get-recommendations` - Get personalized recommendations
- `GET /health` - Health check endpoint

## Project Structure

```
hackathon test page/
├── backend/
│   ├── app.py                 # Flask application
│   ├── quiz_generator.py      # Google Gemini quiz generation
│   ├── github_analyzer.py     # GitHub skill extraction
│   ├── skill_tracker.py       # Skill progress tracking
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── App.js            # Main React application
│   │   └── index.js          # React entry point
│   ├── index.html            # HTML template
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Node dependencies
└── SETUP.md                  # This file
```

## Configuration

### Google Gemini API
The application uses Google Gemini 1.5 Flash model for:
- Generating quiz questions (MCQ and coding challenges)
- Creating personalized recommendations
- Evaluating code submissions

API Key: `AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw`

### Environment Variables
Create a `.env` file in the backend directory:
```env
GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw
FLASK_ENV=development
FLASK_DEBUG=True
```

## Troubleshooting

### Backend Issues
- **Module not found errors**: Make sure virtual environment is activated and dependencies are installed
- **API key errors**: Verify the GEMINI_API_KEY in .env file
- **Port already in use**: Change port in app.py or kill the process using port 5000

### Frontend Issues
- **Cannot connect to backend**: Ensure backend is running on port 5000
- **Build errors**: Delete node_modules and package-lock.json, then run `npm install`
- **Blank page**: Check browser console for errors and ensure React is properly loaded

## Development

### Running in Development Mode
1. Start backend: `python app.py` (in backend directory)
2. Start frontend: `npm run start-react` (in frontend directory)
3. Access application at `http://localhost:3000`

### Building for Production
```bash
cd frontend
npm run build
```

## License
This project is built for hackathon purposes.

## Support
For issues or questions, please refer to the codebase documentation or contact the development team.
