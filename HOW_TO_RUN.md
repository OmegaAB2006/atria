# 🚀 How to Run WorkDNA

## Simple 3-Step Guide

---

## Step 1: Start the Backend Server

Open a terminal and run these commands:

```bash
cd "/home/abhignanbs/Desktop/hackathon test page/backend"
source venv/bin/activate
python app.py
```

**What you should see:**

```
 * Serving Flask app 'app'
 * Debug mode: on
 * Running on http://127.0.0.1:5000
```

**✅ Success!** Backend is running on port 5000

⚠️ **Keep this terminal open!** Don't close it.

---

## Step 2: Start the Frontend Server

Open a **NEW** terminal (keep the first one running!) and run:

```bash
cd "/home/abhignanbs/Desktop/hackathon test page/frontend"
npm start
```

**What you should see:**

```
WorkDNA Frontend running on http://localhost:3000
```

**✅ Success!** Frontend is running on port 3000

⚠️ **Keep this terminal open too!** You now have 2 terminals running.

---

## Step 3: Open Your Browser

Open your web browser and go to:

```
http://localhost:3000
```

**✅ You should see the WorkDNA interface!**

---

## 🎯 Now You're Ready to Use It!

### Try These First Steps:

### 1️⃣ Import Skills from GitHub

In the "Import Skills from GitHub" box:

- Enter: `facebook/react`
- Click: **Analyze**
- Wait 3-5 seconds
- Watch your constellation populate with skills!

### 2️⃣ Explore the Constellation

- See the stars (each is a skill)
- Drag them around with your mouse
- Click on a star to see details

### 3️⃣ Take a Quiz

- Click **"Take Quiz"** in the top navigation
- Select a skill (e.g., "JavaScript")
- Select difficulty (e.g., "Medium")
- Click **"Generate Quiz"**
- Wait 5-10 seconds for AI to create questions
- Answer the questions
- Click **"Submit Quiz"**
- See your score and updated constellation!

### 4️⃣ Get Recommendations

- Click **"Recommendations"** in the top navigation
- Click **"Get Recommendations"**
- Wait for AI to analyze your skills
- See personalized learning suggestions!

---

## 🛑 How to Stop

When you're done:

1. Go to the **Backend terminal** and press: `Ctrl + C`
2. Go to the **Frontend terminal** and press: `Ctrl + C`

Both servers will stop.

---

## 🔧 Troubleshooting

### Problem: "Address already in use" or "Port 5000 is in use"

**Solution:**

```bash
# Kill the process using port 5000
lsof -ti:5000 | xargs kill -9

# Then try starting backend again
cd backend
source venv/bin/activate
python app.py
```

### Problem: "Address already in use" or "Port 3000 is in use"

**Solution:**

```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9

# Then try starting frontend again
cd frontend
npm start
```

### Problem: Backend shows errors about missing modules

**Solution:**

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python app.py
```

### Problem: Frontend shows errors

**Solution:**

```bash
cd frontend
rm -rf node_modules
npm install
npm start
```

### Problem: "OpenAI API Error"

**Solution:**
Check that your API key is correct in `backend/.env`:

```bash
cat backend/.env
```

Should show:

```
OPENAI_API_KEY=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
```

---

## 📋 Quick Reference

### Terminals You Need:

- **Terminal 1:** Backend (Python) on port 5000
- **Terminal 2:** Frontend (Node.js) on port 3000

### URLs:

- **Frontend:** http://localhost:3000 ← Open this in browser
- **Backend API:** http://localhost:5000 ← Don't open this, it's for API only

### To Start:

```bash
# Terminal 1
cd "/home/abhignanbs/Desktop/hackathon test page/backend"
source venv/bin/activate
python app.py

# Terminal 2
cd "/home/abhignanbs/Desktop/hackathon test page/frontend"
npm start
```

### To Stop:

Press `Ctrl + C` in both terminals

---

## 🎉 That's It!

Just follow these 3 steps:

1. ✅ Start backend
2. ✅ Start frontend
3. ✅ Open browser to localhost:3000

**Enjoy your WorkDNA app! 🌌**
