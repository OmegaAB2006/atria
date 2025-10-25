# WorkDNA - Testing & Demo Guide

## Pre-Demo Checklist

### 1. Environment Setup ✓
```bash
# Check Python version
python3 --version  # Should be 3.8+

# Check Node.js version
node --version     # Should be 16+

# Check npm version
npm --version      # Should be 8+
```

### 2. Install Dependencies ✓
```bash
# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 3. Verify API Key ✓
```bash
# Check .env file
cat backend/.env
# Should show: OPENAI_API_KEY=sk-proj-...
```

### 4. Start Services ✓
```bash
# Option 1: Use start script
./start.sh  # Linux/Mac
start.bat   # Windows

# Option 2: Manual start
# Terminal 1: Backend
cd backend && python app.py

# Terminal 2: Frontend
cd frontend && npm start
```

## Testing Checklist

### Backend Tests

#### 1. Health Check
```bash
curl http://localhost:5000/health
# Expected: {"status": "healthy"}
```

#### 2. GitHub Analysis (Without Token)
```bash
curl -X POST http://localhost:5000/api/analyze-github \
  -H "Content-Type: application/json" \
  -d '{"username": "torvalds"}'

# Expected: JSON with skills like "C", "Shell", "Linux", etc.
```

#### 3. GitHub Repository Analysis
```bash
curl -X POST http://localhost:5000/api/analyze-github \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/facebook/react"}'

# Expected: Skills like "JavaScript", "TypeScript", "React", etc.
```

#### 4. Quiz Generation
```bash
curl -X POST http://localhost:5000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"skill": "Python", "difficulty": "medium", "question_count": 3}'

# Expected: Quiz object with 3 questions
```

#### 5. Submit Quiz
```bash
curl -X POST http://localhost:5000/api/submit-quiz \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "skill": "Python",
    "answers": ["A", "B", "C"],
    "correct_answers": ["A", "B", "D"]
  }'

# Expected: Score and updated progress
```

#### 6. Get Progress
```bash
curl http://localhost:5000/api/get-progress/test_user

# Expected: Skills dictionary
```

#### 7. Add Skill
```bash
curl -X POST http://localhost:5000/api/add-skill \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user", "skill": "Docker"}'

# Expected: Updated skills
```

#### 8. Get Recommendations
```bash
curl -X POST http://localhost:5000/api/get-recommendations \
  -H "Content-Type: application/json" \
  -d '{"user_id": "test_user"}'

# Expected: Array of recommendations
```

### Frontend Tests

#### 1. Page Load
- Open http://localhost:3000
- Check: Page loads without errors
- Check: Constellation canvas renders
- Check: Navigation buttons visible

#### 2. GitHub Import
**Test Case 1: Username**
- Input: `torvalds`
- Click: "Analyze"
- Expected: Skills appear in constellation (C, Shell, etc.)

**Test Case 2: Repository URL**
- Input: `https://github.com/facebook/react`
- Click: "Analyze"
- Expected: Skills appear (JavaScript, TypeScript, React)

**Test Case 3: Invalid Input**
- Input: `nonexistentuser12345xyz`
- Click: "Analyze"
- Expected: Error message displayed

#### 3. Constellation Interaction
**Test: Drag and Drop**
- Click and hold a star
- Drag to new position
- Release
- Expected: Star moves smoothly

**Test: Click Star**
- Click on any star
- Expected: Modal shows skill details
- Expected: "Take Quiz" button visible

**Test: Color Coding**
- Check stars have different colors
- Expected: Green (80+%), Blue (60-79%), Orange (40-59%), Red (20-39%)

#### 4. Quiz Flow
**Test: Generate Quiz**
1. Click "Take Quiz" in navigation
2. Select skill: "Python"
3. Select difficulty: "Medium"
4. Click "Generate Quiz"
5. Expected: Loading message → Questions appear
6. Expected: Mix of MCQs and coding problems

**Test: Answer Quiz**
1. Answer all questions (select options, write code)
2. Click "Submit Quiz"
3. Expected: Score displayed
4. Expected: Detailed feedback shown
5. Expected: Constellation updates

**Test: Quiz Results**
1. Check score percentage
2. Check feedback message
3. Check detailed results per question
4. Click "Take Another Quiz"
5. Expected: Return to quiz selection

#### 5. Skills Management
**Test: Add Skill**
1. Click "+ Add Skill"
2. Enter: "Docker"
3. Click "Add"
4. Expected: Modal closes
5. Expected: "Docker" appears in constellation

**Test: Remove Skill**
1. Click "×" on a skill card
2. Confirm removal
3. Expected: Skill removed from constellation
4. Expected: Skill card disappears

#### 6. Recommendations
**Test: Get Recommendations**
1. Click "Recommendations" in navigation
2. Click "Get Recommendations"
3. Expected: Loading message
4. Expected: Recommendations appear
5. Check: Reason, topics, resources shown

**Test: Add from Recommendation**
1. Click "Add to My Constellation" on a recommendation
2. Expected: Success message
3. Expected: Return to dashboard
4. Expected: New skill in constellation

#### 7. Statistics
**Test: Statistics Display**
- Check "Total Skills" count
- Check "Average Progress" percentage
- Check "Total Quizzes" count
- Check "Strongest Skill" name
- Expected: All values accurate

### Browser Compatibility

#### Desktop Browsers
- ✓ Chrome 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Edge 90+

#### Mobile Browsers
- ✓ Chrome Mobile
- ✓ Safari iOS
- ⚠️ Layout may need adjustment

### Performance Tests

#### 1. Page Load Time
```javascript
// Open DevTools → Network
// Reload page
// Check: DOMContentLoaded < 1s
// Check: Load < 2s
```

#### 2. Constellation Rendering
```javascript
// Open DevTools → Performance
// Record while interacting with constellation
// Check: 60 FPS during animations
// Check: No dropped frames
```

#### 3. API Response Times
```javascript
// Open DevTools → Network
// Analyze GitHub: < 5s
// Generate Quiz: < 10s
// Submit Quiz: < 2s
// Get Progress: < 1s
```

## Common Issues & Solutions

### Issue 1: Backend Port Already in Use
```bash
# Find process using port 5000
lsof -ti:5000

# Kill process
kill -9 $(lsof -ti:5000)

# Or use different port
export FLASK_RUN_PORT=5001
python app.py
```

### Issue 2: Frontend Port Already in Use
```bash
# Find process using port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)

# Or edit server.js to use different port
```

### Issue 3: OpenAI API Error
```
Error: Invalid API key
```
**Solution**: Check `backend/.env` file has correct API key

```
Error: Rate limit exceeded
```
**Solution**: Wait or upgrade OpenAI plan

```
Error: Insufficient credits
```
**Solution**: Add credits to OpenAI account

### Issue 4: GitHub Rate Limit
```
Error: API rate limit exceeded
```
**Solution**:
- Wait 1 hour (resets hourly)
- Or add GitHub token to increase limit

### Issue 5: CORS Error
```
Access-Control-Allow-Origin error
```
**Solution**: Ensure Flask-CORS is installed
```bash
pip install flask-cors
```

### Issue 6: Constellation Not Rendering
**Solution**: Check console for errors
```javascript
// Common fix: Refresh page
window.location.reload()
```

### Issue 7: Quiz Not Generating
**Possible Causes**:
1. OpenAI API key invalid → Check .env
2. No internet connection → Check network
3. Skill not recognized → Try common skill (Python, JavaScript)

## Demo Preparation

### 1. Clean State
```bash
# Remove user data
rm backend/user_data.json

# Clear browser cache
# DevTools → Application → Clear storage
```

### 2. Pre-load Test Data
```bash
# Start servers
./start.sh

# Import popular repo
curl -X POST http://localhost:5000/api/analyze-github \
  -H "Content-Type: application/json" \
  -d '{"github_url": "https://github.com/facebook/react"}'
```

### 3. Prepare Browser
- Open http://localhost:3000
- Open DevTools (F12)
- Zoom to comfortable level
- Full screen mode
- Hide bookmarks bar

### 4. Demo Script
1. **Intro** (30s): "WorkDNA transforms skills into a constellation"
2. **Import** (1m): Paste GitHub URL, show analysis
3. **Constellation** (1m): Drag stars, explain colors
4. **Quiz** (2m): Generate, answer 1-2 questions, submit
5. **Results** (30s): Show score, updated constellation
6. **Recommendations** (1m): Get suggestions, add skill
7. **Outro** (30s): Recap features

### 5. Backup Plan
If live demo fails:
- Have screenshots ready
- Video recording of working demo
- Explain architecture instead

## Sample Test Repositories

### Easy to Analyze (Fast)
1. `https://github.com/facebook/react`
   - Skills: JavaScript, TypeScript, React
2. `https://github.com/django/django`
   - Skills: Python, Django, Backend
3. `https://github.com/expressjs/express`
   - Skills: JavaScript, Node.js, Backend

### Complex (Slow but Impressive)
1. `https://github.com/microsoft/vscode`
   - Skills: TypeScript, Electron, IDE Development
2. `https://github.com/tensorflow/tensorflow`
   - Skills: Python, C++, Machine Learning
3. `https://github.com/kubernetes/kubernetes`
   - Skills: Go, DevOps, Kubernetes

### Famous Developers
1. `torvalds` (Linus Torvalds)
   - Skills: C, Linux, Systems Programming
2. `gvanrossum` (Guido van Rossum)
   - Skills: Python, Language Design
3. `dhh` (David Heinemeier Hansson)
   - Skills: Ruby, Rails, Web Development

## Success Criteria

### Must Work ✓
- [x] Page loads without errors
- [x] Constellation renders
- [x] GitHub import works
- [x] Quiz generation works
- [x] Quiz submission updates progress
- [x] Recommendations load

### Should Work ✓
- [x] Drag and drop stars
- [x] Add/remove skills
- [x] Statistics display
- [x] Mobile responsive

### Nice to Have
- [ ] Real-time collaboration
- [ ] Export to PDF
- [ ] Social sharing

## Post-Demo Checklist

1. Get feedback from judges
2. Note questions asked
3. Document issues encountered
4. List suggested improvements
5. Thank judges and attendees

## Emergency Contacts

- OpenAI Support: https://help.openai.com
- GitHub API Status: https://www.githubstatus.com
- Flask Docs: https://flask.palletsprojects.com
- Tailwind CSS: https://tailwindcss.com/docs

---

**Good luck! You've got this! 🚀🌌**
