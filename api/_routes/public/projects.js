import { query } from '../../_lib/db.js';
import { jsonResponse, errorResponse } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const slug = url.searchParams.get('slug');

  try {
    if (slug) {
      const result = await query(
        `SELECT 
          id, title, slug, category, summary, description,
          cover_url, gallery_json, github_url, demo_url,
          technologies_json, features_json, theme_icon,
          is_featured, seo_title, seo_description, published_at
         FROM projects
         WHERE slug = ? AND status = 'published'
         LIMIT 1`,
        [slug]
      );

      if (result.rows.length === 0) {
        return errorResponse(res, 404, 'Project not found');
      }

      const p = result.rows[0];
      return jsonResponse(res, 200, {
        success: true,
        data: {
          ...p,
          technologies: JSON.parse(p.technologies_json || '[]'),
          features: JSON.parse(p.features_json || '[]'),
          gallery: JSON.parse(p.gallery_json || '[]'),
        },
      });
    }

    // List all published projects
    const result = await query(
      `SELECT 
        id, title, slug, category, summary, description,
        cover_url, github_url, demo_url,
        technologies_json, features_json, theme_icon,
        is_featured, display_order, published_at
       FROM projects
       WHERE status = 'published'
       ORDER BY display_order ASC, created_at DESC`
    );

    const projects = result.rows.map(p => ({
      ...p,
      technologies: JSON.parse(p.technologies_json || '[]'),
      features: JSON.parse(p.features_json || '[]'),
    }));

    return jsonResponse(res, 200, {
      success: true,
      data: projects,
    });
  } catch (err) {
    console.error('Public projects error:', err);
    return errorResponse(res, 500, 'Failed to fetch projects');
  }
}
