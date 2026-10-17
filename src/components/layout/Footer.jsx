import React from 'react';
import { Code2, ArrowUp } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

const CURRENT_YEAR = new Date().getFullYear();

export const Footer = () => {
  const { personal } = portfolioData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#071426] border-t border-[#1E3A5F] py-12 relative text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center pb-8 border-b border-[#1E3A5F]/60">
          
          {/* Brand & Statement */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2 text-slate-100 font-bold text-lg font-mono">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400">
                <Code2 className="w-4 h-4" aria-hidden="true" />
              </div>
              <span>
                {personal.name.split(' ')[0]}
                <span className="text-sky-400">.dev</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Membangun aplikasi web yang solid, berorientasi nilai guna, dan menjunjung tinggi standar kode bersih dari frontend hingga backend.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-4 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium">
            <a href="#home" className="hover:text-sky-400 transition-colors">Beranda</a>
            <a href="#about" className="hover:text-sky-400 transition-colors">Tentang</a>
            <a href="#skills" className="hover:text-sky-400 transition-colors">Keahlian</a>
            <a href="#projects" className="hover:text-sky-400 transition-colors">Proyek</a>
            <a href="#journey" className="hover:text-sky-400 transition-colors">Perjalanan</a>
            <a href="#contact" className="hover:text-sky-400 transition-colors">Kontak</a>
          </div>

          {/* Social Profiles & Back to Top */}
          <div className="md:col-span-2 flex items-center justify-start md:justify-end gap-3">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#0B1F3A] hover:bg-[#132d54] text-slate-300 hover:text-white border border-[#1E3A5F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-[#0B1F3A] hover:bg-[#132d54] text-slate-300 hover:text-white border border-[#1E3A5F] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
            <button
              type="button"
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-sky-400 border border-blue-500/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-label="Kembali ke atas halaman"
              title="Kembali ke atas"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* Copyright & Meta */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {CURRENT_YEAR} {personal.name}. Seluruh hak cipta dilindungi.</p>
          <p className="font-mono text-[11px]">
            Dibuat dengan <span className="text-sky-400">React</span> &amp; <span className="text-sky-400">Tailwind CSS v4</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
