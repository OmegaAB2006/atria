# WorkDNA Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Frontend (localhost:3000)                     │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │ Constellation│  │  Quiz UI     │  │ Recommenda-  │   │ │
│  │  │   Canvas     │  │  Component   │  │   tions      │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  │                                                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │           Main App Controller (app.js)               │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│                              │ HTTP/REST                          │
│                              ▼                                   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Backend Server (localhost:5000)               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Flask API (app.py)                       │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │ │
│  │  │   /analyze-  │  │  /generate-  │  │    /submit-  │    │ │
│  │  │    github    │  │     quiz     │  │     quiz     │    │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Service Layer                          │ │
│  │                                                            │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │ │
│  │  │   GitHub     │  │     Quiz     │  │    Skill     │   │ │
│  │  │   Analyzer   │  │  Generator   │  │   Tracker    │   │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘   │ │
│  └────────────────────────────────────────────────────────────┘ │
│         │                     │                    │             │
└─────────┼─────────────────────┼────────────────────┼─────────────┘
          │                     │                    │
          ▼                     ▼                    ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   GitHub API     │  │   OpenAI API     │  │   JSON Storage   │
│                  │  │    (GPT-4)       │  │  (user_data.json)│
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

## Data Flow

### 1. GitHub Skill Import
```
User → Frontend → Backend → GitHub API → Backend → Frontend → Constellation
```

1. User enters GitHub username/URL
2. Frontend sends POST to `/api/analyze-github`
3. Backend uses PyGithub to fetch:
   - Repository languages
   - README content
   - Topics and tags
   - File types
4. Analyzer extracts skills with proficiency scores
5. Skills returned to frontend
6. Constellation visualization updated

### 2. Quiz Generation
```
User → Frontend → Backend → OpenAI API → Backend → Frontend → Quiz UI
```

1. User selects skill and difficulty
2. Frontend sends POST to `/api/generate-quiz`
3. Backend sends prompt to OpenAI:
   - Request MCQs (60%)
   - Request coding problems (40%)
4. OpenAI generates structured JSON
5. Quiz data parsed and returned
6. Frontend renders questions

### 3. Progress Tracking
```
Quiz Submission → Backend → Score Calculation → Update Storage → Return Progress
```

1. User submits quiz answers
2. Backend calculates score:
   - MCQ: Exact match
   - Coding: Presence + quality check
3. Update formula: `new_progress = (score × 0.7) + (current × 0.3)`
4. Save to JSON storage
5. Return updated progress
6. Constellation updates in real-time

### 4. Recommendations
```
User Request → Backend → Analyze Progress → OpenAI API → Personalized Suggestions
```

1. User clicks "Get Recommendations"
2. Backend analyzes skill gaps
3. Identifies weak areas
4. Sends context to OpenAI
5. AI generates:
   - Skills to improve
   - Learning resources
   - Time estimates
   - Related skills
6. Formatted recommendations displayed

## Component Details

### Frontend Components

#### 1. Constellation (constellation.js)
- **Purpose**: Visual skill representation
- **Technology**: HTML5 Canvas API
- **Features**:
  - Star rendering with glow effects
  - Drag-and-drop interaction
  - Connection lines between related skills
  - Color coding by proficiency
  - Floating animation
  - Click for details

#### 2. Skills (skills.js)
- **Purpose**: Skill management
- **Features**:
  - Progress bar cards
  - Add/remove skills
  - Skill details modal
  - Statistics display
  - Color-coded progress bars

#### 3. Quiz (quiz.js)
- **Purpose**: Assessment interface
- **Features**:
  - MCQ rendering
  - Code editor for problems
  - Answer tracking
  - Results display
  - Detailed feedback
  - Score animation

#### 4. Recommendations (recommendations.js)
- **Purpose**: Learning guidance
- **Features**:
  - AI-powered suggestions
  - Resource links
  - Related skills display
  - Time estimates
  - One-click skill addition

### Backend Services

#### 1. GitHub Analyzer (github_analyzer.py)
```python
analyze_repository(repo_url) → dict[skill: progress]
analyze_user_profile(username) → dict[skill: progress]
```
- Analyzes languages by bytes
- Parses README for frameworks
- Processes topics and tags
- Maps to skill taxonomy

#### 2. Quiz Generator (quiz_generator.py)
```python
generate_quiz(skill, difficulty, count) → quiz_object
evaluate_code(code, problem, tests) → evaluation
generate_recommendations(progress) → list[recommendations]
```
- Uses OpenAI GPT-4
- Structured JSON output
- Context-aware generation
- Code quality assessment

#### 3. Skill Tracker (skill_tracker.py)
```python
get_user_progress(user_id) → dict
update_progress(user_id, skill, score) → float
calculate_score(answers, correct) → float
```
- Persistent JSON storage
- Weighted progress updates
- Quiz history tracking
- Statistics calculation

## API Design

### RESTful Endpoints

| Endpoint | Method | Purpose | Input | Output |
|----------|--------|---------|-------|--------|
| `/api/analyze-github` | POST | Import skills | URL/username | Skills dict |
| `/api/generate-quiz` | POST | Create quiz | Skill, difficulty | Quiz object |
| `/api/submit-quiz` | POST | Grade quiz | Answers | Score, progress |
| `/api/get-progress/{id}` | GET | Fetch progress | User ID | Skills dict |
| `/api/add-skill` | POST | Add skill | Skill name | Updated skills |
| `/api/get-recommendations` | POST | Get suggestions | User ID | Recommendations |
| `/health` | GET | Health check | None | Status |

### Data Models

#### Skill Object
```javascript
{
  skill: "Python",
  progress: 75,
  x: 500,
  y: 300,
  size: 12,
  color: "#10b981"
}
```

#### Quiz Object
```javascript
{
  skill: "Python",
  difficulty: "medium",
  questions: [
    {
      type: "mcq",
      question: "What is...",
      options: { A: "...", B: "...", C: "...", D: "..." },
      correct_answer: "A",
      explanation: "..."
    },
    {
      type: "coding",
      title: "Two Sum",
      description: "...",
      examples: [...],
      constraints: [...],
      function_signature: "def two_sum(nums, target):",
      solution: "...",
      test_cases: [...]
    }
  ]
}
```

#### User Progress
```javascript
{
  user_id: "user123",
  skills: {
    "Python": 75,
    "JavaScript": 60,
    "React": 80
  },
  quiz_history: [
    {
      skill: "Python",
      score: 85,
      timestamp: "2025-10-24T10:30:00"
    }
  ],
  created_at: "2025-10-24T09:00:00"
}
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first styling
- **Vanilla JavaScript**: No framework overhead
- **Canvas API**: High-performance graphics
- **Fetch API**: HTTP communication

### Backend
- **Flask**: Lightweight WSGI framework
- **Flask-CORS**: Cross-origin support
- **Python 3.8+**: Modern Python features
- **JSON**: Data persistence
- **dotenv**: Environment management

### External Services
- **GitHub API**: Repository analysis
- **OpenAI GPT-4**: AI generation
- **PyGithub**: GitHub wrapper

## Performance Considerations

### Frontend
- Canvas rendering: 60 FPS animations
- Debounced API calls
- Lazy loading for large skill sets
- Local state management (no Redux needed)

### Backend
- Stateless API design
- In-memory caching potential
- Rate limiting considerations
- Async GitHub requests possible

### Scalability
- Current: Single-user JSON storage
- Future: PostgreSQL/MongoDB
- Future: Redis for caching
- Future: Horizontal scaling with load balancer

## Security Considerations

### Current Implementation
- API key in .env (not committed)
- CORS enabled for development
- No authentication (demo mode)

### Production Requirements
- User authentication (JWT/OAuth)
- API rate limiting
- Input sanitization
- HTTPS only
- API key rotation
- Database encryption

## Development Workflow

```
1. Feature Branch → 2. Development → 3. Testing → 4. Code Review → 5. Merge
```

### Local Development
```bash
# Terminal 1: Backend with hot reload
cd backend && python app.py

# Terminal 2: Frontend with auto-refresh
cd frontend && npm start
```

### Testing
- Manual testing via browser
- API testing via Postman/curl
- Future: pytest for backend
- Future: Jest for frontend

## Deployment Options

### Option 1: Traditional Hosting
- Frontend: Netlify/Vercel
- Backend: Heroku/Railway
- Database: PostgreSQL (Supabase)

### Option 2: Container
- Docker Compose
- Frontend + Backend in containers
- Reverse proxy (nginx)

### Option 3: Serverless
- Frontend: Static hosting (S3 + CloudFront)
- Backend: AWS Lambda + API Gateway
- Database: DynamoDB

## Monitoring & Logging

### Backend Logs
- Request/response logging
- Error tracking
- OpenAI API usage
- GitHub API rate limits

### Frontend Monitoring
- Console errors
- API response times
- User interactions
- Performance metrics

---

Built for the Galaxy-themed hackathon 🌌
