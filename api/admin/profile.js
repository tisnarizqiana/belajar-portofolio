import { query } from '../_lib/db.js';
import { authenticateAdmin } from '../_lib/auth.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../_lib/http.js';

export default async function handler(req, res) {
  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  if (req.method === 'GET') {
    try {
      const result = await query(`SELECT * FROM profile LIMIT 1`);
      if (result.rows.length === 0) {
        return errorResponse(res, 404, 'Profile not found');
      }
      return jsonResponse(res, 200, { success: true, data: result.rows[0] });
    } catch (err) {
      console.error('Admin profile get error:', err);
      return errorResponse(res, 500, 'Failed to fetch profile');
    }
  }

  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) {
      return errorResponse(res, 403, 'Cross-site request blocked');
    }

    try {
      const body = await parseJsonBody(req);
      const now = new Date().toISOString();

      await query(
        `UPDATE profile SET
          name = ?, title = ?, bio = ?, email = ?, location = ?, status = ?,
          profile_image_url = ?, profile_image_asset_id = ?,
          resume_url = ?, resume_asset_id = ?,
          github_url = ?, linkedin_url = ?, whatsapp_url = ?,
          hero_greeting = ?, hero_title = ?, hero_description = ?,
          updated_at = ?
         WHERE id = 'main_profile'`,
        [
          body.name || '',
          body.title || '',
          body.bio || '',
          body.email || '',
          body.location || '',
          body.status || '',
          body.profile_image_url || '',
          body.profile_image_asset_id || '',
          body.resume_url || '',
          body.resume_asset_id || '',
          body.github_url || '',
          body.linkedin_url || '',
          body.whatsapp_url || '',
          body.hero_greeting || '',
          body.hero_title || '',
          body.hero_description || '',
          now,
        ]
      );

      return jsonResponse(res, 200, { success: true, message: 'Profile updated successfully' });
    } catch (err) {
      console.error('Admin profile update error:', err);
      return errorResponse(res, 500, 'Failed to update profile');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
