import { query } from '../_lib/db.js';
import { jsonResponse, errorResponse } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const slug = url.searchParams.get('slug');

  try {
    if (slug) {
      const result = await query(
        `SELECT id, title, slug, excerpt, content, cover_url, reading_time_minutes, author_name, seo_title, seo_description, published_at
         FROM articles
         WHERE slug = ? AND status = 'published'
         LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 404, 'Article not found');
      }

      return jsonResponse(res, 200, {
        success: true,
        data: result.rows[0],
      });
    }

    // List all published articles
    const result = await query(
      `SELECT id, title, slug, excerpt, cover_url, reading_time_minutes, author_name, published_at
       FROM articles
       WHERE status = 'published'
       ORDER BY published_at DESC, created_at DESC`
    );

    return jsonResponse(res, 200, {
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error('Public articles error:', err);
    return errorResponse(res, 500, 'Failed to fetch articles');
  }
}
