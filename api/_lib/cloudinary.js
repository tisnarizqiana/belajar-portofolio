import { v2 as cloudinary } from 'cloudinary';
import { query } from './db.js';

// Configure Cloudinary from environment variables
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export const ALLOWED_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif', 'pdf'];
export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Generate a short-lived signature for secure direct browser-to-Cloudinary upload
 */
export function generateUploadSignature(folder = 'portfolio_cms', tags = 'portfolio') {
  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_CLOUD_NAME) {
    throw new Error('Cloudinary environment variables are not configured');
  }

  const timestamp = Math.round(new Date().getTime() / 1000);
  const paramsToSign = {
    folder,
    tags,
    timestamp,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return {
    signature,
    timestamp,
    folder,
    tags,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  };
}

/**
 * Check if an asset is currently in use across profile, projects, or articles
 */
export async function isAssetInUse(assetId) {
  // Check profile
  const profileCheck = await query(
    `SELECT id FROM profile WHERE profile_image_asset_id = ? OR resume_asset_id = ? LIMIT 1`,
    [assetId, assetId]
  );
  if (profileCheck.rows.length > 0) return true;

  // Check projects
  const projectCheck = await query(
    `SELECT id FROM projects WHERE cover_asset_id = ? OR gallery_json LIKE ? LIMIT 1`,
    [assetId, `%"${assetId}"%`]
  );
  if (projectCheck.rows.length > 0) return true;

  // Check articles
  const articleCheck = await query(
    `SELECT id FROM articles WHERE cover_asset_id = ? LIMIT 1`,
    [assetId]
  );
  if (articleCheck.rows.length > 0) return true;

  return false;
}

/**
 * Delete an asset from Cloudinary and database
 */
export async function deleteAsset(assetId) {
  // 1. Get asset details
  const assetRes = await query(`SELECT * FROM assets WHERE id = ?`, [assetId]);
  if (assetRes.rows.length === 0) {
    throw new Error('Asset not found');
  }

  const asset = assetRes.rows[0];

  // 2. Verify not referenced
  const inUse = await isAssetInUse(assetId);
  if (inUse) {
    throw new Error('Asset is currently in use by project, article, or profile. Remove reference first.');
  }

  // 3. Delete from Cloudinary if configured
  if (process.env.CLOUDINARY_API_SECRET) {
    try {
      await cloudinary.uploader.destroy(asset.public_id, {
        resource_type: asset.resource_type || 'image',
      });
    } catch (err) {
      console.warn('Failed to delete asset from Cloudinary:', err.message);
      // Still proceed with DB removal or throw based on preference
    }
  }

  // 4. Delete from assets table
  await query(`DELETE FROM assets WHERE id = ?`, [assetId]);

  return { success: true };
}
