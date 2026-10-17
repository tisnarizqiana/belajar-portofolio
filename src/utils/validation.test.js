import { describe, it, expect } from 'vitest';
import { validateEmail, validateContactForm } from './validation';

describe('Validation Utility Tests', () => {
  describe('validateEmail', () => {
    it('accepts valid email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('developer.name@sub.domain.co.id')).toBe(true);
      expect(validateEmail('tisna+portfolio@gmail.com')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(validateEmail('')).toBe(false);
      expect(validateEmail(null)).toBe(false);
      expect(validateEmail(undefined)).toBe(false);
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('missingdomain@')).toBe(false);
      expect(validateEmail('@missinguser.com')).toBe(false);
      expect(validateEmail('spaces in@domain.com')).toBe(false);
    });
  });

  describe('validateContactForm', () => {
    it('returns errors when required fields are empty', () => {
      const result = validateContactForm({ name: '', email: '', message: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toBeDefined();
      expect(result.errors.email).toBeDefined();
      expect(result.errors.message).toBeDefined();
    });

    it('validates name length requirement', () => {
      const result = validateContactForm({ name: 'A', email: 'test@example.com', message: 'Ini adalah pesan yang valid dan panjang.' });
      expect(result.isValid).toBe(false);
      expect(result.errors.name).toContain('minimal 2 karakter');
    });

    it('validates message minimum length requirement', () => {
      const result = validateContactForm({ name: 'Budi Santoso', email: 'budi@example.com', message: 'Halo gan' });
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toContain('minimal 10 karakter');
    });

    it('validates invalid email format', () => {
      const result = validateContactForm({ name: 'Budi Santoso', email: 'invalid-email', message: 'Halo ini pesan yang valid dan panjang.' });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('Format email tidak valid');
    });

    it('succeeds with completely valid payload', () => {
      const result = validateContactForm({
        name: 'Ahmad Fauzi',
        email: 'ahmad.fauzi@example.com',
        message: 'Halo Tisna, saya tertarik berdiskusi mengenai proyek web application.'
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});
