/**
 * Restaurant data API with GitHub storage
 * GET /api/restaurants - Fetch all restaurants
 * POST /api/restaurants - Add a new restaurant (requires auth)
 *
 * Required environment variables:
 * - GITHUB_TOKEN: GitHub personal access token
 * - GITHUB_REPO: Repository in format "owner/repo"
 * - GITHUB_BRANCH: Branch name (e.g., "main" or "claude/...")
 * - ADMIN_PASSWORD: Password for verification
 */

const RESTAURANT_FILE = 'restaurants.json';

// Verify authentication token
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

// Fetch file from GitHub
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

// Update file on GitHub
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

// GET - Fetch restaurants
export async function onRequestGet(context) {
  const { env } = context;

  try {
    const { data } = await fetchFromGitHub(env);

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=60'
      }
    });
  } catch (error) {
    console.error('Error fetching restaurants:', error);

    return new Response(JSON.stringify({
      error: 'Failed to fetch restaurants',
      restaurants: []
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// POST - Add restaurant
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
    const newRestaurant = await request.json();

    // Validate required fields
    if (!newRestaurant.name || !newRestaurant.foodTypes || !newRestaurant.serviceTypes) {
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

    // Fetch current data
    const { data, sha } = await fetchFromGitHub(env);

    // Add new restaurant
    data.restaurants.push(newRestaurant);

    // Update GitHub
    await updateGitHub(
      env,
      data,
      sha,
      `Add restaurant: ${newRestaurant.name}`
    );

    return new Response(JSON.stringify({
      success: true,
      restaurant: newRestaurant
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error adding restaurant:', error);

    return new Response(JSON.stringify({
      error: 'Failed to add restaurant',
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

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
