# WorkDNA - Complete Installation Guide

This guide covers installation on Windows, macOS, and Linux systems.

## Table of Contents
1. [Prerequisites Installation](#prerequisites-installation)
2. [Project Setup](#project-setup)
3. [Platform-Specific Instructions](#platform-specific-instructions)
4. [Verification](#verification)
5. [Common Issues](#common-issues)

---

## Prerequisites Installation

### Windows

#### Python 3.8+
1. Download from: https://www.python.org/downloads/
2. Run the installer
3. **IMPORTANT**: Check "Add Python to PATH" during installation
4. Verify installation:
   ```cmd
   python --version
   ```

#### Node.js 16+
1. Download from: https://nodejs.org/
2. Download the LTS (Long Term Support) version
3. Run the installer (default settings are fine)
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### Git
1. Download from: https://git-scm.com/download/win
2. Run the installer (default settings are fine)
3. Verify installation:
   ```cmd
   git --version
   ```

### macOS

#### Using Homebrew (Recommended)

If you don't have Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Install prerequisites:
```bash
# Install Python
brew install python@3.11

# Install Node.js
brew install node

# Install Git (usually pre-installed)
brew install git
```

#### Manual Installation

**Python:**
1. Download from: https://www.python.org/downloads/
2. Run the .pkg installer

**Node.js:**
1. Download from: https://nodejs.org/
2. Run the .pkg installer

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install Python
sudo apt install python3 python3-pip python3-venv

# Install Node.js and npm
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install git

# Verify installations
python3 --version
node --version
npm --version
git --version
```

### Linux (Fedora/RHEL/CentOS)

```bash
# Install Python
sudo dnf install python3 python3-pip

# Install Node.js
sudo dnf install nodejs npm

# Install Git
sudo dnf install git

# Verify installations
python3 --version
node --version
npm --version
git --version
```

### Linux (Arch)

```bash
# Install Python
sudo pacman -S python python-pip

# Install Node.js
sudo pacman -S nodejs npm

# Install Git
sudo pacman -S git

# Verify installations
python --version
node --version
npm --version
git --version
```

---

## Project Setup

### Automated Setup (Recommended)

#### Windows
1. Clone the repository:
   ```cmd
   git clone https://github.com/OmegaAB2006/atria.git
   cd atria
   ```

2. Run the setup script:
   ```cmd
   setup.bat
   ```

3. Start the application:
   ```cmd
   start.bat
   ```

#### macOS/Linux
1. Clone the repository:
   ```bash
   git clone https://github.com/OmegaAB2006/atria.git
   cd atria
   ```

2. Make scripts executable:
   ```bash
   chmod +x setup.sh start.sh
   ```

3. Run the setup script:
   ```bash
   ./setup.sh
   ```

4. Start the application:
   ```bash
   ./start.sh
   ```

### Manual Setup

If the automated scripts don't work, follow these steps:

#### 1. Clone Repository
```bash
git clone https://github.com/OmegaAB2006/atria.git
cd atria
```

#### 2. Backend Setup

**Navigate to backend:**
```bash
cd backend
```

**Create virtual environment:**
```bash
# Windows
python -m venv venv

# macOS/Linux
python3 -m venv venv
```

**Activate virtual environment:**
```bash
# Windows (Command Prompt)
venv\Scripts\activate

# Windows (PowerShell)
venv\Scripts\Activate.ps1

# macOS/Linux
source venv/bin/activate
```

You should see `(venv)` in your terminal prompt.

**Install dependencies:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**Create .env file:**
```bash
# Windows
echo GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw > .env

# macOS/Linux
echo "GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw" > .env
```

Or manually create a file named `.env` with:
```
GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw
```

**Start backend server:**
```bash
# Windows
python app.py

# macOS/Linux
python app.py  # or python3 app.py
```

Keep this terminal open!

#### 3. Frontend Setup

**Open a NEW terminal** and navigate to frontend:
```bash
cd atria/frontend
```

**Install dependencies:**
```bash
npm install
```

This will take 1-2 minutes to download all packages.

**Start frontend server:**
```bash
npm run dev
```

Keep this terminal open!

---

## Platform-Specific Instructions

### Windows PowerShell Users

If you get an "Execution Policy" error when activating venv:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then activate again:
```powershell
venv\Scripts\Activate.ps1
```

### macOS Users

If you get a "Permission Denied" error:

```bash
sudo chmod +x setup.sh start.sh
./setup.sh
```

If pip install fails:
```bash
python3 -m pip install --user --upgrade pip
python3 -m pip install --user -r requirements.txt
```

### Linux Users

If you get "python: command not found":
```bash
# Use python3 instead
python3 -m venv venv
source venv/bin/activate
python3 app.py
```

If npm install fails with permission errors:
```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install
```

---

## Verification

### Backend Verification

1. Backend should be running on: http://localhost:5000
2. You should see output like:
   ```
   * Running on http://127.0.0.1:5000
   * Debugger is active!
   ```

### Frontend Verification

1. Frontend should be running on: http://localhost:3000
2. You should see output like:
   ```
   VITE v4.x.x  ready in xxx ms
   ➜  Local:   http://localhost:3000/
   ```

### Application Verification

Open http://localhost:3000 in your browser:

1. ✅ You should see the WorkDNA landing page
2. ✅ Click "Get Started" - should show login page
3. ✅ Login - should show skill constellation
4. ✅ Navigate to "Take Quiz" - should work
5. ✅ Try other features (GitHub import, Team Matrix, etc.)

---

## Common Issues

### Issue: Port Already in Use

**Backend (Port 5000)**

Windows:
```cmd
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

macOS/Linux:
```bash
lsof -ti:5000 | xargs kill -9
```

**Frontend (Port 3000)**

Windows:
```cmd
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F
```

macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: pip/pip3 not found

```bash
# Use python -m pip instead
python -m pip install -r requirements.txt

# Or
python3 -m pip install -r requirements.txt
```

### Issue: npm EACCES permission errors

macOS/Linux:
```bash
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

Or use nvm (Node Version Manager):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install --lts
```

### Issue: Virtual environment activation fails

Windows - If you can't activate venv:
```cmd
# Try this alternative
python -m venv venv --without-pip
venv\Scripts\activate
python -m ensurepip
pip install -r requirements.txt
```

### Issue: ModuleNotFoundError after pip install

Make sure virtual environment is activated:
- You should see `(venv)` in your prompt
- If not, activate it again

Then reinstall:
```bash
pip install --force-reinstall -r requirements.txt
```

### Issue: Gemini API errors

If you see API errors:
1. Check your .env file exists in the backend directory
2. Verify the API key is correct
3. Check your internet connection
4. Try regenerating the API key at: https://makersuite.google.com/app/apikey

### Issue: Frontend won't build

Delete node_modules and reinstall:
```bash
cd frontend
rm -rf node_modules package-lock.json  # or 'rmdir /s node_modules' on Windows
npm install
npm run dev
```

---

## Getting Help

If you're still having issues:

1. Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) file
2. Read the [QUICK_START.md](QUICK_START.md) guide
3. Check the [README.md](README.md) for detailed documentation
4. Open an issue on GitHub: https://github.com/OmegaAB2006/atria/issues

---

## Next Steps

Once installation is complete:

1. Read the [README.md](README.md) for feature documentation
2. Check [HOW_TO_RUN.md](HOW_TO_RUN.md) for usage instructions
3. Explore the application at http://localhost:3000

Happy coding! 🚀🌌
