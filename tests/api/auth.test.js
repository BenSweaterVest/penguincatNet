/**
 * Authentication API Tests
 *
 * Tests for /api/auth endpoint
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { onRequestPost, onRequestOptions } from '../../functions/api/auth.js';

describe('Authentication API', () => {
  let context;

  beforeEach(() => {
    context = createExecutionContext();
  });

  it('should return authenticated:true with valid password', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: env.ADMIN_PASSWORD })
    });

    const response = await onRequestPost({ request, env, context });
    await waitOnExecutionContext(context);

    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.authenticated).toBe(true);
    expect(data.token).toBeDefined();
  });

  it('should return authenticated:false with invalid password', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' })
    });

    const response = await onRequestPost({ request, env, context });
    await waitOnExecutionContext(context);

    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.authenticated).toBeUndefined();
    expect(data.error).toBeDefined();
  });

  it('should return error for invalid request body', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json'
    });

    const response = await onRequestPost({ request, env, context });
    await waitOnExecutionContext(context);

    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error).toBeDefined();
  });

  it('should handle OPTIONS request with CORS headers', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'OPTIONS'
    });

    const response = await onRequestOptions({ request, env, context });
    await waitOnExecutionContext(context);

    expect(response.status).toBe(200);
    expect(response.headers.get('Access-Control-Allow-Origin')).toBeDefined();
    expect(response.headers.get('Access-Control-Allow-Methods')).toBeDefined();
  });

  it('should generate token with timestamp for expiration', async () => {
    const request = new Request('http://localhost/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: env.ADMIN_PASSWORD })
    });

    const response = await onRequestPost({ request, env, context });
    const data = await response.json();

    // Decode token to verify it contains timestamp
    const decoded = atob(data.token);
    const parts = decoded.split(':');

    expect(parts).toHaveLength(2);
    expect(parts[0]).toBe(env.ADMIN_PASSWORD);
    expect(parseInt(parts[1])).toBeGreaterThan(0);
  });
});
