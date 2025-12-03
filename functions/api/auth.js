/**
 * Authentication endpoint for admin access
 * POST /api/auth
 *
 * Required environment variables:
 * - ADMIN_PASSWORD: The password for admin access
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { password } = await request.json();

    // Check against the environment variable
    if (password === env.ADMIN_PASSWORD) {
      // Generate a simple token (in production, use JWT or similar)
      const token = btoa(`${password}:${Date.now()}`);

      return new Response(JSON.stringify({
        authenticated: true,
        token: token
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      return new Response(JSON.stringify({
        authenticated: false,
        error: 'Invalid password'
      }), {
        status: 401,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      authenticated: false,
      error: 'Invalid request'
    }), {
      status: 400,
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
