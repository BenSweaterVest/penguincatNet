# 🎡 Restaurant Picker

A beautiful, interactive restaurant picker web app with a spinning wheel interface. Perfect for those indecisive moments when you can't choose where to eat!

## Features

- 🎯 **Spinning Wheel Interface** - Fun and interactive way to pick restaurants
- 🍽️ **Service Type Selection** - Choose between takeout, delivery, or dine-in
- 🏷️ **Food Type Filters** - Filter restaurants by cuisine type
- 🔐 **Admin Authentication** - Secure password-protected admin panel
- ➕ **Restaurant Management** - Add and remove restaurants on the fly
- 💾 **GitHub Storage** - All data stored in your GitHub repository
- ☁️ **Cloudflare Pages** - Fast, global deployment with edge functions

## Live Demo

Once deployed, your app will be available at: `https://your-project.pages.dev`

## Setup Instructions

### 1. Prerequisites

- A GitHub account
- A Cloudflare account (free tier works fine)
- A GitHub Personal Access Token

### 2. Create GitHub Personal Access Token

1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name like "Restaurant Picker"
4. Select the following scopes:
   - `repo` (Full control of private repositories)
5. Click "Generate token"
6. **Important:** Copy the token immediately - you won't be able to see it again!

### 3. Deploy to Cloudflare Pages

#### Option A: Using Cloudflare Dashboard (Recommended)

1. **Connect your GitHub repository**
   - Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Go to "Workers & Pages"
   - Click "Create application" → "Pages" → "Connect to Git"
   - Select your repository

2. **Configure build settings**
   - Framework preset: `None`
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

3. **Set environment variables**

   Go to Settings → Environment variables and add the following:

   **For Production:**
   - `ADMIN_PASSWORD` - Your chosen admin password (e.g., "mySecurePassword123")
   - `GITHUB_TOKEN` - Your GitHub Personal Access Token
   - `GITHUB_REPO` - Your repository in format "username/repo" (e.g., "BenSweaterVest/penguincatNet")
   - `GITHUB_BRANCH` - The branch name (e.g., "claude/cloudflare-tiddlywiki-resume-01VkJojVEWgE8rnzfdSF29fw" or "main")

   **Important:** These are secrets - check the "Encrypt" option for each variable.

4. **Deploy**
   - Click "Save and Deploy"
   - Wait for the deployment to complete
   - Your app will be live at `https://your-project.pages.dev`

#### Option B: Using Wrangler CLI

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
wrangler pages deploy . --project-name=restaurant-picker

# Set environment variables
wrangler pages secret put ADMIN_PASSWORD
wrangler pages secret put GITHUB_TOKEN
wrangler pages secret put GITHUB_REPO
wrangler pages secret put GITHUB_BRANCH
```

### 4. Set the Main HTML File

After deployment, you need to set `restaurant-picker.html` as your main page:

**Option A:** Rename the file to `index.html`:
```bash
mv restaurant-picker.html index.html
git add .
git commit -m "Rename main file to index.html"
git push
```

**Option B:** Configure a redirect in Cloudflare Pages:
1. Go to your Pages project settings
2. Add a redirect from `/` to `/restaurant-picker.html`

## Usage

### For Regular Users

1. Visit your deployed app URL
2. Select your dining preference (takeout, delivery, or dine-in)
3. (Optional) Use the checkboxes on the right to filter by food type
4. Click "SPIN THE WHEEL!" to randomly select a restaurant
5. Enjoy your meal! 🍕

### For Admins

1. Click "Admin Login" in the sidebar
2. Enter your admin password (the one you set in `ADMIN_PASSWORD`)
3. Use the admin panel to:
   - Add new restaurants with food types and service options
   - Delete existing restaurants
4. Click "Logout" when done

## File Structure

```
.
├── restaurant-picker.html          # Main web app (single-page application)
├── restaurants.json                # Restaurant data (managed via admin panel)
├── functions/
│   └── api/
│       ├── auth.js                # Authentication endpoint
│       ├── restaurants.js         # GET/POST restaurants
│       └── restaurants/
│           └── [id].js            # DELETE restaurant by ID
└── README.md                      # This file
```

## Restaurant Data Format

The `restaurants.json` file has the following structure:

```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Mario's Italian Bistro",
      "foodTypes": ["Italian", "Pizza"],
      "serviceTypes": ["takeout", "delivery", "dine-in"],
      "address": "123 Main St",
      "phone": "(555) 123-4567"
    }
  ]
}
```

### Fields:
- `id` - Unique identifier (auto-generated)
- `name` - Restaurant name (required)
- `foodTypes` - Array of cuisine types (required)
- `serviceTypes` - Array of available services: "takeout", "delivery", "dine-in" (required)
- `address` - Physical address (optional)
- `phone` - Contact number (optional)

## Security Notes

- ✅ Admin password is stored as a Cloudflare secret (encrypted)
- ✅ GitHub token is stored as a Cloudflare secret (encrypted)
- ✅ Authentication is required for all write operations
- ✅ CORS is properly configured
- ⚠️ This uses a simple token-based auth - for production use, consider implementing JWT or OAuth

## Customization

### Changing Colors

Edit the CSS in `restaurant-picker.html`:
- Primary gradient: Search for `#667eea` and `#764ba2`
- Wheel colors: Modify the `colors` array in JavaScript

### Adding More Fields

1. Update the restaurant object structure in `restaurants.json`
2. Add form fields in the admin panel HTML
3. Update the `addRestaurant()` function to include new fields

### Modifying the Wheel

Adjust these variables in the JavaScript:
- `minSpins` and `maxSpins` - Control spin duration
- `duration` - Animation length in milliseconds
- Canvas size - Modify `.wheel-container` CSS

## Troubleshooting

### Restaurants Not Loading
- Check that `restaurants.json` exists in your repository
- Verify GitHub token has correct permissions
- Check Cloudflare Functions logs for errors

### Authentication Not Working
- Verify `ADMIN_PASSWORD` environment variable is set
- Make sure you're entering the exact password (case-sensitive)
- Check browser console for API errors

### Changes Not Saving
- Verify `GITHUB_TOKEN` has write permissions
- Check that `GITHUB_REPO` format is correct ("username/repo")
- Ensure `GITHUB_BRANCH` matches your current branch

## Development

To test locally:

```bash
# Install Wrangler
npm install -g wrangler

# Create a .dev.vars file with your secrets
cat > .dev.vars << EOF
ADMIN_PASSWORD=your_password
GITHUB_TOKEN=your_github_token
GITHUB_REPO=username/repo
GITHUB_BRANCH=main
EOF

# Run local dev server
wrangler pages dev . --local
```

Visit `http://localhost:8788/restaurant-picker.html`

## Contributing

Feel free to fork this project and customize it for your needs!

## License

MIT License - feel free to use this for personal or commercial projects.

---

Made with ❤️ and a spinning wheel