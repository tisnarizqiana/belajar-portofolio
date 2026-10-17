/**
 * Utility functions for form input validation and sanitization
 */

export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  // Standard RFC 5322 compatible regex for email validation
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return re.test(email.trim());
};

export const validateContactForm = ({ name, email, message }) => {
  const errors = {};

  if (!name || !name.trim()) {
    errors.name = "Nama wajib diisi.";
  } else if (name.trim().length < 2) {
    errors.name = "Nama harus memiliki minimal 2 karakter.";
  }

  if (!email || !email.trim()) {
    errors.email = "Email wajib diisi.";
  } else if (!validateEmail(email)) {
    errors.email = "Format email tidak valid (contoh: nama@domain.com).";
  }

  if (!message || !message.trim()) {
    errors.message = "Pesan wajib diisi.";
  } else if (message.trim().length < 10) {
    errors.message = "Pesan terlalu singkat (minimal 10 karakter).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
