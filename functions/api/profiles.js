/**
 * Profile Management API
 *
 * Provides CRUD operations for dining profile data with GitHub-based persistence.
 *
 * Endpoints:
 * - GET  /api/profiles     - Retrieve all profile records (public)
 * - POST /api/profiles     - Create new profile record (authenticated)
 *
 * Data Storage:
 * Utilizes GitHub Contents API for persistent storage in repository JSON file.
 * All modifications are committed directly to the configured branch.
 *
 * Environment Variables:
 * - GITHUB_TOKEN: Personal access token with repo scope
 * - GITHUB_REPO: Target repository in "owner/repository" format
 * - GITHUB_BRANCH: Target branch for commits
 * - ADMIN_PASSWORD: Administrative credential for write operations
 *
 * Authentication:
 * Write operations require Bearer token obtained from /api/auth endpoint.
 */

const RESTAURANT_FILE = 'restaurants.json';

/**
 * Verify authentication token from request headers
 * @param {Request} request - Incoming request object
 * @param {Object} env - Environment variables
 * @returns {boolean} - Authentication status
 */
function verifyAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = atob(token);
    const [password] = decoded.split(':');
    return password === env.ADMIN_PASSWORD;
  } catch {
    return false;
  }
}

/**
 * Retrieve restaurant data file from GitHub repository
 * @param {Object} env - Environment variables containing GitHub credentials
 * @returns {Object} - Object containing parsed data and file SHA
 */
async function fetchFromGitHub(env) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${RESTAURANT_FILE}?ref=${env.GITHUB_BRANCH}`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Restaurant-Picker-App'
    }
  });

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }

  const data = await response.json();
  const content = atob(data.content);
  return {
    data: JSON.parse(content),
    sha: data.sha
  };
}

/**
 * Commit updated restaurant data to GitHub repository
 * @param {Object} env - Environment variables containing GitHub credentials
 * @param {Object} content - Updated restaurant data object
 * @param {string} sha - Current file SHA for conflict detection
 * @param {string} message - Commit message
 * @returns {Object} - GitHub API response
 */
async function updateGitHub(env, content, sha, message) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${RESTAURANT_FILE}`;

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Restaurant-Picker-App'
    },
    body: JSON.stringify({
      message: message,
      content: btoa(JSON.stringify(content, null, 2)),
      sha: sha,
      branch: env.GITHUB_BRANCH
    })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`GitHub update failed: ${response.status} - ${error}`);
  }

  return await response.json();
}

/**
 * GET Request Handler
 * Retrieves all profile records from GitHub storage
 * @param {Object} context - Cloudflare Pages Functions context
 * @returns {Response} - JSON response with profile data
 */
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { data } = await fetchFromGitHub(env);

    return new Response(JSON.stringify({
      profiles: data.profiles || []
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('Error fetching profiles:', error);

    return new Response(JSON.stringify({
      error: 'Failed to fetch profiles',
      profiles: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * POST Request Handler
 * Creates new profile record with authentication validation
 * @param {Object} context - Cloudflare Pages Functions context
 * @returns {Response} - JSON response with operation result
 */
export async function onRequestPost(context) {
  const { request, env } = context;

  // Verify authentication
  if (!verifyAuth(request, env)) {
    return new Response(JSON.stringify({
      error: 'Unauthorized'
    }), {
      status: 401,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }

  try {
    const newProfile = await request.json();

    // Validate required fields per data schema
    if (!newProfile.id || !newProfile.name) {
      return new Response(JSON.stringify({
        error: 'Missing required fields'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Retrieve current data and file SHA
    const { data, sha } = await fetchFromGitHub(env);

    // Ensure profiles array exists
    if (!data.profiles) {
      data.profiles = [{id: 'all', name: 'All Restaurants'}];
    }

    // Check if profile with this ID already exists
    if (data.profiles.find(p => p.id === newProfile.id)) {
      return new Response(JSON.stringify({
        error: 'Profile with this ID already exists'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Append new profile to existing data
    data.profiles.push(newProfile);

    // Commit changes to repository
    await updateGitHub(
      env,
      data,
      sha,
      `Add profile: ${newProfile.name}`
    );

    return new Response(JSON.stringify({
      success: true,
      profile: newProfile
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error adding profile:', error);

    return new Response(JSON.stringify({
      error: 'Failed to add profile',
      details: error.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

/**
 * OPTIONS Request Handler
 * Responds to CORS preflight requests
 * @returns {Response} - CORS headers response
 */
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
