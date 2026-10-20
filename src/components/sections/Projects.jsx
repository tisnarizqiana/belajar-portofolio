import React, { useState, useMemo } from 'react';
import { ExternalLink, Info, Star } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { ProjectIllustration } from '../ui/ProjectIllustration';
import { GithubIcon } from '../ui/Icons';

export const Projects = () => {
  const { projects } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  const categories = useMemo(() => {
    const set = new Set(["Semua"]);
    (projects || []).forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects || projects.length === 0) return [];
    if (selectedCategory === "Semua") {
      return projects;
    }
    return projects.filter((item) => item.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="projects" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          tag="Portofolio Proyek"
          title="Proyek Pilihan"
          subtitle="Kompilasi proyek pembelajaran dan aplikasi nyata yang menunjukkan alur rekayasa perangkat lunak"
        />

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                type="button"
                className={`px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'bg-[#0B1F3A] text-slate-300 hover:text-white border border-[#1E3A5F] hover:border-sky-500/40'
                }`}
                aria-pressed={isActive}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project) => {
            const techList = project.technologies || project.techStack || [];
            const featureList = project.features || [];
            const github = project.github_url || project.githubUrl;
            const demo = project.demo_url || project.demoUrl;

            return (
              <article
                key={project.id || project.slug}
                className="group bg-[#0B1F3A]/90 border border-[#1E3A5F] rounded-2xl overflow-hidden hover:border-sky-500/50 hover:shadow-xl hover:shadow-sky-950/40 transition-all duration-200 flex flex-col"
              >
                {/* Preview Graphic or Cloudinary Cover Image */}
                {project.cover_url ? (
                  <div className="h-48 sm:h-56 bg-[#071426] overflow-hidden border-b border-[#1E3A5F] relative">
                    <img
                      src={project.cover_url}
                      alt={project.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {!!project.is_featured && (
                      <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/90 text-slate-950 flex items-center gap-1 shadow-md">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                ) : (
                  <ProjectIllustration theme={project.theme_icon || project.themeIcon} title={project.title} />
                )}

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <Badge variant="blue">{project.category}</Badge>
                    {project.is_featured && !project.cover_url && (
                      <span className="text-[11px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-300" />
                        Unggulan
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-sky-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="mt-2.5 text-sm text-slate-300 leading-relaxed flex-1">
                    {project.description || project.summary}
                  </p>

                  {/* Key Features Bullet points */}
                  {featureList.length > 0 && (
                    <ul className="my-4 space-y-1 text-xs text-slate-400">
                      {featureList.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-sky-400 shrink-0"></span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Tech Stack Pills */}
                  {techList.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#1E3A5F]/60 mb-5">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#071426] text-slate-300 border border-[#1E3A5F]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Action Links */}
                  <div className="flex items-center gap-3 pt-1 mt-auto">
                    {github && (
                      <Button
                        as="a"
                        href={github}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outline"
                        size="sm"
                        icon={GithubIcon}
                        iconPosition="left"
                      >
                        Repositori
                      </Button>
                    )}
                    {demo ? (
                      <Button
                        as="a"
                        href={demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="primary"
                        size="sm"
                        icon={ExternalLink}
                        iconPosition="right"
                      >
                        Live Demo
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        Demo lokal / Siap dideploy
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Transparency note */}
        <div className="mt-12 bg-[#0B1F3A]/40 border border-[#1E3A5F] rounded-xl p-4 flex items-start gap-3 max-w-3xl mx-auto">
          <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>Catatan Data Dinamis:</strong> Daftar proyek di atas disinkronkan secara langsung dengan basis data <strong>Turso (LibSQL)</strong> dan media <strong>Cloudinary</strong> melalui antarmuka CMS Admin.
          </p>
        </div>

      </div>
    </section>
  );
};
