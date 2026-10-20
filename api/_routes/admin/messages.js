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

  // GET: list messages
  if (req.method === 'GET') {
    try {
      const result = await query(
        `SELECT * FROM contact_messages ORDER BY created_at DESC`
      );
      return jsonResponse(res, 200, { success: true, data: result.rows });
    } catch (err) {
      console.error('Admin messages GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch messages');
    }
  }

  // PUT: update message status (read / unread / archived)
  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Message ID is required in query parameters (?id=...)');

    try {
      const body = await parseJsonBody(req);
      const status = ['unread', 'read', 'archived'].includes(body.status) ? body.status : 'read';

      await query(`UPDATE contact_messages SET status = ? WHERE id = ?`, [status, id]);
      return jsonResponse(res, 200, { success: true, message: `Message marked as ${status}` });
    } catch (err) {
      console.error('Admin message update error:', err);
      return errorResponse(res, 500, 'Failed to update message status');
    }
  }

  // DELETE: delete message
  if (req.method === 'DELETE') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Message ID is required in query parameters (?id=...)');

    try {
      await query(`DELETE FROM contact_messages WHERE id = ?`, [id]);
      return jsonResponse(res, 200, { success: true, message: 'Message deleted successfully' });
    } catch (err) {
      console.error('Admin message delete error:', err);
      return errorResponse(res, 500, 'Failed to delete message');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
