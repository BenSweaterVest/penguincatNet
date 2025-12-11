/**
 * Authentication API Endpoint
 *
 * Validates administrative credentials and issues session tokens.
 *
 * Endpoint: POST /api/auth
 *
 * Request Body:
 * {
 *   "password": string
 * }
 *
 * Response:
 * {
 *   "authenticated": boolean,
 *   "token": string (base64-encoded session token)
 * }
 *
 * Environment Variables:
 * - ADMIN_PASSWORD: Administrative authentication credential
 *
 * Security Note:
 * Current implementation uses basic token generation. For production environments,
 * consider implementing JWT with expiration and refresh token mechanisms.
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { password } = await request.json();

    // Validate credentials against environment configuration
    if (password === env.ADMIN_PASSWORD) {
      // Generate session token (timestamp-based for simplicity)
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

/**
 * CORS Preflight Handler
 * Responds to OPTIONS requests for cross-origin resource sharing
 */
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
