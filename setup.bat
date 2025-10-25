@echo off
REM WorkDNA - Automated Setup Script for Windows
REM This script will install dependencies and set up the project

echo ========================================
echo   WorkDNA - Automated Setup Script
echo ========================================
echo.

REM Check Python
echo Step 1: Checking prerequisites...
echo.

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found! Please install Python 3.8+
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
) else (
    for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
    echo [OK] Python found: %PYTHON_VERSION%
)

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found! Please install Node.js 16+
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
    echo [OK] Node.js found: %NODE_VERSION%
)

REM Check npm
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm not found! Please install Node.js (includes npm)
    pause
    exit /b 1
) else (
    for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo [OK] npm found: v%NPM_VERSION%
)

echo.
echo Step 2: Setting up backend...
echo.

REM Navigate to backend directory
cd backend

REM Create virtual environment
echo [INFO] Creating Python virtual environment...
python -m venv venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment
    pause
    exit /b 1
)
echo [OK] Virtual environment created

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat
echo [OK] Virtual environment activated

REM Upgrade pip
echo [INFO] Upgrading pip...
python -m pip install --upgrade pip >nul 2>&1

REM Install Python dependencies
echo [INFO] Installing Python dependencies...
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Python dependencies
    pause
    exit /b 1
)
echo [OK] Python dependencies installed

REM Create .env file if it doesn't exist
if not exist .env (
    echo [INFO] Creating .env file...
    echo GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw > .env
    echo [OK] .env file created
) else (
    echo [INFO] .env file already exists
)

REM Go back to root directory
cd ..

echo.
echo Step 3: Setting up frontend...
echo.

REM Navigate to frontend directory
cd frontend

REM Install Node dependencies
echo [INFO] Installing Node.js dependencies (this may take a minute)...
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo [OK] Node.js dependencies installed

REM Go back to root directory
cd ..

echo.
echo ========================================
echo   Setup Complete! 🎉
echo ========================================
echo.
echo To start the application:
echo.
echo 1. Start the backend (in one terminal):
echo    cd backend
echo    venv\Scripts\activate
echo    python app.py
echo.
echo 2. Start the frontend (in another terminal):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Open your browser to: http://localhost:3000
echo.
echo Or use the start script:
echo    start.bat
echo.
pause
