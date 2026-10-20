import crypto from 'crypto';
import { query } from '../api/_lib/db.js';
import { hashPassword } from '../api/_lib/auth.js';

async function createAdmin() {
  const email = process.argv[2] || process.env.ADMIN_EMAIL;
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Usage: node scripts/create-admin.js <email> <password>');
    console.error('   Or set ADMIN_EMAIL and ADMIN_PASSWORD in environment variables.');
    process.exit(1);
  }

  if (!email.includes('@') || !email.includes('.')) {
    console.error('❌ Invalid email address format.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters long.');
    process.exit(1);
  }

  console.log(`🔐 Provisioning admin account for: ${email}`);

  const hashedPassword = await hashPassword(password);
  const now = new Date().toISOString();

  // Check if admin with this email exists
  const existing = await query(`SELECT id FROM admins WHERE email = ?`, [email.toLowerCase().trim()]);

  if (existing.rows.length > 0) {
    await query(
      `UPDATE admins SET password_hash = ?, is_active = 1, updated_at = ? WHERE email = ?`,
      [hashedPassword, now, email.toLowerCase().trim()]
    );
    console.log('✅ Admin password updated successfully!');
  } else {
    const adminId = crypto.randomUUID();
    await query(
      `INSERT INTO admins (id, email, password_hash, is_active, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)`,
      [adminId, email.toLowerCase().trim(), hashedPassword, now, now]
    );
    console.log(`✅ Admin account created successfully! Admin ID: ${adminId}`);
  }
}

createAdmin().catch(err => {
  console.error('❌ Failed to provision admin:', err);
  process.exit(1);
});
