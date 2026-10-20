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

  // GET: list projects or get single project by id
  if (req.method === 'GET') {
    try {
      if (id) {
        const result = await query(`SELECT * FROM projects WHERE id = ? LIMIT 1`, [id]);
        if (result.rows.length === 0) {
          return errorResponse(res, 404, 'Project not found');
        }
        const row = result.rows[0];
        return jsonResponse(res, 200, {
          success: true,
          data: {
            ...row,
            technologies: JSON.parse(row.technologies_json || '[]'),
            features: JSON.parse(row.features_json || '[]'),
            gallery: JSON.parse(row.gallery_json || '[]'),
          },
        });
      }

      // List all projects
      const result = await query(
        `SELECT * FROM projects ORDER BY display_order ASC, created_at DESC`
      );

      const projects = result.rows.map(p => ({
        ...p,
        technologies: JSON.parse(p.technologies_json || '[]'),
        features: JSON.parse(p.features_json || '[]'),
        gallery: JSON.parse(p.gallery_json || '[]'),
      }));

      return jsonResponse(res, 200, { success: true, data: projects });
    } catch (err) {
      console.error('Admin projects GET error:', err);
      return errorResponse(res, 500, 'Failed to fetch projects');
    }
  }

  // POST: create new project
  if (req.method === 'POST') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');

    try {
      const body = await parseJsonBody(req);
      if (!body.title || !body.category) {
        return errorResponse(res, 400, 'Title and category are required');
      }

      const generatedSlug = (body.slug || body.title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check unique slug
      const slugCheck = await query(`SELECT id FROM projects WHERE slug = ? LIMIT 1`, [generatedSlug]);
      if (slugCheck.rows.length > 0) {
        return errorResponse(res, 400, 'A project with this slug already exists. Please choose a unique title or slug.');
      }

      const projectId = crypto.randomUUID();
      const now = new Date().toISOString();
      const status = body.status === 'draft' ? 'draft' : 'published';
      const publishedAt = status === 'published' ? (body.published_at || now) : null;

      await query(
        `INSERT INTO projects (
          id, title, slug, category, summary, description,
          cover_url, cover_asset_id, gallery_json,
          github_url, demo_url, technologies_json, features_json,
          theme_icon, is_featured, status, display_order,
          seo_title, seo_description, created_at, updated_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          projectId,
          body.title.trim(),
          generatedSlug,
          body.category.trim(),
          body.summary || '',
          body.description || '',
          body.cover_url || '',
          body.cover_asset_id || '',
          JSON.stringify(body.gallery || []),
          body.github_url || '',
          body.demo_url || '',
          JSON.stringify(body.technologies || []),
          JSON.stringify(body.features || []),
          body.theme_icon || 'code',
          body.is_featured ? 1 : 0,
          status,
          Number(body.display_order) || 0,
          body.seo_title || '',
          body.seo_description || '',
          now,
          now,
          publishedAt,
        ]
      );

      return jsonResponse(res, 201, {
        success: true,
        message: 'Project created successfully',
        data: { id: projectId, slug: generatedSlug },
      });
    } catch (err) {
      console.error('Admin project create error:', err);
      return errorResponse(res, 500, 'Failed to create project');
    }
  }

  // PUT: update existing project
  if (req.method === 'PUT') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Project ID is required in query parameters (?id=...)');

    try {
      const body = await parseJsonBody(req);
      const now = new Date().toISOString();

      const existing = await query(`SELECT * FROM projects WHERE id = ? LIMIT 1`, [id]);
      if (existing.rows.length === 0) {
        return errorResponse(res, 404, 'Project not found');
      }

      const generatedSlug = (body.slug || body.title || existing.rows[0].title)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

      // Check unique slug excluding current project
      const slugCheck = await query(`SELECT id FROM projects WHERE slug = ? AND id != ? LIMIT 1`, [generatedSlug, id]);
      if (slugCheck.rows.length > 0) {
        return errorResponse(res, 400, 'A project with this slug already exists.');
      }

      const status = body.status === 'draft' ? 'draft' : 'published';
      const publishedAt = status === 'published' ? (existing.rows[0].published_at || now) : null;

      await query(
        `UPDATE projects SET
          title = ?, slug = ?, category = ?, summary = ?, description = ?,
          cover_url = ?, cover_asset_id = ?, gallery_json = ?,
          github_url = ?, demo_url = ?, technologies_json = ?, features_json = ?,
          theme_icon = ?, is_featured = ?, status = ?, display_order = ?,
          seo_title = ?, seo_description = ?, updated_at = ?, published_at = ?
         WHERE id = ?`,
        [
          body.title?.trim() || existing.rows[0].title,
          generatedSlug,
          body.category?.trim() || existing.rows[0].category,
          body.summary !== undefined ? body.summary : existing.rows[0].summary,
          body.description !== undefined ? body.description : existing.rows[0].description,
          body.cover_url !== undefined ? body.cover_url : existing.rows[0].cover_url,
          body.cover_asset_id !== undefined ? body.cover_asset_id : existing.rows[0].cover_asset_id,
          JSON.stringify(body.gallery !== undefined ? body.gallery : JSON.parse(existing.rows[0].gallery_json || '[]')),
          body.github_url !== undefined ? body.github_url : existing.rows[0].github_url,
          body.demo_url !== undefined ? body.demo_url : existing.rows[0].demo_url,
          JSON.stringify(body.technologies !== undefined ? body.technologies : JSON.parse(existing.rows[0].technologies_json || '[]')),
          JSON.stringify(body.features !== undefined ? body.features : JSON.parse(existing.rows[0].features_json || '[]')),
          body.theme_icon || existing.rows[0].theme_icon,
          body.is_featured !== undefined ? (body.is_featured ? 1 : 0) : existing.rows[0].is_featured,
          status,
          body.display_order !== undefined ? Number(body.display_order) : existing.rows[0].display_order,
          body.seo_title !== undefined ? body.seo_title : existing.rows[0].seo_title,
          body.seo_description !== undefined ? body.seo_description : existing.rows[0].seo_description,
          now,
          publishedAt,
          id,
        ]
      );

      return jsonResponse(res, 200, { success: true, message: 'Project updated successfully' });
    } catch (err) {
      console.error('Admin project update error:', err);
      return errorResponse(res, 500, 'Failed to update project');
    }
  }

  // DELETE: delete project
  if (req.method === 'DELETE') {
    if (!verifyCsrf(req)) return errorResponse(res, 403, 'Cross-site request blocked');
    if (!id) return errorResponse(res, 400, 'Project ID is required in query parameters (?id=...)');

    try {
      const result = await query(`DELETE FROM projects WHERE id = ?`, [id]);
      return jsonResponse(res, 200, { success: true, message: 'Project deleted successfully' });
    } catch (err) {
      console.error('Admin project delete error:', err);
      return errorResponse(res, 500, 'Failed to delete project');
    }
  }

  return errorResponse(res, 405, 'Method not allowed');
}
