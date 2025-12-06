# Restaurant Picker

A web-based restaurant selection application utilizing a randomized spinning wheel interface. This application provides a practical solution for group decision-making when selecting dining options.

## Overview

This is a single-page application built for Cloudflare Pages with serverless functions. The application stores restaurant data in a GitHub repository and provides both public-facing selection functionality and password-protected administrative controls.

## Core Features

- **Randomized Selection Interface**: Canvas-based spinning wheel for restaurant selection
- **Dining Profiles**: Configure custom restaurant subsets for different scenarios (e.g., dining with specific people, quick lunch options)
- **Service Type Filtering**: Pre-selection modal for takeout, delivery, or dine-in options
- **Cuisine Filtering**: Dynamic checkbox filters for food type categories
- **Authentication System**: Token-based authentication for administrative functions
- **Data Management**: CRUD operations for restaurant and profile entries via admin panel
- **GitHub Integration**: Restaurant and profile data persisted in repository as JSON
- **Cloudflare Functions**: Serverless API endpoints for data operations

## Deployment Information

Upon deployment to Cloudflare Pages, the application will be accessible at your assigned pages.dev domain or custom domain if configured.

## Setup Instructions

### 1. Prerequisites

- GitHub account with repository access
- Cloudflare account (free tier sufficient)
- GitHub Personal Access Token with appropriate permissions

### 2. GitHub Personal Access Token Generation

1. Navigate to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Select "Generate new token (classic)"
3. Provide a descriptive name for identification purposes
4. Required scopes:
   - `repo` - Full control of private repositories (required for content API access)
5. Generate token and securely store the value
6. Note: Token values are only displayed once at creation time

### 3. Cloudflare Pages Deployment

#### Option A: Dashboard Deployment (Recommended)

**Repository Connection**
1. Access Cloudflare Dashboard at https://dash.cloudflare.com
2. Navigate to Workers & Pages section
3. Select "Create application" → "Pages" → "Connect to Git"
4. Authorize and select the target repository

**Build Configuration**
- Framework preset: `None`
- Build command: (leave empty)
- Build output directory: `/`
- Root directory: `/`

**Environment Variables Configuration**

Navigate to Settings → Environment variables and configure the following:

| Variable | Value | Description |
|----------|-------|-------------|
| `ADMIN_PASSWORD` | User-defined string | Authentication credential for admin panel access |
| `GITHUB_TOKEN` | GitHub PAT | Personal access token for repository API operations |
| `GITHUB_REPO` | `username/repository` | Target repository in owner/name format |
| `GITHUB_BRANCH` | Branch name | Target branch for data persistence (e.g., "main" or feature branch) |

Ensure all variables are marked as encrypted for security purposes.

**Deployment Execution**
1. Save configuration changes
2. Initiate deployment
3. Monitor build logs for successful completion
4. Application will be available at assigned pages.dev subdomain

#### Option B: CLI Deployment via Wrangler

```bash
# Install Wrangler globally
npm install -g wrangler

# Authenticate with Cloudflare
wrangler login

# Deploy to Pages
wrangler pages deploy . --project-name=restaurant-picker

# Configure environment secrets
wrangler pages secret put ADMIN_PASSWORD
wrangler pages secret put GITHUB_TOKEN
wrangler pages secret put GITHUB_REPO
wrangler pages secret put GITHUB_BRANCH
```

### 4. Post-Deployment Configuration

The application is configured to serve from `index.html` in the repository root. This has been pre-configured in the current repository structure. No additional routing configuration is required for standard deployments.

## Usage

### End-User Operations

1. Access the deployed application URL
2. Select service type preference from the initial modal (takeout, delivery, or dine-in)
3. Optionally select a dining profile from the dropdown in the sidebar (e.g., "With Sarah", "Quick Lunch Options")
4. Apply cuisine filters via sidebar checkboxes if desired
5. Activate the randomization mechanism via the spin button
6. View selected restaurant details including contact information and service availability

**Dining Profiles**: Profiles allow you to create custom restaurant subsets for specific scenarios. For example, if dining with someone who travels from a different location, create a profile with restaurants along their route. The "All Restaurants" profile includes all available options.

### Administrative Operations

1. Access admin panel via "Admin Login" button in sidebar
2. Authenticate using the configured `ADMIN_PASSWORD` value
3. Available administrative functions:

   **Restaurant Management:**
   - **Add Restaurant**: Create new restaurant entries with the following fields:
     - Required: name, food types, service types
     - Optional: dining profiles (checkboxes), ordering instructions, menu link, address, phone, notes
   - **Remove Restaurant**: Delete existing entries from the data store

   **Profile Management:**
   - **Add Profile**: Create profile labels (just name required). After creation, profiles can be assigned to restaurants via the restaurant form
   - **Remove Profile**: Delete existing profiles (default "All Restaurants" profile cannot be deleted)

   **Workflow**: Create profiles first using simple names, then tag restaurants with appropriate profiles when adding or editing them. The profile list shows which restaurants are currently tagged with each profile.

4. Administrative session can be terminated via logout function

## Application Structure

```
.
├── index.html                      # Single-page application (client-side)
├── restaurants.json                # Restaurant and profile data store
├── functions/
│   └── api/
│       ├── auth.js                # Authentication endpoint
│       ├── restaurants.js         # Restaurant CRUD operations (GET/POST)
│       ├── restaurants/
│       │   └── [id].js            # Individual restaurant operations (DELETE)
│       ├── profiles.js            # Profile CRUD operations (GET/POST)
│       └── profiles/
│           └── [id].js            # Individual profile operations (DELETE)
└── README.md                      # Documentation
```

## Data Schema

### Restaurant Object Structure

The `restaurants.json` file maintains an array of restaurant objects with the following schema:

```json
{
  "restaurants": [
    {
      "id": 1,
      "name": "Mario's Italian Bistro",
      "foodTypes": ["Italian", "Pizza"],
      "serviceTypes": ["takeout", "delivery", "dine-in"],
      "profiles": ["sarah-enroute", "quick-lunch"],
      "orderMethod": "Call or DoorDash",
      "menuLink": "https://marios-bistro.example.com/menu",
      "address": "123 Main St",
      "phone": "(555) 123-4567",
      "notes": "Excellent for large groups"
    }
  ]
}
```

#### Restaurant Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Integer | Yes | Unique identifier, auto-incremented on creation |
| `name` | String | Yes | Restaurant business name |
| `foodTypes` | Array[String] | Yes | Cuisine categories for filtering |
| `serviceTypes` | Array[String] | Yes | Available service options: "takeout", "delivery", "dine-in" |
| `profiles` | Array[String] | No | Profile IDs this restaurant is tagged with (empty array means no specific profiles) |
| `orderMethod` | String | No | Instructions for ordering (e.g., "DoorDash", "call ahead", "online") |
| `menuLink` | String | No | URL to the restaurant's menu |
| `address` | String | No | Physical location address |
| `phone` | String | No | Contact telephone number |
| `notes` | String | No | Additional information about the restaurant |

### Profile Object Structure

The `restaurants.json` file also maintains an array of dining profile objects. Profiles are lightweight labels that restaurants can be tagged with:

```json
{
  "profiles": [
    {
      "id": "all",
      "name": "All Restaurants"
    },
    {
      "id": "sarah-enroute",
      "name": "With Sarah (En Route)"
    },
    {
      "id": "quick-lunch",
      "name": "Quick Lunch Options"
    }
  ]
}
```

#### Profile Field Specifications

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | String | Yes | Unique identifier, generated from profile name (lowercase, hyphenated) |
| `name` | String | Yes | Display name for the dining profile |

**Data Model**: Profiles are assigned to restaurants via the `profiles` array in each restaurant object, rather than profiles containing restaurant IDs. This restaurant-centric approach makes data management more intuitive and easier to maintain.

**Special Profile**: The "all" profile is a reserved profile ID that shows all restaurants regardless of their profile tags. This profile cannot be deleted.

## Security Considerations

### Current Implementation

The application implements multiple security layers to protect data and prevent unauthorized access:

**Authentication and Authorization:**
- Administrative credentials stored as encrypted environment variables in Cloudflare
- GitHub API token stored as encrypted secret
- Token-based authentication for session management
- Authentication required for all write operations (POST, DELETE)

**Input Validation and Sanitization:**
- Server-side validation of all incoming data
- Type checking for arrays and required fields
- Service type validation against allowed values (takeout, delivery, dine-in)
- Profile ID format validation (lowercase, alphanumeric, hyphens only)
- Reserved keyword protection for profile IDs
- Client-side HTML sanitization to prevent XSS attacks
- URL validation for menu links

**Data Integrity:**
- Cascade cleanup when profiles are deleted (removes profile references from restaurants)
- SHA-based conflict detection for GitHub commits
- Array existence checks before modification operations

**Network Security:**
- CORS headers configured for cross-origin resource sharing
- **IMPORTANT: HTTPS Required** - All production deployments must use HTTPS to protect credentials in transit

### Production Recommendations

For enterprise or high-security deployments, consider implementing:
- JWT (JSON Web Tokens) with expiration for stateless authentication
- OAuth 2.0 integration for identity management
- Rate limiting on API endpoints to prevent brute force attacks
- Audit logging for administrative actions
- Multi-factor authentication for admin access
- Content Security Policy (CSP) headers
- Regular security audits and dependency updates

## Customization Guide

### Visual Styling Modifications

**Color Scheme**
- Primary gradient colors defined in CSS: `#667eea` and `#764ba2`
- Wheel segment colors configured in JavaScript `CONFIG.WHEEL_COLORS` array
- Modify these values in `index.html` for brand consistency

**Wheel Behavior Configuration**

All wheel behavior parameters are centralized in the `CONFIG` constant at the top of the JavaScript section in `index.html`:

- `WHEEL_COLORS`: Array of hex color codes for wheel segments
- `MIN_SPINS`: Minimum rotation cycles (default: 5)
- `MAX_SPINS`: Maximum rotation cycles (default: 8)
- `SPIN_DURATION`: Animation length in milliseconds (default: 4000)
- `CACHE_MAX_AGE`: API response cache duration in seconds (default: 60)

**Layout Dimensions**
- Canvas dimensions: Controlled via `.wheel-container` CSS class
- Responsive breakpoint: 768px (configured in media queries)

### Data Model Extension

To add additional fields to restaurant records:

1. Update the JSON schema in `restaurants.json`
2. Add corresponding form inputs in the admin panel section
3. Modify `addRestaurant()` function to capture new field values
4. Update the result display template to show new fields

## Troubleshooting

### Data Loading Issues

**Symptom**: Restaurant data fails to load or displays empty state

**Resolution Steps**:
1. Verify `restaurants.json` exists in the repository root
2. Confirm GitHub token has `repo` scope permissions
3. Review Cloudflare Functions logs for API errors
4. Validate JSON syntax in data file
5. Check network tab for failed API requests

### Authentication Failures

**Symptom**: Admin login rejected or returns unauthorized error

**Resolution Steps**:
1. Verify `ADMIN_PASSWORD` environment variable is configured
2. Confirm password is case-sensitive and matches exactly
3. Check browser developer console for authentication errors
4. Clear browser cache and retry authentication
5. Verify Cloudflare environment variable is deployed (not just saved)

### Data Persistence Failures

**Symptom**: Restaurant additions or deletions not saving

**Resolution Steps**:
1. Confirm `GITHUB_TOKEN` has write permissions for target repository
2. Validate `GITHUB_REPO` format follows "username/repository" pattern
3. Verify `GITHUB_BRANCH` matches the actual branch name in repository
4. Check GitHub API rate limits have not been exceeded
5. Review Cloudflare Functions logs for GitHub API errors

### Input Validation Errors

**Symptom**: Receiving "Invalid service types" or "Profile ID format" errors when adding data

**Explanation**: The application enforces strict validation rules to maintain data integrity

**Common Validation Rules**:
- Service types must be one of: `takeout`, `delivery`, or `dine-in`
- Profile IDs must contain only lowercase letters, numbers, and hyphens
- Food types and service types must be provided as arrays
- Reserved profile IDs (e.g., "all") cannot be used for custom profiles
- Restaurant names, food types, and service types are required fields

**Resolution**: Ensure submitted data conforms to the validation rules. Check browser console for specific error messages.

## Local Development

### Development Environment Setup

```bash
# Install Wrangler CLI
npm install -g wrangler

# Configure local environment variables
cat > .dev.vars << EOF
ADMIN_PASSWORD=your_password
GITHUB_TOKEN=your_github_token
GITHUB_REPO=username/repo
GITHUB_BRANCH=main
EOF

# Start local development server
wrangler pages dev . --local
```

Access the application at `http://localhost:8788/`

Note: Local development requires Node.js and npm to be installed.

## API Endpoints

### Authentication
- **POST** `/api/auth` - Authenticate and receive session token

### Restaurant Operations
- **GET** `/api/restaurants` - Retrieve all restaurant data
- **POST** `/api/restaurants` - Create new restaurant (requires auth)
- **DELETE** `/api/restaurants/:id` - Remove restaurant by ID (requires auth)

### Profile Operations
- **GET** `/api/profiles` - Retrieve all dining profile data
- **POST** `/api/profiles` - Create new dining profile (requires auth)
- **DELETE** `/api/profiles/:id` - Remove profile by ID (requires auth)

All API endpoints return JSON responses and include appropriate CORS headers.

## Technical Notes

### Architecture and Technology Stack

- Built for Cloudflare Pages with Functions (v2)
- Client-side rendering using vanilla JavaScript (no framework dependencies)
- HTML5 Canvas API for wheel visualization and animations
- GitHub Contents API for serverless data persistence
- No build process, bundlers, or package dependencies required

### Code Quality and Best Practices

The codebase implements several software engineering best practices:

**Security:**
- Input validation and sanitization at both client and server layers
- XSS prevention through HTML escaping
- CORS configuration for cross-origin requests
- Secure token-based authentication

**Code Organization:**
- Configuration constants centralized in `CONFIG` object
- Modular function design with single responsibilities
- JSDoc-style documentation for functions
- Descriptive variable and function naming conventions

**Error Handling:**
- Try-catch blocks for all async operations
- Graceful fallbacks when API calls fail
- User-friendly error messages
- Validation errors with specific feedback

**Data Integrity:**
- SHA-based conflict detection for concurrent modifications
- Cascade cleanup for referential integrity
- Type validation for all data structures
- Array existence checks before modifications

**Performance:**
- Request animation frame for smooth wheel animations
- Easing functions for natural motion
- Response caching with configurable TTL
- Minimal DOM manipulations