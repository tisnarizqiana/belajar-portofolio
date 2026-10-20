import { query } from '../_lib/db.js';
import { jsonResponse, errorResponse } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const result = await query(
      `SELECT 
        id, name, title, bio, email, location, status,
        profile_image_url, resume_url, github_url, linkedin_url, whatsapp_url,
        hero_greeting, hero_title, hero_description, code_snippet_json, updated_at
       FROM profile
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Profile not found');
    }

    const row = result.rows[0];
    let codeSnippet = null;
    if (row.code_snippet_json) {
      try {
        codeSnippet = JSON.parse(row.code_snippet_json);
      } catch {
        codeSnippet = null;
      }
    }

    return jsonResponse(res, 200, {
      success: true,
      data: {
        ...row,
        code_snippet: codeSnippet,
      },
    });
  } catch (err) {
    console.error('Public profile fetch error:', err);
    return errorResponse(res, 500, 'Failed to fetch profile information');
  }
}
