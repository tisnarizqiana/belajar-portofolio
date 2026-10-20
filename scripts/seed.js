import crypto from 'crypto';
import { portfolioData } from '../src/data/portfolio.js';
import { query } from '../api/_lib/db.js';

async function seedDatabase() {
  console.log('🌱 Seeding database from existing portfolio data...');

  const now = new Date().toISOString();

  // 1. Seed Profile
  const existingProfile = await query(`SELECT id FROM profile LIMIT 1`);
  if (existingProfile.rows.length === 0) {
    console.log('Seeding profile...');
    await query(
      `INSERT INTO profile (
        id, name, title, bio, email, location, status,
        github_url, linkedin_url, whatsapp_url,
        hero_greeting, hero_title, hero_description, code_snippet_json,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        'main_profile',
        portfolioData.personal.name,
        portfolioData.personal.role,
        portfolioData.personal.bio,
        portfolioData.personal.email,
        portfolioData.personal.location,
        portfolioData.personal.status,
        portfolioData.personal.github,
        portfolioData.personal.linkedin,
        portfolioData.personal.whatsapp || '',
        portfolioData.hero.greeting,
        portfolioData.hero.title,
        portfolioData.hero.description,
        JSON.stringify(portfolioData.hero.codeSnippet),
        now,
      ]
    );
  }

  // 2. Seed Skills
  const existingSkills = await query(`SELECT COUNT(*) as count FROM skills`);
  if (existingSkills.rows[0].count === 0) {
    console.log('Seeding skills...');
    let order = 0;
    for (const cat of portfolioData.skills.categories) {
      for (const item of cat.items) {
        order += 1;
        await query(
          `INSERT INTO skills (id, name, category, detail, display_order, is_visible, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, 1, ?, ?)`,
          [crypto.randomUUID(), item.name, cat.id, item.detail || '', order, now, now]
        );
      }
    }
  }

  // 3. Seed Projects
  const existingProjects = await query(`SELECT COUNT(*) as count FROM projects`);
  if (existingProjects.rows[0].count === 0) {
    console.log('Seeding projects...');
    let pOrder = 0;
    for (const p of portfolioData.projects.list) {
      pOrder += 1;
      await query(
        `INSERT INTO projects (
          id, title, slug, category, summary, description,
          technologies_json, features_json, theme_icon,
          github_url, demo_url, is_featured, status, display_order,
          created_at, updated_at, published_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', ?, ?, ?, ?)`,
        [
          crypto.randomUUID(),
          p.title,
          p.id || p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          p.category,
          p.description,
          p.description,
          JSON.stringify(p.techStack || []),
          JSON.stringify(p.features || []),
          p.themeIcon || 'code',
          p.githubUrl || '',
          p.demoUrl || '',
          pOrder <= 2 ? 1 : 0,
          pOrder,
          now,
          now,
          now,
        ]
      );
    }
  }

  // 4. Seed Experiences / Journey
  const existingExp = await query(`SELECT COUNT(*) as count FROM experiences`);
  if (existingExp.rows[0].count === 0) {
    console.log('Seeding experiences / milestones...');
    let eOrder = 0;
    for (const m of portfolioData.journey.milestones) {
      eOrder += 1;
      await query(
        `INSERT INTO experiences (
          id, type, title, organization, description, period,
          tags_json, display_order, is_visible, created_at, updated_at
        ) VALUES (?, 'milestone', ?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [
          crypto.randomUUID(),
          m.title,
          m.organization,
          m.description,
          m.period,
          JSON.stringify(m.tags || []),
          eOrder,
          now,
          now,
        ]
      );
    }
  }

  // 5. Seed Site Settings
  const defaultSettings = [
    { key: 'site_title', value: `${portfolioData.personal.name} | ${portfolioData.personal.role}` },
    { key: 'site_description', value: portfolioData.hero.description },
    { key: 'enable_blog', value: 'true' },
    { key: 'enable_contact_form', value: 'true' },
  ];

  for (const s of defaultSettings) {
    const existing = await query(`SELECT id FROM site_settings WHERE key = ?`, [s.key]);
    if (existing.rows.length === 0) {
      await query(
        `INSERT INTO site_settings (id, key, value, updated_at) VALUES (?, ?, ?, ?)`,
        [crypto.randomUUID(), s.key, s.value, now]
      );
    }
  }

  console.log('✅ Seed complete!');
}

seedDatabase().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
