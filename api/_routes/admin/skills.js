import crypto from 'crypto';
import { query } from '../../_lib/db.js';
import { authenticateAdmin } from '../../_lib/auth.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../../_lib/http.js';

export default async function handler(req, res) {
  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');

  // GET: list all skills
  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT * FROM skills ORDER BY display_order ASC, created_at ASC`
      );
      return jsonResponse(res, 200, { success: true, data: result.rows });
    } catch (err) {
      console.error('Admin skills GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch skills');
    }
  }

  // POST: create skill
  if (req.method === 'POST') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');

    try {
      const body = await parseJsonBody(req);
      if (!body.name || !body.category) {
        return errorResponse(res, 400, 'Name and category are required');
      }

      const skillId = crypto.randomUUID();
      const now = new Date().toISOString();

      await query(
        `INSERT INTO skills (id, name, category, detail, icon, display_order, is_visible, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          skillId,
          body.name.trim(),
          body.category.trim(),
          body.detail || '',
          body.icon || '',
          Number(body.display_order) || 0,
          body.is_visible !== undefined ? (body.is_visible ? 1 : 0) : 1,
          now,
          now,
        ]
      );

      return jsonResponse(res, 201, { success: true, message: 'Skill created successfully', data: { id: skillId } });
    } catch (err) {
      console.error('Admin skill create error:', err);
      return errorResponse(res, 500, 'Failed to create skill');
    }
  }

  // PUT: update skill
  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Skill ID is required in query parameters (?id=...)');

    try {
      const body = await parseJsonBody(req);
      const now = new Date().toISOString();

      await query(
        `UPDATE skills SET
          name = ?, category = ?, detail = ?, icon = ?,
          display_order = ?, is_visible = ?, updated_at = ?
         WHERE id = ?`,
        [
          body.name?.trim(),
          body.category?.trim(),
          body.detail !== undefined ? body.detail : '',
          body.icon !== undefined ? body.icon : '',
          Number(body.display_order) || 0,
          body.is_visible ? 1 : 0,
          now,
          id,
        ]
      );

      return jsonResponse(res, 200, { success: true, message: 'Skill updated successfully' });
    } catch (err) {
      console.error('Admin skill update error:', err);
      return errorResponse(res, 500, 'Failed to update skill');
    }
  }

  // DELETE: delete skill
  if (req.method === 'DELETE') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Skill ID is required in query parameters (?id=...)');

    try {
      await query(`DELETE FROM skills WHERE id = ?`, [id]);
      return jsonResponse(res, 200, { success: true, message: 'Skill deleted successfully' });
    } catch (err) {
      console.error('Admin skill delete error:', err);
      return errorResponse(res, 500, 'Failed to delete skill');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
