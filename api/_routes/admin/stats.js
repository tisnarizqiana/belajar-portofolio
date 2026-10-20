import { query } from '../../_lib/db.js';
import { authenticateAdmin } from '../../_lib/auth.js';
import { jsonResponse, errorResponse } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized access to admin API');
  }

  try {
    const [
      totalProjectsRes,
      publishedProjectsRes,
      draftProjectsRes,
      skillsRes,
      totalArticlesRes,
      draftArticlesRes,
      unreadMessagesRes,
      assetsRes,
    ] = await Promise.all([
      query(`SELECT COUNT(*) as count FROM projects`),
      query(`SELECT COUNT(*) as count FROM projects WHERE status = 'published'`),
      query(`SELECT COUNT(*) as count FROM projects WHERE status != 'published'`),
      query(`SELECT COUNT(*) as count FROM skills`),
      query(`SELECT COUNT(*) as count FROM articles`),
      query(`SELECT COUNT(*) as count FROM articles WHERE status != 'published'`),
      query(`SELECT COUNT(*) as count FROM contact_messages WHERE status = 'unread'`),
      query(`SELECT COUNT(*) as count FROM assets`),
    ]);

    return jsonResponse(res, 200, {
      success: true,
      data: {
        totalProjects: Number(totalProjectsRes.rows[0]?.count || 0),
        publishedProjects: Number(publishedProjectsRes.rows[0]?.count || 0),
        draftProjects: Number(draftProjectsRes.rows[0]?.count || 0),
        totalSkills: Number(skillsRes.rows[0]?.count || 0),
        totalArticles: Number(totalArticlesRes.rows[0]?.count || 0),
        draftArticles: Number(draftArticlesRes.rows[0]?.count || 0),
        unreadMessages: Number(unreadMessagesRes.rows[0]?.count || 0),
        totalAssets: Number(assetsRes.rows[0]?.count || 0),
      },
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return errorResponse(res, 500, 'Failed to retrieve admin statistics');
  }
}
