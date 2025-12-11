# ⚡ Quick Start Guide

Get your EventFlow app running in 5 minutes!

## 🎯 Option 1: Run As-Is (Fastest)

Your app is currently in a single file (`src/App.jsx`) and ready to run immediately.

### Steps:

```bash
# 1. Navigate to project folder
cd event-planner-pro

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser to http://localhost:5173
```

**That's it!** Your app is running. ✅

---

## 🏗️ Option 2: Restructure First (Recommended for Production)

If you want proper code organization before running:

### Phase 1: Quick Restructure (30 minutes)

1. **Extract Mock Data**
   ```bash
   # Follow RESTRUCTURING_GUIDE.md Phase 1
   # Create src/data/mockData.js
   # Move MOCK_DATA from App.jsx
   ```

2. **Extract 2-3 Components**
   ```bash
   # Start with simplest:
   # - Header
   # - BottomNav
   # - NotificationsPanel
   ```

3. **Test**
   ```bash
   npm run dev
   # Verify everything still works
   ```

### Phase 2: Full Restructure (2-3 hours)

Follow the complete `RESTRUCTURING_GUIDE.md` to organize all components properly.

---

## 🚀 Option 3: Deploy Immediately

Deploy the current version and restructure later:

### Deploy to Vercel (2 minutes):

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
# Get live URL instantly!
```

### Deploy to Netlify (3 minutes):

```bash
# Build the app
npm run build

# Drag & drop 'dist' folder to netlify.com
# Done!
```

---

## 📋 What You Have Right Now

```
event-planner-pro/
├── src/
│   ├── App.jsx           ← YOUR ENTIRE APP (3159 lines)
│   ├── main.jsx          ← Entry point
│   └── index.css         ← Styles
├── package.json          ← Dependencies
├── vite.config.js        ← Build config
├── index.html            ← HTML template
└── README.md             ← Documentation
```

---

## 🎓 Choose Your Path

### Path A: "Show Me Now!" 🏃‍♂️
```bash
npm install
npm run dev
```
**Time:** 2 minutes  
**Result:** App running locally

---

### Path B: "Let's Deploy!" 🚀
```bash
npm install
npm run build
vercel
```
**Time:** 5 minutes  
**Result:** App live on internet

---

### Path C: "Proper Setup First" 🏗️
```bash
# Follow RESTRUCTURING_GUIDE.md
# Organize code properly
# Then deploy
```
**Time:** 2-3 hours  
**Result:** Production-ready code structure

---

## 💡 Recommendation

**For Learning/Testing:**
- Choose Path A → Run immediately

**For Quick Demo:**
- Choose Path B → Deploy as-is, restructure later

**For Real Project:**
- Choose Path C → Do it right from the start

---

## 🆘 Troubleshooting

### "npm not found"
```bash
# Install Node.js first from nodejs.org
# Then try again
```

### "Module not found"
```bash
# Make sure you ran:
npm install
```

### "Port 5173 already in use"
```bash
# Kill existing process or use different port:
npm run dev -- --port 3000
```

---

## ✅ Success Checklist

After running, you should see:

- ✅ Dashboard with KPIs
- ✅ Navigation working (Events, Tasks, Team, etc.)
- ✅ Can create new events
- ✅ Can create and assign tasks
- ✅ Notifications working
- ✅ Responsive on mobile

---

## 🎯 Next Steps

Once running:

1. **Explore Features**
   - Try creating an event
   - Add tasks
   - Assign workers
   - Check analytics

2. **Customize**
   - Change colors in tailwind.config.js
   - Update branding in App.jsx
   - Modify mock data in App.jsx

3. **Deploy**
   - Follow DEPLOYMENT_GUIDE.md
   - Share with others!

---

**Need help?** Check the other guide files:
- `README.md` - Overview
- `RESTRUCTURING_GUIDE.md` - Code organization
- `DEPLOYMENT_GUIDE.md` - Publishing to web

Happy coding! 🎉
