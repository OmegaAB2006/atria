#!/bin/bash

# WorkDNA Setup Verification Script

echo "🔍 WorkDNA Setup Verification"
echo "=============================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check version
check_version() {
    VERSION=$($1)
    echo -e "${GREEN}  →${NC} Version: $VERSION"
}

# 1. Check Python
echo "1. Checking Python..."
if check_command python3; then
    check_version "python3 --version"
    PYTHON_VERSION=$(python3 -c 'import sys; print(".".join(map(str, sys.version_info[:2])))')
    REQUIRED_VERSION="3.8"
    if awk "BEGIN {exit !($PYTHON_VERSION >= $REQUIRED_VERSION)}"; then
        echo -e "${GREEN}  →${NC} Version OK (>= 3.8)"
    else
        echo -e "${RED}  →${NC} Version too old (need >= 3.8)"
        ERRORS=$((ERRORS + 1))
    fi
fi
echo ""

# 2. Check Node.js
echo "2. Checking Node.js..."
if check_command node; then
    check_version "node --version"
fi
echo ""

# 3. Check npm
echo "3. Checking npm..."
if check_command npm; then
    check_version "npm --version"
fi
echo ""

# 4. Check backend directory
echo "4. Checking backend directory..."
if [ -d "backend" ]; then
    echo -e "${GREEN}✓${NC} backend/ exists"

    # Check virtual environment
    if [ -d "backend/venv" ]; then
        echo -e "${GREEN}✓${NC} Virtual environment exists"
    else
        echo -e "${YELLOW}⚠${NC} Virtual environment not created"
        echo -e "  ${YELLOW}→${NC} Run: cd backend && python3 -m venv venv"
        WARNINGS=$((WARNINGS + 1))
    fi

    # Check .env file
    if [ -f "backend/.env" ]; then
        echo -e "${GREEN}✓${NC} .env file exists"
        if grep -q "OPENAI_API_KEY=sk-" backend/.env; then
            echo -e "${GREEN}✓${NC} OpenAI API key is set"
        else
            echo -e "${RED}✗${NC} OpenAI API key is missing or invalid"
            ERRORS=$((ERRORS + 1))
        fi
    else
        echo -e "${RED}✗${NC} .env file missing"
        ERRORS=$((ERRORS + 1))
    fi

    # Check Python dependencies
    if [ -d "backend/venv" ]; then
        source backend/venv/bin/activate
        echo -e "${GREEN}  →${NC} Checking Python packages..."

        if python -c "import flask" 2>/dev/null; then
            echo -e "${GREEN}  ✓${NC} flask installed"
        else
            echo -e "${RED}  ✗${NC} flask not installed"
            ERRORS=$((ERRORS + 1))
        fi

        if python -c "import openai" 2>/dev/null; then
            echo -e "${GREEN}  ✓${NC} openai installed"
            OPENAI_VERSION=$(python -c "import openai; print(openai.__version__)")
            echo -e "${GREEN}    →${NC} Version: $OPENAI_VERSION"
        else
            echo -e "${RED}  ✗${NC} openai not installed"
            ERRORS=$((ERRORS + 1))
        fi

        if python -c "import github" 2>/dev/null; then
            echo -e "${GREEN}  ✓${NC} PyGithub installed"
        else
            echo -e "${RED}  ✗${NC} PyGithub not installed"
            ERRORS=$((ERRORS + 1))
        fi

        deactivate
    fi
else
    echo -e "${RED}✗${NC} backend/ directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 5. Check frontend directory
echo "5. Checking frontend directory..."
if [ -d "frontend" ]; then
    echo -e "${GREEN}✓${NC} frontend/ exists"

    # Check node_modules
    if [ -d "frontend/node_modules" ]; then
        echo -e "${GREEN}✓${NC} node_modules exists"
    else
        echo -e "${YELLOW}⚠${NC} node_modules not installed"
        echo -e "  ${YELLOW}→${NC} Run: cd frontend && npm install"
        WARNINGS=$((WARNINGS + 1))
    fi

    # Check package.json
    if [ -f "frontend/package.json" ]; then
        echo -e "${GREEN}✓${NC} package.json exists"
    else
        echo -e "${RED}✗${NC} package.json missing"
        ERRORS=$((ERRORS + 1))
    fi

    # Check public/index.html
    if [ -f "frontend/public/index.html" ]; then
        echo -e "${GREEN}✓${NC} public/index.html exists"
    else
        echo -e "${RED}✗${NC} public/index.html missing"
        ERRORS=$((ERRORS + 1))
    fi
else
    echo -e "${RED}✗${NC} frontend/ directory not found"
    ERRORS=$((ERRORS + 1))
fi
echo ""

# 6. Check ports
echo "6. Checking ports..."
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} Port 5000 is in use (backend may already be running)"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} Port 5000 is available"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠${NC} Port 3000 is in use (frontend may already be running)"
    WARNINGS=$((WARNINGS + 1))
else
    echo -e "${GREEN}✓${NC} Port 3000 is available"
fi
echo ""

# Summary
echo "=============================="
echo "Summary:"
echo -e "  ${GREEN}Errors: $ERRORS${NC}"
echo -e "  ${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! You're ready to go!${NC}"
    echo ""
    echo "To start the application:"
    echo "  ./start.sh"
    echo ""
    echo "Or manually:"
    echo "  Terminal 1: cd backend && source venv/bin/activate && python app.py"
    echo "  Terminal 2: cd frontend && npm start"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠ Setup is mostly complete, but please address the warnings above.${NC}"
    exit 0
else
    echo -e "${RED}✗ Please fix the errors above before running the application.${NC}"
    echo ""
    echo "Quick fixes:"
    if [ ! -d "backend/venv" ]; then
        echo "  cd backend && python3 -m venv venv"
    fi
    if [ ! -d "frontend/node_modules" ]; then
        echo "  cd frontend && npm install"
    fi
    echo "  pip install -r backend/requirements.txt"
    exit 1
fi
