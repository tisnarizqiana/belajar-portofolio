import { query } from '../_lib/db.js';
import { authenticateAdmin } from '../_lib/auth.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../_lib/http.js';

export default async function handler(req, res) {
  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  // GET: all settings
  if (req.method === 'GET') {
    try {
      const result = await query(`SELECT key, value FROM site_settings`);
      const settings = {};
      for (const row of result.rows) {
        settings[row.key] = row.value;
      }
      return jsonResponse(res, 200, { success: true, data: settings });
    } catch (err) {
      console.error('Admin settings GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch settings');
    }
  }

  // PUT: update settings
  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');

    try {
      const body = await parseJsonBody(req);
      const now = new Date().toISOString();

      for (const [key, val] of Object.entries(body)) {
        const existing = await query(`SELECT id FROM site_settings WHERE key = ?`, [key]);
        if (existing.rows.length > 0) {
          await query(`UPDATE site_settings SET value = ?, updated_at = ? WHERE key = ?`, [String(val), now, key]);
        } else {
          await query(
            `INSERT INTO site_settings (id, key, value, updated_at) VALUES (?, ?, ?, ?)`,
            [crypto.randomUUID(), key, String(val), now]
          );
        }
      }

      return jsonResponse(res, 200, { success: true, message: 'Settings updated successfully' });
    } catch (err) {
      console.error('Admin settings update error:', err);
      return errorResponse(res, 500, 'Failed to update settings');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
