# WorkDNA - Quick Start Guide

This guide will help you get WorkDNA up and running on any device in under 5 minutes.

## Prerequisites Check

Before starting, ensure you have:
- **Python 3.8+** installed ([Download here](https://www.python.org/downloads/))
- **Node.js 16+** installed ([Download here](https://nodejs.org/))
- **Git** installed ([Download here](https://git-scm.com/downloads))
- **Google Gemini API Key** ([Get one here](https://makersuite.google.com/app/apikey))

### Verify Prerequisites

Run these commands to check your installations:

```bash
python --version    # Should show 3.8 or higher
node --version      # Should show 16 or higher
npm --version       # Should show 8 or higher
git --version       # Should show any version
```

## Step 1: Clone the Repository

```bash
git clone https://github.com/OmegaAB2006/atria.git
cd atria
```

## Step 2: Backend Setup (5 steps)

### 2.1 Navigate to backend directory
```bash
cd backend
```

### 2.2 Create virtual environment
```bash
# On Linux/Mac:
python3 -m venv venv

# On Windows:
python -m venv venv
```

### 2.3 Activate virtual environment
```bash
# On Linux/Mac:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

### 2.4 Install Python dependencies
```bash
pip install -r requirements.txt
```

### 2.5 Configure API Key
Create a `.env` file in the backend directory:
```bash
# On Linux/Mac:
echo "GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw" > .env

# On Windows (Command Prompt):
echo GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw > .env

# Or manually create .env file with:
# GEMINI_API_KEY=your_api_key_here
```

### 2.6 Start the backend server
```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
```

**Keep this terminal open!**

## Step 3: Frontend Setup (3 steps)

### 3.1 Open a NEW terminal and navigate to frontend
```bash
# Make sure you're in the project root directory first
cd atria
cd frontend
```

### 3.2 Install Node dependencies
```bash
npm install
```

This will take 1-2 minutes to download all packages.

### 3.3 Start the frontend server
```bash
npm run dev
```

You should see:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Step 4: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

You should see the WorkDNA landing page!

## Troubleshooting

### Backend Issues

**Issue**: `pip: command not found`
**Solution**: Use `pip3` instead of `pip`

**Issue**: `Permission denied` when creating venv
**Solution**:
- On Linux/Mac: Use `sudo python3 -m venv venv`
- On Windows: Run terminal as Administrator

**Issue**: `Port 5000 is already in use`
**Solution**:
```bash
# On Linux/Mac:
lsof -ti:5000 | xargs kill -9

# On Windows:
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

**Issue**: `ModuleNotFoundError` after pip install
**Solution**: Make sure virtual environment is activated (you should see `(venv)` in terminal)

### Frontend Issues

**Issue**: `npm: command not found`
**Solution**: Install Node.js from https://nodejs.org/

**Issue**: `EACCES` permission errors during npm install
**Solution**:
```bash
# On Linux/Mac:
sudo npm install

# Better solution - fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
```

**Issue**: `Port 3000 is already in use`
**Solution**:
```bash
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

**Issue**: `Vite Error: Cannot find module`
**Solution**: Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Testing the Installation

1. **Landing Page**: Should load with animations and "Get Started" button
2. **Login**: Click "Get Started" → Should show login/signup form
3. **Dashboard**: Login → Should show skill constellation
4. **Quiz**: Navigate to "Take Quiz" → Should generate questions
5. **GitHub**: Try analyzing a GitHub profile

## Next Steps

- Read the [README.md](README.md) for detailed documentation
- Check out [HOW_TO_RUN.md](HOW_TO_RUN.md) for advanced setup
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues

## Quick Commands Reference

### Start Backend (from backend directory)
```bash
source venv/bin/activate  # Windows: venv\Scripts\activate
python app.py
```

### Start Frontend (from frontend directory)
```bash
npm run dev
```

### Stop Servers
Press `Ctrl+C` in each terminal

### Deactivate Virtual Environment
```bash
deactivate
```

## Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Read [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
3. Open an issue on GitHub

Happy coding! 🚀🌌
