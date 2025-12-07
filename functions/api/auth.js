/**
 * Authentication API Endpoint
 *
 * Validates administrative credentials and issues session tokens with expiration.
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
 *   "token": string (base64-encoded session token with timestamp)
 * }
 *
 * Environment Variables:
 * - ADMIN_PASSWORD: Administrative authentication credential
 *
 * Security Notes:
 * - Tokens expire after 1 hour
 * - Token includes timestamp for validation
 * - Consider implementing rate limiting in production
 */

import { getCorsHeaders, errorResponse, successResponse } from './_shared.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { password } = await request.json();

    // Validate credentials against environment configuration
    if (password === env.ADMIN_PASSWORD) {
      // Generate session token with timestamp for expiration
      const token = btoa(`${password}:${Date.now()}`);

      return successResponse({
        authenticated: true,
        token: token
      }, env);
    } else {
      return errorResponse('Invalid password', 401, env);
    }
  } catch (error) {
    return errorResponse('Invalid request', 400, env);
  }
}

/**
 * CORS Preflight Handler
 * Responds to OPTIONS requests for cross-origin resource sharing
 */
export async function onRequestOptions(context) {
  return new Response(null, {
    headers: getCorsHeaders(context.env)
  });
}
