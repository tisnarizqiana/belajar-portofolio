import { apiRequest } from './api';

export const authService = {
  async login(email, password) {
    return await apiRequest('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    });
  },

  async logout() {
    return await apiRequest('/api/auth/logout', {
      method: 'POST',
    });
  },

  async getSession() {
    try {
      return await apiRequest('/api/auth/session', {
        method: 'GET',
      });
    } catch (err) {
      if (err.status === 401) {
        return null;
      }
      throw err;
    }
  },
};
