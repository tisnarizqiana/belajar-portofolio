import { apiRequest } from './api';

export const adminService = {
  // Statistics
  async getStats() {
    const res = await apiRequest('/api/admin/stats');
    return res.data;
  },

  // Profile
  async getProfile() {
    const res = await apiRequest('/api/admin/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    return await apiRequest('/api/admin/profile', {
      method: 'PUT',
      body: profileData,
    });
  },

  // Projects
  async getProjects() {
    const res = await apiRequest('/api/admin/projects');
    return res.data;
  },

  async getProjectById(id) {
    const res = await apiRequest(`/api/admin/projects?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async createProject(projectData) {
    return await apiRequest('/api/admin/projects', {
      method: 'POST',
      body: projectData,
    });
  },

  async updateProject(id, projectData) {
    return await apiRequest(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: projectData,
    });
  },

  async deleteProject(id) {
    return await apiRequest(`/api/admin/projects?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Skills
  async getSkills() {
    const res = await apiRequest('/api/admin/skills');
    return res.data;
  },

  async createSkill(skillData) {
    return await apiRequest('/api/admin/skills', {
      method: 'POST',
      body: skillData,
    });
  },

  async updateSkill(id, skillData) {
    return await apiRequest(`/api/admin/skills?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: skillData,
    });
  },

  async deleteSkill(id) {
    return await apiRequest(`/api/admin/skills?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Experiences
  async getExperiences() {
    const res = await apiRequest('/api/admin/experiences');
    return res.data;
  },

  async createExperience(expData) {
    return await apiRequest('/api/admin/experiences', {
      method: 'POST',
      body: expData,
    });
  },

  async updateExperience(id, expData) {
    return await apiRequest(`/api/admin/experiences?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: expData,
    });
  },

  async deleteExperience(id) {
    return await apiRequest(`/api/admin/experiences?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Articles
  async getArticles() {
    const res = await apiRequest('/api/admin/articles');
    return res.data;
  },

  async getArticleById(id) {
    const res = await apiRequest(`/api/admin/articles?id=${encodeURIComponent(id)}`);
    return res.data;
  },

  async createArticle(articleData) {
    return await apiRequest('/api/admin/articles', {
      method: 'POST',
      body: articleData,
    });
  },

  async updateArticle(id, articleData) {
    return await apiRequest(`/api/admin/articles?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: articleData,
    });
  },

  async deleteArticle(id) {
    return await apiRequest(`/api/admin/articles?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Contact Messages
  async getMessages() {
    const res = await apiRequest('/api/admin/messages');
    return res.data;
  },

  async updateMessageStatus(id, status) {
    return await apiRequest(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
      method: 'PUT',
      body: { status },
    });
  },

  async deleteMessage(id) {
    return await apiRequest(`/api/admin/messages?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Media & Cloudinary Upload
  async getMedia() {
    const res = await apiRequest('/api/admin/media');
    return res.data;
  },

  async getUploadSignature() {
    const res = await apiRequest('/api/admin/media-signature', { method: 'POST' });
    return res.data;
  },

  async uploadFileToCloudinary(file, altText = '') {
    // 1. Request signature from backend
    const sig = await this.getUploadSignature();

    // 2. Prepare upload form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', sig.apiKey);
    formData.append('timestamp', sig.timestamp);
    formData.append('signature', sig.signature);
    formData.append('folder', sig.folder);
    formData.append('tags', sig.tags);

    // 3. Post directly to Cloudinary upload URL
    const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/auto/upload`;
    const uploadRes = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    });

    if (!uploadRes.ok) {
      const errData = await uploadRes.json().catch(() => ({}));
      throw new Error(errData?.error?.message || 'Cloudinary upload failed');
    }

    const result = await uploadRes.json();

    // 4. Record asset in backend database
    const recordRes = await apiRequest('/api/admin/media', {
      method: 'POST',
      body: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        alt_text: altText,
      },
    });

    return recordRes.data;
  },

  async deleteMedia(id) {
    return await apiRequest(`/api/admin/media?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
  },

  // Site Settings
  async getSettings() {
    const res = await apiRequest('/api/admin/settings');
    return res.data;
  },

  async updateSettings(settingsData) {
    return await apiRequest('/api/admin/settings', {
      method: 'PUT',
      body: settingsData,
    });
  },
};
