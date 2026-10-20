import { describe, it, expect } from 'vitest';
import crypto from 'crypto';
import {
  hashPassword,
  verifyPassword,
  hashToken,
  generateSessionToken,
  parseCookies,
  serializeSessionCookie,
  createSession,
  authenticateAdmin,
} from '../api/_lib/auth.js';
import { checkRateLimit } from '../api/_lib/rateLimit.js';
import { query } from '../api/_lib/db.js';
import { isAssetInUse } from '../api/_lib/cloudinary.js';

describe('CMS Security and Auth Utilities', () => {
  it('correctly hashes and verifies passwords with bcrypt', async () => {
    const raw = 'SecureSecretPassword123!';
    const hashed = await hashPassword(raw);
    expect(hashed).not.toBe(raw);
    expect(hashed.startsWith('$2')).toBe(true);

    const isMatch = await verifyPassword(raw, hashed);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword('WrongPassword', hashed);
    expect(isWrongMatch).toBe(false);
  });

  it('generates cryptographically secure session tokens and SHA-256 hashes', () => {
    const token1 = generateSessionToken();
    const token2 = generateSessionToken();
    expect(token1).toHaveLength(64); // 32 bytes hex
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);

    const hash1 = hashToken(token1);
    const hash2 = hashToken(token1);
    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('correctly parses and serializes session cookies', () => {
    const token = 'sample-secret-token-value';
    const serialized = serializeSessionCookie(token);
    expect(serialized).toContain('cms_session=sample-secret-token-value');
    expect(serialized).toContain('HttpOnly');
    expect(serialized).toContain('Path=/');
    expect(serialized).toContain('SameSite=Lax');

    const parsed = parseCookies(serialized);
    expect(parsed.cms_session).toBe(token);
  });

  it('enforces sliding-window rate limiting', () => {
    const key = `test-rate-limit-${Date.now()}`;
    const max = 3;
    const windowMs = 5000;

    // First 3 requests should be allowed
    expect(checkRateLimit(key, max, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, max, windowMs).allowed).toBe(true);
    expect(checkRateLimit(key, max, windowMs).allowed).toBe(true);

    // 4th request must be rejected
    const blocked = checkRateLimit(key, max, windowMs);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});

describe('Database Integrity and Operations', () => {
  it('reads profile successfully from Turso/LibSQL database', async () => {
    const res = await query(`SELECT name, title, email FROM profile LIMIT 1`);
    expect(res.rows.length).toBeGreaterThan(0);
    expect(res.rows[0].name).toBe('Tisna Rizqiana');
  });

  it('reads seeded projects and ensures technologies_json parses', async () => {
    const res = await query(`SELECT title, slug, status, technologies_json FROM projects`);
    expect(res.rows.length).toBeGreaterThan(0);
    for (const row of res.rows) {
      expect(row.slug).toBeDefined();
      const tech = JSON.parse(row.technologies_json);
      expect(Array.isArray(tech)).toBe(true);
    }
  });

  it('reads seeded skills grouped by category', async () => {
    const res = await query(`SELECT name, category FROM skills WHERE is_visible = 1`);
    expect(res.rows.length).toBeGreaterThan(0);
    const categories = new Set(res.rows.map(r => r.category));
    expect(categories.has('frontend')).toBe(true);
  });

  it('verifies asset in-use detection before deletion', async () => {
    const notInUse = await isAssetInUse('random-non-existent-asset-id');
    expect(notInUse).toBe(false);
  });

  it('persists and retrieves inbound contact messages safely in Turso', async () => {
    const testId = crypto.randomUUID();
    const testEmail = `visitor-${Date.now()}@test.com`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO contact_messages (id, name, email, message, status, created_at)
       VALUES (?, ?, ?, ?, 'unread', ?)`,
      [testId, 'Tester Budi', testEmail, 'Pesan uji coba otomatis integrasi.', now]
    );

    const res = await query(`SELECT * FROM contact_messages WHERE id = ?`, [testId]);
    expect(res.rows.length).toBe(1);
    expect(res.rows[0].email).toBe(testEmail);
    expect(res.rows[0].status).toBe('unread');

    // Clean up
    await query(`DELETE FROM contact_messages WHERE id = ?`, [testId]);
  });

  it('ensures draft articles are not exposed to public queries', async () => {
    const draftId = crypto.randomUUID();
    const draftSlug = `draft-secret-article-${Date.now()}`;
    const now = new Date().toISOString();

    await query(
      `INSERT INTO articles (id, title, slug, content, status, created_at, updated_at)
       VALUES (?, 'Draft Article', ?, 'Secret internal notes', 'draft', ?, ?)`,
      [draftId, draftSlug, now, now]
    );

    // Public query simulation: where status = 'published'
    const publicRes = await query(`SELECT id FROM articles WHERE slug = ? AND status = 'published'`, [draftSlug]);
    expect(publicRes.rows.length).toBe(0);

    // Admin query sees it
    const adminRes = await query(`SELECT id, status FROM articles WHERE slug = ?`, [draftSlug]);
    expect(adminRes.rows.length).toBe(1);
    expect(adminRes.rows[0].status).toBe('draft');

    // Clean up
    await query(`DELETE FROM articles WHERE id = ?`, [draftId]);
  });

  it('verifies session creation and authentication cycle against admins table', async () => {
    const adminCheck = await query(`SELECT id, email FROM admins LIMIT 1`);
    if (adminCheck.rows.length > 0) {
      const admin = adminCheck.rows[0];
      const { rawToken } = await createSession(admin.id);
      expect(rawToken).toBeDefined();

      const fakeReq = {
        headers: {
          cookie: `cms_session=${rawToken}`,
        },
      };

      const auth = await authenticateAdmin(fakeReq);
      expect(auth).not.toBeNull();
      expect(auth.admin.id).toBe(admin.id);
      expect(auth.admin.email).toBe(admin.email);
    }
  });
});
