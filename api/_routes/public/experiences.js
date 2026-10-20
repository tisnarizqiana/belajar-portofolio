import { query } from '../../_lib/db.js';
import { jsonResponse, errorResponse } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const expResult = await query(
      `SELECT id, type, title, organization, description, period, tags_json, display_order
       FROM experiences
       WHERE is_visible = 1
       ORDER BY display_order ASC, created_at ASC`
    );

    const eduResult = await query(
      `SELECT id, institution, qualification, description, period, display_order
       FROM education
       WHERE is_visible = 1
       ORDER BY display_order ASC, created_at ASC`
    );

    const experiences = expResult.rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags_json || '[]'),
    }));

    return jsonResponse(res, 200, {
      success: true,
      data: {
        experiences,
        education: eduResult.rows,
      },
    });
  } catch (err) {
    console.error('Public experiences error:', err);
    return errorResponse(res, 500, 'Failed to fetch journey milestones');
  }
}
