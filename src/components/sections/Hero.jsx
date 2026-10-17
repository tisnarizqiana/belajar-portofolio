import React from 'react';
import { ArrowRight, Mail, Terminal, Sparkles, FileCode2 } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { Button } from '../ui/Button';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

export const Hero = () => {
  const { personal, hero } = portfolioData;

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
              <span>{personal.status}</span>
            </div>

            {/* Greeting & Headline */}
            <div className="space-y-2">
              <p className="text-sky-400 font-mono text-sm sm:text-base tracking-wider uppercase font-semibold">
                {hero.greeting}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
                {personal.name}
              </h1>
              <p className="text-2xl sm:text-3xl font-semibold bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                {hero.title}
              </p>
            </div>

            {/* Concise professional description */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {hero.description}
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                as="a"
                href={hero.primaryCta.href}
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
              >
                {hero.primaryCta.text}
              </Button>
              <Button
                as="a"
                href={hero.secondaryCta.href}
                variant="secondary"
                size="lg"
                icon={Mail}
                iconPosition="left"
              >
                {hero.secondaryCta.text}
              </Button>
            </div>

            {/* Social profiles & quick info */}
            <div className="pt-4 flex items-center gap-4 text-sm text-slate-400 border-t border-[#1E3A5F]/60">
              <span className="font-mono text-xs uppercase tracking-wider text-slate-400">Tautan:</span>
              <div className="flex items-center gap-3">
                {personal.github && (
                  <a
                    href={personal.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-slate-300 hover:text-sky-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded p-1"
                    aria-label="GitHub Profile"
                  >
                    <GithubIcon className="w-4 h-4" aria-hidden="true" />
                    <span className="text-xs font-mono">GitHub</span>
                  </a>
                )}
                {personal.linkedin && (
                  <a
                    href={personal.linkedin}
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
                    <span>{hero.codeSnippet.fileName}</span>
                  </div>
                  <div className="w-12"></div>
                </div>

                {/* Code Body */}
                <div className="p-5 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto text-slate-200">
                  <pre className="text-slate-300">
                    <code>
                      <span className="text-purple-400">const</span>{' '}
                      <span className="text-sky-300">developer</span> = {'{\n'}
                      {'  '}name: <span className="text-emerald-300">'{personal.name}'</span>,{'\n'}
                      {'  '}role: <span className="text-emerald-300">'{personal.role}'</span>,{'\n'}
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
