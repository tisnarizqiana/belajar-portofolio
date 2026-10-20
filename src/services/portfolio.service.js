import { apiRequest } from './api';
import { portfolioData } from '../data/portfolio';

export const portfolioService = {
  async getProfile() {
    try {
      const res = await apiRequest('/api/public/profile');
      return res.data;
    } catch (err) {
      console.warn('Using fallback profile data:', err.message);
      return {
        ...portfolioData.personal,
        hero_greeting: portfolioData.hero.greeting,
        hero_title: portfolioData.hero.title,
        hero_description: portfolioData.hero.description,
        code_snippet: portfolioData.hero.codeSnippet,
      };
    }
  },

  async getProjects(slug = null) {
    try {
      const endpoint = slug ? `/api/public/projects?slug=${encodeURIComponent(slug)}` : '/api/public/projects';
      const res = await apiRequest(endpoint);
      return res.data;
    } catch (err) {
      console.warn('Using fallback projects data:', err.message);
      return portfolioData.projects.list;
    }
  },

  async getSkills() {
    try {
      const res = await apiRequest('/api/public/skills');
      return res.data.categories;
    } catch (err) {
      console.warn('Using fallback skills data:', err.message);
      return portfolioData.skills.categories;
    }
  },

  async getExperiences() {
    try {
      const res = await apiRequest('/api/public/experiences');
      return res.data.experiences;
    } catch (err) {
      console.warn('Using fallback experiences data:', err.message);
      return portfolioData.journey.milestones;
    }
  },

  async getArticles(slug = null) {
    try {
      const endpoint = slug ? `/api/public/articles?slug=${encodeURIComponent(slug)}` : '/api/public/articles';
      const res = await apiRequest(endpoint);
      return res.data;
    } catch (err) {
      console.warn('Failed to fetch articles:', err.message);
      return [];
    }
  },

  async getSettings() {
    try {
      const res = await apiRequest('/api/public/settings');
      return res.data;
    } catch (err) {
      return {
        site_title: 'Tisna Rizqiana | Full-Stack Developer',
        site_description: 'Portfolio Full-Stack Developer',
        enable_blog: 'true',
        enable_contact_form: 'true',
      };
    }
  },

  async sendContactMessage(payload) {
    return await apiRequest('/api/public/contact', {
      method: 'POST',
      body: payload,
    });
  },
};
