import React from 'react';
import { Calendar } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const Journey = () => {
  const { journey } = portfolioData;

  if (!journey || !journey.milestones || journey.milestones.length === 0) {
    return null;
  }

  return (
    <section id="journey" className="py-20 md:py-28 bg-[#0B1F3A]/20 border-y border-[#1E3A5F]/40 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          tag="Rekam Jejak"
          title={journey.title}
          subtitle={journey.subtitle}
        />

        <div className="relative border-l-2 border-[#1E3A5F] ml-4 md:ml-32 space-y-10 pl-6 md:pl-10">
          {journey.milestones.map((milestone, index) => (
            <div key={index} className="relative group">
              
              {/* Timeline dot */}
              <div
                className="absolute -left-[31px] md:-left-[47px] top-1.5 w-4 h-4 rounded-full bg-[#071426] border-2 border-sky-400 group-hover:bg-sky-400 transition-colors shadow-sm"
                aria-hidden="true"
              />

              {/* Period marker on desktop */}
              <div className="hidden md:block absolute -left-40 top-0.5 w-28 text-right font-mono text-xs text-sky-400 font-semibold">
                {milestone.period}
              </div>

              {/* Card content */}
              <Card className="bg-[#0B1F3A]/90 border-[#1E3A5F] group-hover:border-sky-500/40">
                {/* Mobile period display */}
                <div className="md:hidden inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 font-semibold mb-2">
                  <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{milestone.period}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-100">
                  {milestone.title}
                </h3>

                <p className="text-xs font-mono text-sky-300 mt-1">
                  {milestone.organization}
                </p>

                <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                  {milestone.description}
                </p>

                {milestone.tags && milestone.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-[#1E3A5F]/60">
                    {milestone.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#071426] text-slate-400 border border-[#1E3A5F]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Card>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
