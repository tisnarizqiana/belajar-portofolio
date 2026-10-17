import React from 'react';
import { useActiveSection } from './hooks/useActiveSection';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Journey } from './components/sections/Journey';
import { Contact } from './components/sections/Contact';
import { Footer } from './components/layout/Footer';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'journey', 'contact'];

export function App() {
  const activeSection = useActiveSection(SECTION_IDS, 'home');

  return (
    <div className="min-h-screen bg-[#071426] text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* Skip to Main Content Link for Keyboard Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-xl focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        Lewati ke konten utama
      </a>

      {/* Navigation Header */}
      <Navbar activeSection={activeSection} />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Journey />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
