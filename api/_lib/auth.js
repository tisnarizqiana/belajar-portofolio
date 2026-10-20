import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { query } from './db.js';

export const SESSION_COOKIE_NAME = 'cms_session';
export const SESSION_DURATION_DAYS = 7;

/**
 * Hash password with bcrypt
 */
export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 12);
}

/**
 * Verify password with bcrypt
 */
export async function verifyPassword(plainPassword, hash) {
  return await bcrypt.compare(plainPassword, hash);
}

/**
 * Hash raw session token using SHA-256 for secure database storage
 */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Generate a cryptographically random session token
 */
export function generateSessionToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Parse cookies from request header
 */
export function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  const pairs = cookieHeader.split(';');
  for (const pair of pairs) {
    const [name, ...rest] = pair.trim().split('=');
    if (name) {
      cookies[name] = decodeURIComponent(rest.join('='));
    }
  }
  return cookies;
}

/**
 * Build Set-Cookie header string
 */
export function serializeSessionCookie(token, maxAgeSeconds = SESSION_DURATION_DAYS * 86400) {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];

  if (isProd) {
    cookieParts.push('Secure');
  }

  return cookieParts.join('; ');
}

/**
 * Build cleared session cookie
 */
export function clearSessionCookie() {
  const isProd = process.env.NODE_ENV === 'production';
  const cookieParts = [
    `${SESSION_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ];

  if (isProd) {
    cookieParts.push('Secure');
  }

  return cookieParts.join('; ');
}

/**
 * Authenticate incoming request using session cookie
 */
export async function authenticateAdmin(req) {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];

  if (!rawToken) {
    return null;
  }

  const tokenHash = hashToken(rawToken);
  const nowIso = new Date().toISOString();

  // Find active session
  const result = await query(
    `SELECT s.id AS session_id, s.expires_at, a.id AS admin_id, a.email, a.is_active
     FROM sessions s
     JOIN admins a ON s.admin_id = a.id
     WHERE s.token_hash = ? AND s.expires_at > ? AND a.is_active = 1
     LIMIT 1`,
    [tokenHash, nowIso]
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0];

  // Asynchronously update last_seen_at without blocking
  query(`UPDATE sessions SET last_seen_at = ? WHERE id = ?`, [nowIso, row.session_id]).catch(() => {});

  return {
    admin: {
      id: row.admin_id,
      email: row.email,
    },
    sessionId: row.session_id,
  };
}

/**
 * Create a new admin session in database
 */
export async function createSession(adminId) {
  const rawToken = generateSessionToken();
  const tokenHash = hashToken(rawToken);
  const sessionId = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_DAYS * 86400 * 1000).toISOString();
  const createdAt = now.toISOString();

  await query(
    `INSERT INTO sessions (id, admin_id, token_hash, expires_at, created_at, last_seen_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [sessionId, adminId, tokenHash, expiresAt, createdAt, createdAt]
  );

  return { rawToken, expiresAt };
}

/**
 * Revoke session
 */
export async function revokeSession(req) {
  const cookies = parseCookies(req.headers.cookie);
  const rawToken = cookies[SESSION_COOKIE_NAME];

  if (rawToken) {
    const tokenHash = hashToken(rawToken);
    await query(`DELETE FROM sessions WHERE token_hash = ?`, [tokenHash]);
  }
}
