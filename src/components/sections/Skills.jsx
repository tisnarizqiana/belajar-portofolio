import React from 'react';
import { Layout, Server, Database, Wrench, CheckCircle } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

const CATEGORY_ICONS = {
  frontend: Layout,
  backend: Server,
  databases: Database,
  tools: Wrench
};

export const Skills = () => {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="py-20 md:py-28 bg-[#0B1F3A]/30 border-y border-[#1E3A5F]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          tag="Keahlian Teknis"
          title={skills.title}
          subtitle={skills.subtitle}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.categories.map((category) => {
            const IconComponent = CATEGORY_ICONS[category.id] || Layout;

            return (
              <Card
                key={category.id}
                className="flex flex-col h-full bg-[#0B1F3A]/80 border-[#1E3A5F] hover:border-sky-500/50"
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#1E3A5F]/70">
                  <div className="p-2.5 rounded-lg bg-blue-950/70 border border-blue-800/60 text-sky-400">
                    <IconComponent className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">{category.name}</h3>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                  {category.description}
                </p>

                {/* Skill items list */}
                <ul className="space-y-3 mt-auto" role="list">
                  {category.items.map((skill, index) => (
                    <li
                      key={index}
                      className="p-2.5 rounded-lg bg-[#071426]/70 border border-[#1E3A5F]/60 flex flex-col justify-center"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-200">{skill.name}</span>
                        <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0" aria-hidden="true" />
                      </div>
                      {skill.detail && (
                        <span className="text-xs text-slate-400 mt-0.5 line-clamp-1">{skill.detail}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>

        {/* Note on skills */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 max-w-xl mx-auto font-mono">
            * Seluruh keahlian di atas dipelajari dan diterapkan secara berkelanjutan melalui latihan praktis dan proyek aplikasi mandiri.
          </p>
        </div>

      </div>
    </section>
  );
};
