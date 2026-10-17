import React from 'react';
import { CheckCircle2, Target, BookOpen } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';

export const About = () => {
  const { about } = portfolioData;

  const coreValues = [
    {
      icon: Target,
      title: "Solusi Berorientasi Masalah",
      description: "Menyusun kode bukan sekadar menulis sintaks, tetapi memahami konteks kebutuhan pengguna dan merancang alur logika yang tepat guna."
    },
    {
      icon: CheckCircle2,
      title: "Prinsip Clean Engineering",
      description: "Menerapkan struktur modular, penamaan variabel yang deskriptif, dan kode yang mudah dibaca serta dirawat (maintainable)."
    },
    {
      icon: BookOpen,
      title: "Kesiapan Belajar & Beradaptasi",
      description: "Terus memperluas wawasan mengenai standar industri baru, praktik keamanan web, serta arsitektur full-stack yang skalabel."
    }
  ];

  return (
    <section id="about" className="py-20 md:py-28 relative" aria-labelledby="about-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <SectionHeading
          tag="Tentang Saya"
          title={about.title}
          subtitle={about.subtitle}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Story Narrative */}
          <div className="lg:col-span-7 space-y-5 text-slate-300 leading-relaxed text-base sm:text-lg">
            {about.paragraphs.map((paragraph, index) => (
              <p key={index} className="bg-[#0B1F3A]/40 p-4 rounded-xl border border-[#1E3A5F]/50">
                {paragraph}
              </p>
            ))}

            {/* Quick highlight cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {about.highlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#0B1F3A]/80 border border-[#1E3A5F] rounded-lg p-3.5 flex flex-col justify-center"
                >
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-wider">{item.label}</span>
                  <span className="text-sm font-semibold text-slate-200 mt-1">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Values / Work Principles */}
          <div className="lg:col-span-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-2 font-mono">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              Prinsip Kerja & Belajar
            </h3>

            {coreValues.map((val, i) => {
              const Icon = val.icon;
              return (
                <Card key={i} className="flex gap-4 items-start" hoverEffect={false}>
                  <div className="p-2.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-sky-400 shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-100">{val.title}</h4>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{val.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
