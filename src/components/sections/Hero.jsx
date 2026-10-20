import React from 'react';
import { ArrowRight, Mail, Terminal, Sparkles, FileCode2 } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { portfolioData } from '../../data/portfolio';
import { Button } from '../ui/Button';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const Hero = () => {
  const { profile } = usePortfolio();
  const heroConfig = portfolioData.hero;

  const displayName = profile?.name || portfolioData.personal.name;
  const displayTitle = profile?.title || portfolioData.personal.role;
  const displayStatus = profile?.status || portfolioData.personal.status;
  const displayGreeting = profile?.hero_greeting || heroConfig.greeting;
  const displayHeroTitle = profile?.hero_title || heroConfig.title;
  const displayDescription = profile?.hero_description || heroConfig.description;
  const githubUrl = profile?.github_url || portfolioData.personal.github;
  const linkedinUrl = profile?.linkedin_url || portfolioData.personal.linkedin;

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center pt-24 pb-16 md:py-32 bg-tech-grid overflow-hidden"
      aria-label="Pengantar Utama"
    >
      {/* Decorative gradient glow elements */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-10 right-10 w-72 h-72 bg-sky-500/10 blur-[100px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* Status indicator badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-[#0B1F3A] border border-[#1E3A5F] text-slate-300">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{displayStatus}</span>
            </div>

            {/* Greeting & Headline */}
            <div className="space-y-2">
              <p className="text-sky-400 font-mono text-sm sm:text-base tracking-wider uppercase font-semibold">
                {displayGreeting}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
                {displayName}
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                {displayHeroTitle}
              </p>
            </div>

            {/* Concise professional description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {displayDescription}
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                as="a"
                href="#projects"
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                Lihat Proyek
              </Button>
              <Button
                as="a"
                href="#contact"
                variant="secondary"
                size="lg"
                icon={Mail}
                iconPosition="left"
              >
                Hubungi Saya
              </Button>
              {profile?.resume_url && (
                <Button
                  as="a"
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  size="lg"
                >
                  Unduh CV
                </Button>
              )}
            </div>

            {/* Social profiles & quick info */}
            <div className="pt-4 flex items-center gap-4 text-sm text-slate-400 border-t border-[#1E3A5F]/60">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Tautan:</span>
              <div className="flex items-center gap-3">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded p-1"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-xs font-mono">GitHub</span>
                  </a>
                )}
                {linkedinUrl && (
                  <a
                    href={linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded p-1"
                    aria-label="LinkedIn Profile"
                  >
                    <LinkedinIcon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-xs font-mono">LinkedIn</span>
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Code Window / Developer Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Outer decorative card frame */}
              <div className="rounded-2xl bg-[#0B1F3A]/95 border border-[#1E3A5F] shadow-2xl shadow-black/50 overflow-hidden glow-blue">
                
                {/* Code Window Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#071426] border-b border-[#1E3A5F]">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400">
                    <FileCode2 className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span>DeveloperProfile.js</span>
                  </div>
                  <div className="w-12"></div>
                </div>

                {/* Code Body */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200">
                  <pre className="text-slate-300">
                    <code>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-sky-300">developer</span> = {'{\n'}
                      {'  '}name: <span className="text-emerald-300">'{displayName}'</span>,{'\n'}
                      {'  '}role: <span className="text-emerald-300">'{displayTitle}'</span>,{'\n'}
                      {'  '}focus: [<span className="text-amber-300">'Frontend'</span>, <span className="text-amber-300">'Backend'</span>, <span className="text-amber-300">'Databases'</span>],{'\n'}
                      {'  '}cleanCode: <span className="text-sky-400">true</span>,{'\n'}
                      {'  '}willingnessToLearn: <span className="text-amber-400">100</span>,{'\n'}
                      {'  '}buildUsefulApps: () =&gt; {'{\n'}
                      {'    '}<span className="text-purple-400">return</span> <span className="text-emerald-300">"Solving real-world problems"</span>;{'\n'}
                      {'  }'}{'\n'}
                      {'};'}
                    </code>
                  </pre>
                </div>

                {/* Card footer summary */}
                <div className="px-5 py-3 bg-[#071426]/70 border-t border-[#1E3A5F] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-sky-400" aria-hidden="true" />
                    <span className="font-mono text-slate-300">Ready to build</span>
                  </div>
                  <div className="flex items-center gap-1 text-sky-400">
                    <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>Full-Stack Journey</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
