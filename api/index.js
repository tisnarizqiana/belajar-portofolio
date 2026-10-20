import publicProfile from './_routes/public/profile.js';
import publicProjects from './_routes/public/projects.js';
import publicSkills from './_routes/public/skills.js';
import publicExperiences from './_routes/public/experiences.js';
import publicArticles from './_routes/public/articles.js';
import publicSettings from './_routes/public/settings.js';
import publicContact from './_routes/public/contact.js';

import authLogin from './_routes/auth/login.js';
import authLogout from './_routes/auth/logout.js';
import authSession from './_routes/auth/session.js';

import adminStats from './_routes/admin/stats.js';
import adminProfile from './_routes/admin/profile.js';
import adminProjects from './_routes/admin/projects.js';
import adminSkills from './_routes/admin/skills.js';
import adminExperiences from './_routes/admin/experiences.js';
import adminArticles from './_routes/admin/articles.js';
import adminMessages from './_routes/admin/messages.js';
import adminMedia from './_routes/admin/media.js';
import adminMediaSignature from './_routes/admin/media-signature.js';
import adminSettings from './_routes/admin/settings.js';

import { jsonResponse, errorResponse } from './_lib/http.js';

const routes = {
  '/api': (req, res) => jsonResponse(res, 200, { success: true, status: 'healthy' }),
  '/api/health': (req, res) => jsonResponse(res, 200, { success: true, status: 'healthy' }),

  '/api/public/profile': publicProfile,
  '/api/public/projects': publicProjects,
  '/api/public/skills': publicSkills,
  '/api/public/experiences': publicExperiences,
  '/api/public/articles': publicArticles,
  '/api/public/settings': publicSettings,
  '/api/public/contact': publicContact,

  '/api/auth/login': authLogin,
  '/api/auth/logout': authLogout,
  '/api/auth/session': authSession,

  '/api/admin/stats': adminStats,
  '/api/admin/profile': adminProfile,
  '/api/admin/projects': adminProjects,
  '/api/admin/skills': adminSkills,
  '/api/admin/experiences': adminExperiences,
  '/api/admin/articles': adminArticles,
  '/api/admin/messages': adminMessages,
  '/api/admin/media': adminMedia,
  '/api/admin/media-signature': adminMediaSignature,
  '/api/admin/settings': adminSettings,
};

export default async function handler(req, res) {
  try {
    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, 'http://localhost');
    
    // Check possible path sources:
    // 1. __path query param (from vercel.json rewrite)
    // 2. x-matched-path or x-forwarded-uri header
    // 3. parsed pathname
    let targetPath = '';
    const queryPath = parsedUrl.searchParams.get('__path');
    if (queryPath) {
      targetPath = queryPath.startsWith('/') ? `/api${queryPath}` : `/api/${queryPath}`;
      parsedUrl.searchParams.delete('__path');
    } else {
      const headerPath = req.headers['x-matched-path'] || req.headers['x-forwarded-uri'];
      if (headerPath) {
        targetPath = headerPath.split('?')[0];
      } else {
        targetPath = parsedUrl.pathname;
      }
    }

    // Normalize path by stripping trailing slash
    if (targetPath.length > 1 && targetPath.endsWith('/')) {
      targetPath = targetPath.slice(0, -1);
    }

    // Ensure req.url reflects clean path + original search params
    const newSearch = parsedUrl.search;
    req.url = `${targetPath}${newSearch}`;

    const routeHandler = routes[targetPath];
    if (!routeHandler) {
      return errorResponse(res, 404, `API route not found: ${targetPath}`);
    }

    return await routeHandler(req, res);
  } catch (err) {
    console.error('Unified API Router Error:', err);
    return errorResponse(res, 500, 'Internal Server Error', err.message);
  }
}
