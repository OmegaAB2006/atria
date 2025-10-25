# WorkDNA - Quick Start Guide

## Get Started in 5 Minutes! 🚀

### Option 1: Automated Start (Recommended)

#### Linux/Mac:
```bash
./start.sh
```

#### Windows:
```batch
start.bat
```

### Option 2: Manual Start

#### Terminal 1 - Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm start
```

### Access the App

Open your browser and go to: **http://localhost:3000**

## First Steps

### 1. Import Your Skills
- Enter your GitHub username (e.g., "torvalds")
- Or paste a repository URL (e.g., "https://github.com/facebook/react")
- Click "Analyze"

### 2. Explore Your Constellation
- See your skills as stars in space
- Bigger/greener stars = higher proficiency
- Drag stars to rearrange them
- Click on stars for details

### 3. Take a Quiz
- Click "Take Quiz" in the navigation
- Select a skill and difficulty
- Answer MCQs and solve coding problems
- Submit to update your progress

### 4. Get Recommendations
- Click "Recommendations" in the navigation
- Click "Get Recommendations"
- See AI-powered suggestions for growth

## Demo Data

If you don't have GitHub data, the app will auto-load demo skills:
- JavaScript (65%)
- Python (50%)
- HTML (75%)
- CSS (60%)

## Key Features

### Interactive Constellation ⭐
- Each star is a skill
- Colors show proficiency:
  - 🟢 Green (80-100%): Expert
  - 🔵 Blue (60-79%): Proficient
  - 🟡 Orange (40-59%): Intermediate
  - 🔴 Red (20-39%): Beginner
  - ⚫ Gray (0-19%): Novice

### AI-Powered Quizzes 📝
- 60% Multiple Choice Questions
- 40% LeetCode-style Coding Problems
- Instant feedback and explanations
- Progress tracking after each quiz

### Smart Recommendations 🎯
- Personalized learning paths
- Skill improvement suggestions
- Resource recommendations
- Time estimates

### Editable Skills ✏️
- Add new skills manually
- Remove skills you don't need
- Drag and drop in constellation
- Import from GitHub

## Troubleshooting

### "Port already in use"
- Backend uses port 5000
- Frontend uses port 3000
- Kill processes: `lsof -ti:5000 | xargs kill -9`

### "Module not found"
- Backend: `pip install -r backend/requirements.txt`
- Frontend: `npm install` in frontend directory

### "OpenAI API Error"
- Check your API key in `backend/.env`
- Verify you have credits: https://platform.openai.com/usage
- API key format: `sk-proj-...`

### "GitHub rate limit"
- GitHub allows 60 requests/hour without auth
- Wait an hour or add a GitHub token
- Token: https://github.com/settings/tokens

## Tips for the Hackathon

### Presentation Points
1. **Live Demo**: Import skills from a popular GitHub repo
2. **Visual Impact**: Show the constellation with 10+ skills
3. **AI Features**: Generate and take a quiz live
4. **Recommendations**: Show personalized learning paths
5. **Interactive**: Drag stars, add skills, show progress bars

### Impressive Repos to Analyze
- facebook/react
- microsoft/vscode
- tensorflow/tensorflow
- django/django
- nodejs/node

### Demo Flow
1. Start with empty constellation
2. Import from a famous repo
3. Watch constellation populate
4. Take a quiz on one skill
5. Show score and updated progress
6. Get recommendations
7. Add a manual skill
8. Show statistics dashboard

## Architecture Highlights

- **Frontend**: No frameworks, just Vanilla JS + Tailwind CSS
- **Backend**: Flask microservice architecture
- **AI**: OpenAI GPT-4 for quiz generation
- **Visualization**: Canvas API for constellation
- **GitHub**: PyGithub for repo analysis

## Next Steps

After the hackathon, consider adding:
- User authentication
- Team features
- Skill verification
- PDF export
- Mobile app
- Social sharing

## Need Help?

Check the full README.md for:
- Detailed API documentation
- Architecture overview
- Advanced features
- Contribution guidelines

---

**Good luck with your hackathon! 🌌**
