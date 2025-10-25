# Troubleshooting Guide

## Common Errors and Solutions

### 1. OpenAI API - "proxies" Error ✅ FIXED

**Error Message:**
```
TypeError: Client.__init__() got an unexpected keyword argument 'proxies'
```

**Cause:**
Incompatible OpenAI library version (1.12.0 had a bug with httpx)

**Solution:**
The requirements.txt has been updated to use compatible versions:
- `openai==1.54.0` (instead of 1.12.0)
- `httpx==0.27.0` (explicitly specified)

**How to fix if you see this error:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install --upgrade -r requirements.txt
```

---

### 2. Port Already in Use

**Error Message:**
```
Address already in use
Port 5000 is already in use
```

**Solution for Backend (Port 5000):**
```bash
# Linux/Mac
lsof -ti:5000 | xargs kill -9

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Solution for Frontend (Port 3000):**
```bash
# Linux/Mac
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### 3. Module Not Found Errors

**Error Message:**
```
ModuleNotFoundError: No module named 'flask'
ModuleNotFoundError: No module named 'openai'
```

**Solution:**
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

### 4. OpenAI API Key Errors

**Error Message:**
```
Error: Invalid API key
Error: Incorrect API key provided
```

**Solution:**
1. Check the `.env` file exists: `backend/.env`
2. Verify the API key format: Should start with `sk-proj-`
3. Ensure no extra spaces or quotes in .env file:
```bash
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
```

**Error Message:**
```
Error: You exceeded your current quota
```

**Solution:**
1. Check your OpenAI account: https://platform.openai.com/usage
2. Add credits or upgrade your plan
3. Wait for quota reset (if on free tier)

---

### 5. GitHub API Rate Limit

**Error Message:**
```
Error: API rate limit exceeded
Error: 403 rate limit exceeded
```

**Solution:**
1. **Wait**: GitHub resets limits every hour
2. **Add Token** (for higher limits):
   - Generate token: https://github.com/settings/tokens
   - Modify `backend/github_analyzer.py`:
   ```python
   def __init__(self, access_token='YOUR_GITHUB_TOKEN'):
       self.github = Github(access_token) if access_token else Github()
   ```

---

### 6. CORS Errors

**Error Message (in browser console):**
```
Access to fetch at 'http://localhost:5000' has been blocked by CORS policy
```

**Solution:**
```bash
cd backend
source venv/bin/activate
pip install flask-cors==4.0.0
```

Verify `app.py` has:
```python
from flask_cors import CORS
CORS(app)
```

---

### 7. Virtual Environment Not Activating

**Linux/Mac:**
```bash
# If "source venv/bin/activate" doesn't work
python3 -m venv venv --clear
source venv/bin/activate
```

**Windows:**
```batch
# If activation is blocked by execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

---

### 8. Python Version Issues

**Error Message:**
```
SyntaxError: invalid syntax
Python 3.8+ required
```

**Solution:**
```bash
# Check Python version
python3 --version

# Should be 3.8 or higher
# If not, install Python 3.8+ from python.org
```

---

### 9. Node.js/npm Errors

**Error Message:**
```
npm: command not found
node: command not found
```

**Solution:**
1. Install Node.js from https://nodejs.org (LTS version)
2. Verify installation:
```bash
node --version  # Should be 16+
npm --version   # Should be 8+
```

**Error Message:**
```
npm ERR! code ENOENT
```

**Solution:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

### 10. Canvas Not Rendering

**Symptoms:**
- Blank constellation area
- No stars visible
- Console errors about canvas

**Solution:**
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload page (Ctrl+Shift+R)
3. Check browser console for JavaScript errors
4. Ensure JavaScript is enabled
5. Try different browser (Chrome recommended)

---

### 11. Quiz Not Generating

**Symptoms:**
- "Generating quiz..." stays forever
- Error in quiz generation
- Questions don't appear

**Solutions:**

**Check 1: OpenAI API Key**
```bash
cat backend/.env
# Should show valid API key
```

**Check 2: Internet Connection**
```bash
ping openai.com
```

**Check 3: Backend Logs**
Look at backend terminal for error messages

**Check 4: Try Simpler Skill**
- Use "Python" or "JavaScript" instead of niche skills
- Try "easy" difficulty first

---

### 12. GitHub Analysis Fails

**Error Message:**
```
Error: Repository not found
Error: User not found
```

**Solutions:**

**For Repository URL:**
- Ensure repo is public
- Check URL format: `https://github.com/owner/repo`
- Don't include trailing slashes

**For Username:**
- Check username exists on GitHub
- Ensure user has public repositories
- Try: `torvalds`, `gvanrossum`, `dhh` (known users)

---

### 13. Progress Not Updating

**Symptoms:**
- Take quiz but constellation doesn't change
- Progress bars don't move
- Stats don't update

**Solution:**
1. Check browser console for errors
2. Refresh page (F5)
3. Check backend is running
4. Verify API calls in Network tab:
   - `/api/submit-quiz` should return success
   - `/api/get-progress` should return updated data

---

### 14. Slow Performance

**Symptoms:**
- Laggy constellation animation
- Slow page load
- Delayed API responses

**Solutions:**

**Frontend:**
- Close other browser tabs
- Clear browser cache
- Use Chrome for best performance
- Check CPU usage (close heavy apps)

**Backend:**
- Reduce question count (try 3 instead of 5)
- Use "easy" difficulty (faster generation)
- Check internet speed for OpenAI calls

---

### 15. Installation Issues

**Complete Fresh Install:**

```bash
# 1. Remove everything
rm -rf backend/venv
rm -rf frontend/node_modules

# 2. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# 3. Frontend
cd ../frontend
npm cache clean --force
npm install

# 4. Test
cd ../backend
python app.py  # Should start without errors
```

---

## Quick Diagnostic Checklist

Run these commands to check everything:

```bash
# 1. Check Python
python3 --version  # Should be 3.8+

# 2. Check Node
node --version     # Should be 16+
npm --version      # Should be 8+

# 3. Check virtual environment
cd backend
source venv/bin/activate
python -c "import flask, openai; print('OK')"  # Should print "OK"

# 4. Check API key
cat backend/.env | grep OPENAI_API_KEY  # Should show key

# 5. Test backend
curl http://localhost:5000/health  # Should return {"status": "healthy"}

# 6. Test frontend
curl http://localhost:3000  # Should return HTML
```

---

## Getting Help

### Check Logs

**Backend Logs:**
- Look at terminal running `python app.py`
- Check for error messages and tracebacks

**Frontend Logs:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

### Debug Mode

**Enable verbose backend logging:**
```python
# In app.py, Flask automatically runs in debug mode
# You'll see detailed error messages
```

**Enable browser debugging:**
```
F12 → Console → Check "Preserve log"
```

---

## Still Having Issues?

1. **Read error messages carefully** - They usually tell you what's wrong
2. **Check all terminals** - Backend and frontend both need to be running
3. **Restart everything** - Kill all processes and start fresh
4. **Check GitHub Issues** - See if others had same problem
5. **Try the demo repositories** - Use known working examples

### Known Working Test Cases

**GitHub Import:**
- `facebook/react` - Always works
- `django/django` - Always works
- `torvalds` - Always works

**Quiz Generation:**
- Skill: "Python", Difficulty: "easy" - Always works
- Skill: "JavaScript", Difficulty: "medium" - Always works

---

**Last Updated:** After fixing OpenAI compatibility issue
**Tested On:** Python 3.12, Node.js 20, Ubuntu 22.04
