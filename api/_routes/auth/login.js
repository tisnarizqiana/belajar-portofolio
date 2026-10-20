import { query } from '../../_lib/db.js';
import { verifyPassword, createSession, serializeSessionCookie } from '../../_lib/auth.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../../_lib/http.js';
import { checkRateLimit, getClientIp } from '../../_lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  if (!verifyCsrf(req)) {
    return errorResponse(res, 403, 'Cross-site request blocked');
  }

  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
  if (!rateLimit.allowed) {
    const minutesLeft = Math.ceil(rateLimit.resetMs / 60000);
    return errorResponse(res, 429, `Too many login attempts. Please try again in ${minutesLeft} minute(s).`);
  }

  try {
    const { email, password } = await parseJsonBody(req);

    if (!email || !password) {
      return errorResponse(res, 400, 'Email and password are required');
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Query admin
    const result = await query(
      `SELECT id, email, password_hash, is_active FROM admins WHERE email = ? LIMIT 1`,
      [normalizedEmail]
    );

    // Generic error message to prevent account enumeration
    if (result.rows.length === 0 || result.rows[0].is_active !== 1) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    const admin = result.rows[0];
    const passwordValid = await verifyPassword(password, admin.password_hash);

    if (!passwordValid) {
      return errorResponse(res, 401, 'Invalid email or password');
    }

    // Create session
    const { rawToken } = await createSession(admin.id);
    const cookieHeader = serializeSessionCookie(rawToken);

    return jsonResponse(
      res,
      200,
      {
        success: true,
        message: 'Login successful',
        user: {
          id: admin.id,
          email: admin.email,
        },
      },
      { 'Set-Cookie': cookieHeader }
    );
  } catch (err) {
    console.error('Login error:', err);
    return errorResponse(res, 500, 'An unexpected error occurred during login');
  }
}
