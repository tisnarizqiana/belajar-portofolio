import { revokeSession, clearSessionCookie } from '../../_lib/auth.js';
import { jsonResponse, errorResponse, verifyCsrf } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  if (!verifyCsrf(req)) {
    return errorResponse(res, 403, 'Cross-site request blocked');
  }

  try {
    await revokeSession(req);
    const clearedCookie = clearSessionCookie();

    return jsonResponse(
      res,
      200,
      { success: true, message: 'Logged out successfully' },
      { 'Set-Cookie': clearedCookie }
    );
  } catch (err) {
    console.error('Logout error:', err);
    return errorResponse(res, 500, 'Failed to log out');
  }
}
