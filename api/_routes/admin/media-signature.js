import { authenticateAdmin } from '../../_lib/auth.js';
import { generateUploadSignature } from '../../_lib/cloudinary.js';
import { jsonResponse, errorResponse, verifyCsrf } from '../../_lib/http.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  const auth = await authenticateAdmin(req);
  if (!auth) {
    return errorResponse(res, 401, 'Unauthorized');
  }

  if (!verifyCsrf(req)) {
    return errorResponse(res, 403, 'Cross-site request blocked');
  }

  try {
    const signatureData = generateUploadSignature('portfolio_cms', 'portfolio');
    return jsonResponse(res, 200, {
      success: true,
      data: signatureData,
    });
  } catch (err) {
    console.error('Media signature generation error:', err);
    return errorResponse(res, 500, err.message || 'Failed to generate upload signature');
  }
}
