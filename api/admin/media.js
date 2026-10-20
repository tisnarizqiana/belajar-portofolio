import crypto from 'crypto';
import { query } from '../_lib/db.js';
import { authenticateAdmin } from '../_lib/auth.js';
import { deleteAsset, ALLOWED_FORMATS, MAX_FILE_SIZE_BYTES } from '../_lib/cloudinary.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../_lib/http.js';

export default async function handler(req, res) {
  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');

  // GET: list assets
  if (req.method === 'GET') {
    try {
      const result = await query(`SELECT * FROM assets ORDER BY created_at DESC`);
      return jsonResponse(res, 200, { success: true, data: result.rows });
    } catch (err) {
      console.error('Admin media GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch media assets');
    }
  }

  // POST: record uploaded asset
  if (req.method === 'POST') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');

    try {
      const body = await parseJsonBody(req);
      const { public_id, secure_url, format, bytes, width, height, alt_text } = body;

      if (!public_id || !secure_url) {
        return errorResponse(res, 400, 'public_id and secure_url are required');
      }

      if (bytes && bytes > MAX_FILE_SIZE_BYTES) {
        return errorResponse(res, 400, `File size exceeds maximum limit of 10MB`);
      }

      const normalizedFormat = (format || '').toLowerCase();
      if (normalizedFormat && !ALLOWED_FORMATS.includes(normalizedFormat)) {
        return errorResponse(res, 400, `File format .${normalizedFormat} is not allowed`);
      }

      const assetId = crypto.randomUUID();
      const now = new Date().toISOString();

      await query(
        `INSERT INTO assets (id, public_id, secure_url, resource_type, format, bytes, width, height, alt_text, created_at)
         VALUES (?, ?, ?, 'image', ?, ?, ?, ?, ?, ?)`,
        [
          assetId,
          public_id,
          secure_url,
          format || '',
          bytes || 0,
          width || null,
          height || null,
          alt_text || '',
          now,
        ]
      );

      return jsonResponse(res, 201, {
        success: true,
        message: 'Asset recorded successfully',
        data: {
          id: assetId,
          public_id,
          secure_url,
        },
      });
    } catch (err) {
      console.error('Admin media record error:', err);
      return errorResponse(res, 500, 'Failed to record asset');
    }
  }

  // DELETE: delete asset (checks if referenced first)
  if (req.method === 'DELETE') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Asset ID is required in query parameters (?id=...)');

    try {
      await deleteAsset(id);
      return jsonResponse(res, 200, { success: true, message: 'Asset deleted successfully' });
    } catch (err) {
      console.error('Admin media delete error:', err);
      return errorResponse(res, 400, err.message || 'Failed to delete asset');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
