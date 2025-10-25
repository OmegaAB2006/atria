@echo off
echo 🌌 Starting WorkDNA - Skill Constellation Tracker
echo ==================================================

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo Error: Node.js is not installed
    pause
    exit /b 1
)

echo Setting up backend...

REM Setup backend
cd backend

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate virtual environment
call venv\Scripts\activate

REM Install dependencies
echo Installing Python dependencies...
pip install -q -r requirements.txt

REM Start backend server
echo Starting backend server on port 5000...
start /B python app.py

cd ..

echo Setting up frontend...

REM Setup frontend
cd frontend

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing Node.js dependencies...
    call npm install
)

REM Start frontend server
echo Starting frontend server on port 3000...
start /B npm run dev

cd ..

echo.
echo ✅ WorkDNA is running!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press any key to stop all servers...

pause >nul

REM Kill all node and python processes (be careful!)
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1

echo Servers stopped.
pause
