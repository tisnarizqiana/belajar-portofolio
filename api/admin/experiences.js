import crypto from 'crypto';
import { query } from '../_lib/db.js';
import { authenticateAdmin } from '../_lib/auth.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../_lib/http.js';

export default async function handler(req, res) {
  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');

  // GET: list all experiences
  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT * FROM experiences ORDER BY display_order ASC, created_at ASC`
      );
      const items = result.rows.map(row => ({
        ...row,
        tags: JSON.parse(row.tags_json || '[]'),
      }));
      return jsonResponse(res, 200, { success: true, data: items });
    } catch (err) {
      console.error('Admin experiences GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch experiences');
    }
  }

  // POST: create experience
  if (req.method === 'POST') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');

    try {
      const body = await parseJsonBody(req);
      if (!body.title || !body.organization || !body.period) {
        return errorResponse(res, 400, 'Title, organization, and period are required');
      }

      const expId = crypto.randomUUID();
      const now = new Date().toISOString();

      await query(
        `INSERT INTO experiences (
          id, type, title, organization, description, period,
          tags_json, display_order, is_visible, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          expId,
          body.type || 'experience',
          body.title.trim(),
          body.organization.trim(),
          body.description || '',
          body.period.trim(),
          JSON.stringify(body.tags || []),
          Number(body.display_order) || 0,
          body.is_visible !== undefined ? (body.is_visible ? 1 : 0) : 1,
          now,
          now,
        ]
      );

      return jsonResponse(res, 201, { success: true, message: 'Experience created successfully', data: { id: expId } });
    } catch (err) {
      console.error('Admin experience create error:', err);
      return errorResponse(res, 500, 'Failed to create experience');
    }
  }

  // PUT: update experience
  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'ID is required in query parameters (?id=...)');

    try {
      const body = await parseJsonBody(req);
      const now = new Date().toISOString();

      await query(
        `UPDATE experiences SET
          type = ?, title = ?, organization = ?, description = ?, period = ?,
          tags_json = ?, display_order = ?, is_visible = ?, updated_at = ?
         WHERE id = ?`,
        [
          body.type || 'experience',
          body.title?.trim(),
          body.organization?.trim(),
          body.description !== undefined ? body.description : '',
          body.period?.trim(),
          JSON.stringify(body.tags || []),
          Number(body.display_order) || 0,
          body.is_visible ? 1 : 0,
          now,
          id,
        ]
      );

      return jsonResponse(res, 200, { success: true, message: 'Experience updated successfully' });
    } catch (err) {
      console.error('Admin experience update error:', err);
      return errorResponse(res, 500, 'Failed to update experience');
    }
  }

  // DELETE: delete experience
  if (req.method === 'DELETE') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'ID is required in query parameters (?id=...)');

    try {
      await query(`DELETE FROM experiences WHERE id = ?`, [id]);
      return jsonResponse(res, 200, { success: true, message: 'Experience deleted successfully' });
    } catch (err) {
      console.error('Admin experience delete error:', err);
      return errorResponse(res, 500, 'Failed to delete experience');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
