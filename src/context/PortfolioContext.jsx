import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioService } from '../services/portfolio.service';
import { portfolioData } from '../data/portfolio';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [articles, setArticles] = useState([]);
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [profData, projData, skillData, expData, artData, setData] = await Promise.all([
        portfolioService.getProfile(),
        portfolioService.getProjects(),
        portfolioService.getSkills(),
        portfolioService.getExperiences(),
        portfolioService.getArticles(),
        portfolioService.getSettings(),
      ]);

      setProfile(profData);
      setProjects(projData && projData.length > 0 ? projData : portfolioData.projects.list);
      setSkills(skillData && skillData.length > 0 ? skillData : portfolioData.skills.categories);
      setExperiences(expData && expData.length > 0 ? expData : portfolioData.journey.milestones);
      setArticles(artData || []);
      setSettings(setData || {});
    } catch (err) {
      console.warn('Failed to fetch dynamic portfolio data, falling back to static config:', err);
      // Fallback
      setProfile({
        name: portfolioData.personal.name,
        title: portfolioData.personal.role,
        bio: portfolioData.personal.bio,
        email: portfolioData.personal.email,
        location: portfolioData.personal.location,
        status: portfolioData.personal.status,
        github_url: portfolioData.personal.github,
        linkedin_url: portfolioData.personal.linkedin,
        whatsapp_url: portfolioData.personal.whatsapp,
        hero_greeting: portfolioData.hero.greeting,
        hero_title: portfolioData.hero.title,
        hero_description: portfolioData.hero.description,
        code_snippet: portfolioData.hero.codeSnippet,
      });
      setProjects(portfolioData.projects.list);
      setSkills(portfolioData.skills.categories);
      setExperiences(portfolioData.journey.milestones);
      setArticles([]);
      setSettings({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        profile: profile || {
          name: portfolioData.personal.name,
          title: portfolioData.personal.role,
          bio: portfolioData.personal.bio,
          email: portfolioData.personal.email,
          location: portfolioData.personal.location,
          status: portfolioData.personal.status,
          github_url: portfolioData.personal.github,
          linkedin_url: portfolioData.personal.linkedin,
          whatsapp_url: portfolioData.personal.whatsapp,
          hero_greeting: portfolioData.hero.greeting,
          hero_title: portfolioData.hero.title,
          hero_description: portfolioData.hero.description,
          code_snippet: portfolioData.hero.codeSnippet,
        },
        projects,
        skills,
        experiences,
        articles,
        settings,
        loading,
        refreshPortfolio: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
}
