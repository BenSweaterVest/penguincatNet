# Quick Start Guide

Get the Restaurant Picker up and running in 5 minutes!

## 🚀 **Option 1: Cloudflare Pages (Recommended)**

### **Step 1: Fork the Repository**
Click "Fork" on GitHub to create your own copy.

### **Step 2: Create Cloudflare Account**
Sign up at https://dash.cloudflare.com (free tier works great!)

### **Step 3: Connect to Cloudflare Pages**
1. Go to **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**
2. Select your forked repository
3. Use these build settings:
   - **Framework preset:** None
   - **Build command:** (leave empty)
   - **Build output directory:** `/`

### **Step 4: Set Environment Variables**
In **Settings** → **Environment variables**, add:

| Variable | Value | Example |
|----------|-------|---------|
| `ADMIN_PASSWORD` | Your admin password | `mySecurePassword123` |
| `GITHUB_TOKEN` | GitHub Personal Access Token | `ghp_xxxxxxxxxxxx` |
| `GITHUB_REPO` | Your repository | `yourusername/penguincatNet` |
| `GITHUB_BRANCH` | Branch for data | `main` |

**Generate GitHub Token:** https://github.com/settings/tokens/new
- Scope needed: `repo` (for classic token) or `Contents: Read and write` (for fine-grained)

### **Step 5: Deploy!**
Click **Save and Deploy**. Your app will be live at `your-project.pages.dev` in ~2 minutes!

---

## 🏠 **Option 2: Local Development**

### **Prerequisites**
- Node.js 18+
- Git

### **Setup Steps**

```bash
# Clone your fork
git clone https://github.com/yourusername/penguincatNet.git
cd penguincatNet

# Install dependencies
npm install

# Create local environment file
cat > .dev.vars << EOF
ADMIN_PASSWORD=test123
GITHUB_TOKEN=your_github_token_here
GITHUB_REPO=yourusername/penguincatNet
GITHUB_BRANCH=main
EOF

# Start development server
npm run dev
```

Open http://localhost:8788 and you're ready!

---

## 🎮 **First Time Using the App**

### **Add Your First Restaurant**
1. Click **"Admin Login"** in the sidebar
2. Enter your `ADMIN_PASSWORD`
3. Scroll to **"Add Restaurant"**
4. Fill in:
   - Restaurant name
   - Check food types
   - Check service types
5. Click **"Add Restaurant"**
6. Click **"Save All Changes"** to persist to GitHub

### **Create a Profile**
1. In the admin panel, scroll to **"Manage Profiles"**
2. Enter a profile name (e.g., "Date Night")
3. Click **"Add Profile"**
4. Now you can assign restaurants to this profile!

### **Use the Wheel**
1. Select a profile from the dropdown (or "All Restaurants")
2. Optionally filter by service type or food type
3. Click **"Spin to Select"**
4. Enjoy your restaurant choice! 🎉

---

## 🔧 **Common Issues**

**Q: "Failed to fetch restaurants"**
- Check that `GITHUB_TOKEN` has correct permissions
- Verify `GITHUB_REPO` format is `username/repository`
- Make sure `restaurants.json` exists in your repo

**Q: "Login doesn't work"**
- Verify `ADMIN_PASSWORD` is set in environment variables
- Check that variable is deployed (not just saved)
- Try hard refresh (Ctrl+F5 or Cmd+Shift+R)

**Q: "Changes aren't saving"**
- Ensure GitHub token has write access
- Check `GITHUB_BRANCH` matches an existing branch
- Look in Cloudflare Functions logs for errors

---

## 📚 **Next Steps**

- Read the [README.md](README.md) for full documentation
- Check [CONTRIBUTING.md](CONTRIBUTING.md) if you want to contribute
- See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for adding new features
- View API docs: Upload `openapi.yaml` to https://editor.swagger.io

---

## 🆘 **Need Help?**

- GitHub Issues: https://github.com/BenSweaterVest/penguincatNet/issues
- Check the [README Troubleshooting section](README.md#troubleshooting)

**Enjoy your Restaurant Picker!** 🍕🎡
