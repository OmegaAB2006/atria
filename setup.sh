#!/bin/bash

# WorkDNA - Automated Setup Script for Linux/Mac
# This script will install dependencies and set up the project

set -e  # Exit on any error

echo "========================================"
echo "  WorkDNA - Automated Setup Script"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Check prerequisites
echo "Step 1: Checking prerequisites..."
echo ""

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version | cut -d' ' -f2)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python3"
elif command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version | cut -d' ' -f2)
    print_success "Python found: $PYTHON_VERSION"
    PYTHON_CMD="python"
else
    print_error "Python not found! Please install Python 3.8+"
    echo "Download from: https://www.python.org/downloads/"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js found: $NODE_VERSION"
else
    print_error "Node.js not found! Please install Node.js 16+"
    echo "Download from: https://nodejs.org/"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm found: v$NPM_VERSION"
else
    print_error "npm not found! Please install Node.js (includes npm)"
    exit 1
fi

echo ""
echo "Step 2: Setting up backend..."
echo ""

# Navigate to backend directory
cd backend

# Create virtual environment
print_info "Creating Python virtual environment..."
$PYTHON_CMD -m venv venv
print_success "Virtual environment created"

# Activate virtual environment
print_info "Activating virtual environment..."
source venv/bin/activate
print_success "Virtual environment activated"

# Install Python dependencies
print_info "Installing Python dependencies..."
pip install --upgrade pip > /dev/null 2>&1
pip install -r requirements.txt
print_success "Python dependencies installed"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_info "Creating .env file..."
    echo "GEMINI_API_KEY=AIzaSyAtG6gB5C-ZnZGqcIhDAsTSPJr8OwYCSCw" > .env
    print_success ".env file created"
else
    print_info ".env file already exists"
fi

# Go back to root directory
cd ..

echo ""
echo "Step 3: Setting up frontend..."
echo ""

# Navigate to frontend directory
cd frontend

# Install Node dependencies
print_info "Installing Node.js dependencies (this may take a minute)..."
npm install
print_success "Node.js dependencies installed"

# Go back to root directory
cd ..

echo ""
echo "========================================"
echo -e "${GREEN}  Setup Complete! 🎉${NC}"
echo "========================================"
echo ""
echo "To start the application:"
echo ""
echo "1. Start the backend (in one terminal):"
echo "   cd backend"
echo "   source venv/bin/activate"
echo "   python app.py"
echo ""
echo "2. Start the frontend (in another terminal):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Open your browser to: http://localhost:3000"
echo ""
echo "Or use the start script:"
echo "   ./start.sh"
echo ""
