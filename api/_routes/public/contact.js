import crypto from 'crypto';
import { query } from '../../_lib/db.js';
import { jsonResponse, errorResponse, parseJsonBody, verifyCsrf } from '../../_lib/http.js';
import { checkRateLimit, getClientIp } from '../../_lib/rateLimit.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return errorResponse(res, 405, 'Method not allowed');
  }

  if (!verifyCsrf(req)) {
    return errorResponse(res, 403, 'Cross-site request blocked');
  }

  // Rate limit: 5 contact messages per hour per IP
  const ip = getClientIp(req);
  const rateLimit = checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000);
  if (!rateLimit.allowed) {
    const minutesLeft = Math.ceil(rateLimit.resetMs / 60000);
    return errorResponse(res, 429, `Pesan Anda terlalu sering dikirim. Silakan coba kembali dalam ${minutesLeft} menit.`);
  }

  try {
    const { name, email, message } = await parseJsonBody(req);

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2 || name.trim().length > 100) {
      return errorResponse(res, 400, 'Nama harus memiliki panjang 2-100 karakter.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return errorResponse(res, 400, 'Alamat email tidak valid.');
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10 || message.trim().length > 3000) {
      return errorResponse(res, 400, 'Pesan harus memiliki panjang antara 10 hingga 3000 karakter.');
    }

    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    await query(
      `INSERT INTO contact_messages (id, name, email, message, status, created_at)
       VALUES (?, ?, ?, ?, 'unread', ?)`,
      [id, name.trim(), email.trim().toLowerCase(), message.trim(), now]
    );

    return jsonResponse(res, 201, {
      success: true,
      message: 'Pesan Anda berhasil terkirim dan tersimpan dengan aman!',
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    return errorResponse(res, 500, 'Gagal mengirim pesan. Silakan coba beberapa saat lagi.');
  }
}
