import React, { useState, useEffect } from 'react';
import { Menu, X, Code2, Send } from 'lucide-react';
import { portfolioData } from '../../data/portfolio';
import { GithubIcon, LinkedinIcon } from '../ui/Icons';

const NAV_ITEMS = [
  { label: 'Beranda', href: '#home', id: 'home' },
  { label: 'Tentang', href: '#about', id: 'about' },
  { label: 'Keahlian', href: '#skills', id: 'skills' },
  { label: 'Proyek', href: '#projects', id: 'projects' },
  { label: 'Perjalanan', href: '#journey', id: 'journey' },
  { label: 'Kontak', href: '#contact', id: 'contact' },
];

export const Navbar = ({ activeSection }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { personal } = portfolioData;

  // Handle scroll appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const closeMenu = () => setIsOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#071426]/90 backdrop-blur-md border-b border-[#1E3A5F] shadow-lg shadow-black/20'
          : 'bg-[#071426]/60 backdrop-blur-sm border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand Wordmark */}
          <a
            href="#home"
            className="group flex items-center gap-2.5 text-slate-100 font-bold text-lg tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 rounded-lg p-1"
            aria-label={`${personal.name} - Beranda`}
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-sky-400 group-hover:border-sky-400 group-hover:bg-blue-600/30 transition-colors">
              <Code2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="font-mono text-sm sm:text-base">
              {personal.name.split(' ')[0]}
              <span className="text-sky-400">.dev</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2" aria-label="Navigasi Utama">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 ${
                    isActive
                      ? 'text-sky-400 bg-blue-950/60 border border-blue-800/60 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-[#0B1F3A]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1F3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-[#0B1F3A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 shadow-sm hover:shadow-blue-500/20"
            >
              <Send className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Hubungi</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleMenu}
              type="button"
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-[#0B1F3A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Tutup navigasi' : 'Buka navigasi'}
              aria-controls="mobile-navigation"
            >
              {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-navigation"
        className={`md:hidden fixed inset-x-0 top-16 bg-[#071426]/98 border-b border-[#1E3A5F] px-4 pt-4 pb-6 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-hidden={!isOpen}
      >
        <nav className="flex flex-col gap-1.5" aria-label="Navigasi Mobile">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={closeMenu}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                  isActive
                    ? 'text-sky-400 bg-blue-950/70 border border-blue-800/50'
                    : 'text-slate-200 hover:text-white hover:bg-[#0B1F3A]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="mt-6 pt-5 border-t border-[#1E3A5F] flex items-center justify-between">
          <div className="flex items-center gap-3">
            {personal.github && (
              <a
                href={personal.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0B1F3A] text-slate-300 hover:text-white border border-[#1E3A5F]"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
            {personal.linkedin && (
              <a
                href={personal.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg bg-[#0B1F3A] text-slate-300 hover:text-white border border-[#1E3A5F]"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
          </div>
          <a
            href="#contact"
            onClick={closeMenu}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white shadow-sm"
          >
            <Send className="w-4 h-4" aria-hidden="true" />
            <span>Kirim Pesan</span>
          </a>
        </div>
      </div>
    </header>
  );
};
