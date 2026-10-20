import { query } from '../_lib/db.js';
import { jsonResponse, errorResponse } from '../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  try {
    const result = await query(
      `SELECT id, name, category, detail, icon, display_order
       FROM skills
       WHERE is_visible = 1
       ORDER BY display_order ASC, created_at ASC`
    );

    // Group by category
    const categoryMap = {
      frontend: { id: 'frontend', name: 'Frontend Development', description: 'Membangun antarmuka yang cepat, responsif, dan ramah pengguna.', items: [] },
      backend: { id: 'backend', name: 'Backend Development', description: 'Menyusun logika server, endpoint RESTful, dan integrasi data.', items: [] },
      databases: { id: 'databases', name: 'Databases', description: 'Perancangan skema data relasional dan query terstruktur.', items: [] },
      tools: { id: 'tools', name: 'Tools & Workflow', description: 'Ekosistem produktivitas untuk pengembangan dan kolaborasi kode.', items: [] },
    };

    const categories = [];

    for (const skill of result.rows) {
      const catKey = (skill.category || 'tools').toLowerCase();
      if (!categoryMap[catKey]) {
        categoryMap[catKey] = {
          id: catKey,
          name: catKey.charAt(0).toUpperCase() + catKey.slice(1),
          description: '',
          items: [],
        };
      }
      categoryMap[catKey].items.push({
        id: skill.id,
        name: skill.name,
        detail: skill.detail,
        icon: skill.icon,
      });
    }

    for (const key of ['frontend', 'backend', 'databases', 'tools', ...Object.keys(categoryMap)]) {
      if (categoryMap[key] && !categories.find(c => c.id === key) && categoryMap[key].items.length > 0) {
        categories.push(categoryMap[key]);
      }
    }

    return jsonResponse(res, 200, {
      success: true,
      data: {
        raw: result.rows,
        categories,
      },
    });
  } catch (err) {
    console.error('Public skills error:', err);
    return errorResponse(res, 500, 'Failed to fetch skills');
  }
}
