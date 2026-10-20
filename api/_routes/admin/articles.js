import crypto from 'crypto';
import { query } from '../../_lib/db.js';
import { authenticateAdmin } from '../../_lib/auth.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../../_lib/http.js';

function calculateReadingTime(text) {
  if (!text) return 1;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export default async function handler(req, res) {
  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const id = url.searchParams.get('id');

  // GET: list or single article
  if (req.method === 'GET') {
    try {
      if (id) {
        const result = await query(`SELECT * FROM articles WHERE id = ? LIMIT 1`, [id]);
        if (result.rows.length === 0) return errorResponse(res, 404, 'Article not found');
        return jsonResponse(res, 200, { success: true, data: result.rows[0] });
      }

      const result = await query(`SELECT * FROM articles ORDER BY created_at DESC`);
      return jsonResponse(res, 200, { success: true, data: result.rows });
    } catch (err) {
      console.error('Admin articles GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch articles');
    }
  }

  // POST: create article
  if (req.method === 'POST') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');

    try {
      const body = await parseJsonBody(req);
      if (!body.title || !body.content) {
        return errorResponse(res, 400, 'Title and content are required');
      }

      const generatedSlug = (body.slug || body.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const slugCheck = await query(`SELECT id FROM articles WHERE slug = ? LIMIT 1`, [generatedSlug]);
      if (slugCheck.rows.length > 0) {
        return errorResponse(res, 400, 'An article with this slug already exists.');
      }

      const articleId = crypto.randomUUID();
      const now = new Date().toISOString();
      const status = body.status === 'published' ? 'published' : 'draft';
      const publishedAt = status === 'published' ? (body.published_at || now) : null;
      const readingTime = calculateReadingTime(body.content);

      await query(
        `INSERT INTO articles (
          id, title, slug, excerpt, content, cover_url, cover_asset_id,
          status, reading_time_minutes, author_name, seo_title, seo_description,
          published_at, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          articleId,
          body.title.trim(),
          generatedSlug,
          body.excerpt || '',
          body.content,
          body.cover_url || '',
          body.cover_asset_id || '',
          status,
          readingTime,
          body.author_name || auth.admin.email,
          body.seo_title || '',
          body.seo_description || '',
          publishedAt,
          now,
          now,
        ]
      );

      return jsonResponse(res, 201, {
        success: true,
        message: 'Article created successfully',
        data: { id: articleId, slug: generatedSlug },
      });
    } catch (err) {
      console.error('Admin article create error:', err);
      return errorResponse(res, 500, 'Failed to create article');
    }
  }

  // PUT: update article
  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Article ID is required in query parameters (?id=...)');

    try {
      const body = await parseJsonBody(req);
      const now = new Date().toISOString();

      const existing = await query(`SELECT * FROM articles WHERE id = ? LIMIT 1`, [id]);
      if (existing.rows.length === 0) return errorResponse(res, 404, 'Article not found');

      const generatedSlug = (body.slug || body.title || existing.rows[0].title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const slugCheck = await query(`SELECT id FROM articles WHERE slug = ? AND id != ? LIMIT 1`, [generatedSlug, id]);
      if (slugCheck.rows.length > 0) return errorResponse(res, 400, 'An article with this slug already exists.');

      const status = body.status === 'published' ? 'published' : 'draft';
      const publishedAt = status === 'published' ? (existing.rows[0].published_at || now) : null;
      const readingTime = calculateReadingTime(body.content !== undefined ? body.content : existing.rows[0].content);

      await query(
        `UPDATE articles SET
          title = ?, slug = ?, excerpt = ?, content = ?,
          cover_url = ?, cover_asset_id = ?, status = ?,
          reading_time_minutes = ?, author_name = ?,
          seo_title = ?, seo_description = ?,
          published_at = ?, updated_at = ?
         WHERE id = ?`,
        [
          body.title?.trim() || existing.rows[0].title,
          generatedSlug,
          body.excerpt !== undefined ? body.excerpt : existing.rows[0].excerpt,
          body.content !== undefined ? body.content : existing.rows[0].content,
          body.cover_url !== undefined ? body.cover_url : existing.rows[0].cover_url,
          body.cover_asset_id !== undefined ? body.cover_asset_id : existing.rows[0].cover_asset_id,
          status,
          readingTime,
          body.author_name || existing.rows[0].author_name,
          body.seo_title !== undefined ? body.seo_title : existing.rows[0].seo_title,
          body.seo_description !== undefined ? body.seo_description : existing.rows[0].seo_description,
          publishedAt,
          now,
          id,
        ]
      );

      return jsonResponse(res, 200, { success: true, message: 'Article updated successfully' });
    } catch (err) {
      console.error('Admin article update error:', err);
      return errorResponse(res, 500, 'Failed to update article');
    }
  }

  // DELETE: delete article
  if (req.method === 'DELETE') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Article ID is required in query parameters (?id=...)');

    try {
      await query(`DELETE FROM articles WHERE id = ?`, [id]);
      return jsonResponse(res, 200, { success: true, message: 'Article deleted successfully' });
    } catch (err) {
      console.error('Admin article delete error:', err);
      return errorResponse(res, 500, 'Failed to delete article');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
