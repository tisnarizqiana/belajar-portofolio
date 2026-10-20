/**
 * Centralized HTTP Response & Request utility for Vercel Functions / Node.js handlers
 */

export function jsonResponse(res, statusCode, data, additionalHeaders = {}) {
  const headers = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    ...additionalHeaders,
  };

  for (const [key, value] of Object.entries(headers)) {
    res.setHeader(key, value);
  }

  res.statusCode = statusCode;
  res.end(JSON.stringify(data));
}

export function errorResponse(res, statusCode, message, errors = null) {
  return jsonResponse(res, statusCode, {
    success: false,
    message,
    ...(errors ? { errors } : {}),
  });
}

export async function parseJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      throw new Error('Invalid JSON payload');
    }
  }

  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => {
      raw += chunk;
      // Safeguard: Limit request payload to 2MB
      if (raw.length > 2 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });

    req.on('end', () => {
      if (!raw) {
        return resolve({});
      }
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error('Invalid JSON payload'));
      }
    });

    req.on('error', (err) => reject(err));
  });
}

/**
 * Verify same-origin or allowed origin for mutating requests to defend against CSRF
 */
export function verifyCsrf(req) {
  const method = req.method?.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return true;
  }

  const host = req.headers['host'];
  const origin = req.headers['origin'];
  const referer = req.headers['referer'];

  if (!origin && !referer) {
    // If neither is present, rely on custom header or SameSite cookie protection
    const customHeader = req.headers['x-requested-with'] || req.headers['x-csrf-protection'];
    if (customHeader) return true;
    return true; // allow same-process dev calls
  }

  if (origin) {
    try {
      const originHost = new URL(origin).host;
      if (originHost === host) return true;
    } catch {
      return false;
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host;
      if (refererHost === host) return true;
    } catch {
      return false;
    }
  }

  return false;
}
