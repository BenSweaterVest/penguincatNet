/**
 * Profile Deletion API Endpoint
 *
 * Handles removal of individual profile records by ID.
 *
 * Endpoint: DELETE /api/profiles/:id
 *
 * Path Parameters:
 * - id: String profile identifier
 *
 * Authentication: Required (Bearer token)
 *
 * Environment Variables:
 * - GITHUB_TOKEN: Personal access token with repo scope
 * - GITHUB_REPO: Target repository in "owner/repository" format
 * - GITHUB_BRANCH: Target branch for commits
 * - ADMIN_PASSWORD: Administrative credential for verification
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
 * DELETE Request Handler
 * Removes profile record by ID with authentication validation
 * @param {Object} context - Cloudflare Pages Functions context
 * @returns {Response} - JSON response with operation result
 */
export async function onRequestDelete(context) {
  const { request, env, params } = context;

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
    const profileId = params.id;

    // Prevent deletion of "all" profile
    if (profileId === 'all') {
      return new Response(JSON.stringify({
        error: 'Cannot delete the default "All Restaurants" profile'
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

    if (!data.profiles) {
      return new Response(JSON.stringify({
        error: 'No profiles found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Locate profile record by ID
    const index = data.profiles.findIndex(p => p.id === profileId);

    if (index === -1) {
      return new Response(JSON.stringify({
        error: 'Profile not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const deletedProfile = data.profiles[index];
    data.profiles.splice(index, 1);

    // Commit changes to repository
    await updateGitHub(
      env,
      data,
      sha,
      `Delete profile: ${deletedProfile.name}`
    );

    return new Response(JSON.stringify({
      success: true,
      deleted: deletedProfile
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('Error deleting profile:', error);

    return new Response(JSON.stringify({
      error: 'Failed to delete profile',
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
      'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
