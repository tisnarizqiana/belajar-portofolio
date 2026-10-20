import { authenticateAdmin } from '../../_lib/auth.js';
import { jsonResponse, errorResponse } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const auth = await authenticateAdmin(req);

    if (!auth) {
      return errorResponse(res, 401, 'Unauthorized');
    }

    return jsonResponse(res, 200, {
      success: true,
      authenticated: true,
      user: {
        id: auth.admin.id,
        email: auth.admin.email,
      },
    });
  } catch (err) {
    console.error('Session check error:', err);
    return errorResponse(res, 500, 'Internal server error');
  }
}
