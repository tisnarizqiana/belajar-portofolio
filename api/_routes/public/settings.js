import { query } from '../../_lib/db.js';
import { jsonResponse, errorResponse } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const result = await query(`SELECT key, value FROM site_settings`);
    const settings = {};
    for (const row of result.rows) {
      settings[row.key] = row.value;
    }

    return jsonResponse(res, 200, {
      success: true,
      data: settings,
    });
  } catch (err) {
    console.error('Public settings error:', err);
    return errorResponse(res, 500, 'Failed to fetch settings');
  }
}
