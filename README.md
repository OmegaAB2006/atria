# WorkDNA - Skill Constellation Tracker

A dynamic skill tracking system that maps your unique "WorkDNA" through GitHub analysis, AI-generated quizzes, and beautiful constellation visualizations.

## Features

- **GitHub Integration**: Automatically extract skills from GitHub repositories and user profiles
- **Skill Constellation**: Beautiful, interactive constellation visualization where each star represents a skill
- **AI-Powered Quizzes**: Generate personalized quizzes (LeetCode-style coding problems + MCQs) using Google Gemini
- **Progress Tracking**: Track skill proficiency with visual progress bars and statistics
- **Personalized Recommendations**: Get AI-powered suggestions on what to learn next based on weak topics
- **Editable Skills**: Add, remove, and rearrange skills in your constellation
- **Landing Page**: Beautiful landing page with authentication
- **Team Collaboration**: Add team members and track team skill matrix

## Architecture

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Python Flask
- **AI**: Google Gemini API
- **GitHub API**: PyGithub

## Setup Instructions

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API key

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. The `.env` file is already created with your API key. If you need to update it:
```bash
echo "GEMINI_API_KEY=your_key_here" > .env
```

5. Start the backend server:
```bash
python app.py
```

The backend will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

## Usage Guide

### 1. Landing Page & Authentication

- Visit the landing page to learn about WorkDNA
- Click "Get Started" to go to login/signup
- Login with email/password or use social login
- Access the full skill tracking platform

### 2. Import Skills from GitHub

- Enter a GitHub username or repository URL in the input field
- Click "Analyze" to extract skills
- Skills will be automatically added to your constellation

### 3. View Your Skill Constellation

- Each star represents a skill
- Star size and color indicate proficiency level:
  - Green (80-100%): Expert
  - Blue (60-79%): Proficient
  - Orange (40-59%): Intermediate
  - Red (20-39%): Beginner
  - Gray (0-19%): Novice
- Stars are connected when skills are related
- Drag stars to rearrange your constellation
- Click on a star to view details and take a quiz

### 4. Take Quizzes

- Navigate to the "Take Quiz" section
- Select a skill and difficulty level
- Click "Generate Quiz" to create a personalized assessment
- Answer MCQs and solve coding problems
- Submit to see your score and update your progress

### 5. Get Recommendations

- Navigate to the "Recommendations" section
- View weak topics identified from your quiz results
- Focus on improving areas where you scored below 70%

### 6. Team Collaboration

- Navigate to "Team Matrix"
- View team members and their skill levels
- Click "Add Team Member" to add new members with skill levels
- Track team strengths and weaknesses

## API Endpoints

### POST `/api/analyze-github`
Analyze a GitHub repository or user profile
```json
{
  "github_url": "https://github.com/user/repo",
  "username": "username"
}
```

### POST `/api/generate-quiz`
Generate a quiz for a skill
```json
{
  "skill": "Python",
  "difficulty": "medium",
  "question_count": 5
}
```

### POST `/api/submit-quiz`
Submit quiz answers and update progress
```json
{
  "user_id": "user123",
  "skill": "Python",
  "answers": ["A", "B", "C"],
  "correct_answers": ["A", "B", "D"],
  "weak_topics": ["topic1", "topic2"]
}
```

### GET `/api/get-progress/{user_id}`
Get user's skill progress

### POST `/api/add-skill`
Add a new skill
```json
{
  "user_id": "user123",
  "skill": "Docker"
}
```

### POST `/api/get-recommendations`
Get weak topics from quiz history
```json
{
  "user_id": "user123"
}
```

## Project Structure

```
.
├── backend/
│   ├── app.py                 # Main Flask application
│   ├── github_analyzer.py     # GitHub API integration
│   ├── quiz_generator.py      # Google Gemini quiz generation
│   ├── skill_tracker.py       # User progress tracking
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend/
│   ├── public/
│   │   └── index.html        # Main HTML file
│   ├── src/
│   │   ├── App.jsx           # Main React application
│   │   └── index.jsx         # React entry point
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Node dependencies
└── README.md
```

## Technologies Used

### Frontend
- **React**: Modern UI library
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **Canvas API**: For constellation visualization
- **Fetch API**: For API communication

### Backend
- **Flask**: Lightweight Python web framework
- **Google Gemini API**: For quiz generation
- **PyGithub**: GitHub API wrapper
- **Flask-CORS**: Cross-origin resource sharing

## Quiz Types

### Multiple Choice Questions (MCQs)
- 60% of quiz questions
- Four options (A, B, C, D)
- Instant feedback with explanations
- Covers theoretical and practical knowledge

### LeetCode-Style Coding Problems
- 40% of quiz questions
- Real-world programming challenges
- Code editor with syntax highlighting
- Sample solutions provided
- Test cases included

## Scoring System

- Each quiz updates your skill proficiency
- Score calculation: (Correct answers / Total questions) × 100
- Progress is weighted: 70% new score + 30% existing progress
- Maximum proficiency: 100%
- Topics with score < 70% are tracked as weak topics

## Personalization

The system uses AI to:
- Analyze your GitHub repositories to detect skills
- Generate quizzes tailored to your skill level
- Identify weak topics from quiz performance
- Recommend areas for improvement
- Track progress over time

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed
- Activate virtual environment
- Install all requirements: `pip install -r requirements.txt`
- Check if port 5000 is available

### Frontend won't start
- Ensure Node.js 16+ is installed
- Run `npm install` in frontend directory
- Check if port 3000 is available

### GitHub analysis fails
- Check if the repository/username is public
- GitHub API has rate limits (60 requests/hour without auth)
- Add a GitHub token for higher limits

### Quiz generation fails
- Verify Google Gemini API key is correct
- Check API key has sufficient credits
- Ensure internet connection is stable

## Future Enhancements

- Skill verification through peer review
- Integration with LinkedIn profiles
- Export skill reports (PDF/PNG)
- Gamification with achievements and badges
- Mobile app version
- Social sharing features
- Learning path templates

## License

MIT License - feel free to use this project for your hackathon and beyond!

## Contributors

Built with passion for the Galaxy-themed hackathon 🌌

## Support

For issues or questions, please open an issue on GitHub.
