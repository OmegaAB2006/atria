# WorkDNA - Command Reference

Quick reference for all commands you need to run WorkDNA.

## Quick Start Commands

### One-Command Setup and Run

**Windows:**
```cmd
setup.bat && start.bat
```

**macOS/Linux:**
```bash
./setup.sh && ./start.sh
```

---

## Installation Commands

### First-Time Setup

#### Windows
```cmd
git clone https://github.com/OmegaAB2006/atria.git
cd atria
setup.bat
```

#### macOS/Linux
```bash
git clone https://github.com/OmegaAB2006/atria.git
cd atria
chmod +x setup.sh start.sh
./setup.sh
```

---

## Running the Application

### Start Both Servers (Automated)

**Windows:**
```cmd
start.bat
```

**macOS/Linux:**
```bash
./start.sh
```

### Start Servers Manually

#### Terminal 1 - Backend

**Windows:**
```cmd
cd backend
venv\Scripts\activate
python app.py
```

**macOS/Linux:**
```bash
cd backend
source venv/bin/activate
python app.py
```

#### Terminal 2 - Frontend

**All Platforms:**
```bash
cd frontend
npm run dev
```

---

## Stopping the Application

### Stop Automated Scripts

**Windows:**
- Press any key in the terminal

**macOS/Linux:**
- Press `Ctrl+C` in the terminal

### Stop Manual Servers

In each terminal window:
- Press `Ctrl+C`

### Force Kill Servers

**Windows:**
```cmd
taskkill /F /IM python.exe
taskkill /F /IM node.exe
```

**macOS/Linux:**
```bash
# Kill backend
lsof -ti:5000 | xargs kill -9

# Kill frontend
lsof -ti:3000 | xargs kill -9
```

---

## Maintenance Commands

### Update Dependencies

#### Backend
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt --upgrade
```

#### Frontend
```bash
cd frontend
npm update
```

### Reinstall Everything

#### Backend
```bash
cd backend
rm -rf venv  # Windows: rmdir /s venv
python -m venv venv  # Windows: python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json  # Windows: rmdir /s node_modules
npm install
```

---

## Git Commands

### Clone Repository
```bash
git clone https://github.com/OmegaAB2006/atria.git
```

### Update from GitHub
```bash
git pull origin main
```

### Check Status
```bash
git status
```

### See Changes
```bash
git diff
```

---

## Development Commands

### Backend Development

#### Activate Virtual Environment
```bash
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate
```

#### Deactivate Virtual Environment
```bash
deactivate
```

#### Run Backend with Debug Mode
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
export FLASK_DEBUG=1  # Windows: set FLASK_DEBUG=1
python app.py
```

#### Install New Python Package
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install package-name
pip freeze > requirements.txt
```

### Frontend Development

#### Run Development Server
```bash
cd frontend
npm run dev
```

#### Build for Production
```bash
cd frontend
npm run build
```

#### Preview Production Build
```bash
cd frontend
npm run preview
```

#### Install New NPM Package
```bash
cd frontend
npm install package-name
npm install --save-dev package-name  # for dev dependencies
```

#### Check for Outdated Packages
```bash
cd frontend
npm outdated
```

---

## Testing Commands

### Test Backend API

```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Test quiz generation (Linux/Mac)
curl -X POST http://localhost:5000/api/generate-quiz \
  -H "Content-Type: application/json" \
  -d '{"skill":"Python","difficulty":"medium","question_count":3}'
```

### Test Frontend Build

```bash
cd frontend
npm run build
npm run preview
```

---

## Troubleshooting Commands

### Check Versions

```bash
python --version
python3 --version
node --version
npm --version
git --version
```

### Check Running Processes

**Windows:**
```cmd
# Check what's on port 5000
netstat -ano | findstr :5000

# Check what's on port 3000
netstat -ano | findstr :3000
```

**macOS/Linux:**
```bash
# Check what's on port 5000
lsof -i :5000

# Check what's on port 3000
lsof -i :3000
```

### Clean Everything and Restart

**Windows:**
```cmd
cd backend
rmdir /s venv
cd ..

cd frontend
rmdir /s node_modules
del package-lock.json
cd ..

setup.bat
start.bat
```

**macOS/Linux:**
```bash
# Clean backend
cd backend
rm -rf venv
cd ..

# Clean frontend
cd frontend
rm -rf node_modules package-lock.json
cd ..

# Reinstall
./setup.sh
./start.sh
```

---

## Environment Variables

### Update API Key

Edit `backend/.env`:
```
GEMINI_API_KEY=your_new_api_key_here
```

Or from command line:

**Windows:**
```cmd
cd backend
echo GEMINI_API_KEY=your_new_api_key_here > .env
```

**macOS/Linux:**
```bash
cd backend
echo "GEMINI_API_KEY=your_new_api_key_here" > .env
```

---

## Useful Shortcuts

### Open Application URLs

**Backend API:**
```
http://localhost:5000
```

**Frontend:**
```
http://localhost:3000
```

### Quick Reset

If something goes wrong:

1. Stop all servers (Ctrl+C)
2. Deactivate venv: `deactivate`
3. Run setup again: `./setup.sh` (or `setup.bat`)
4. Start again: `./start.sh` (or `start.bat`)

---

## Platform-Specific Notes

### Windows-Specific

```cmd
# Use these instead of Linux/Mac commands
dir                    # instead of ls
type file.txt          # instead of cat file.txt
del file.txt           # instead of rm file.txt
rmdir /s folder        # instead of rm -rf folder
copy file1 file2       # instead of cp file1 file2
move file1 file2       # instead of mv file1 file2
```

### macOS/Linux-Specific

```bash
# Make scripts executable
chmod +x setup.sh start.sh

# Use python3 if python doesn't work
python3 --version
python3 -m venv venv
python3 app.py
```

---

## Getting Help

### View Logs

**Backend logs:**
- Check the terminal where `python app.py` is running

**Frontend logs:**
- Check the terminal where `npm run dev` is running
- Check browser console (F12 → Console tab)

### Documentation

- Full setup guide: [INSTALLATION.md](INSTALLATION.md)
- Quick start: [QUICK_START.md](QUICK_START.md)
- Troubleshooting: [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- Main documentation: [README.md](README.md)

---

## Summary of Most Used Commands

```bash
# First time setup
git clone https://github.com/OmegaAB2006/atria.git
cd atria
./setup.sh          # Windows: setup.bat

# Every time you want to run
./start.sh          # Windows: start.bat

# Stop servers
Ctrl+C              # In each terminal

# Update code
git pull origin main

# Clean reinstall
./setup.sh          # Windows: setup.bat
```

That's it! Keep this file handy for quick reference. 📚
