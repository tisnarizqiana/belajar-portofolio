import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Wrench,
  Milestone,
  FileText,
  Image as ImageIcon,
  Mail,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari CMS?')) {
      setLoggingOut(true);
      try {
        await logout();
        navigate('/admin/login');
      } finally {
        setLoggingOut(false);
      }
    }
  };

  const navItems = [
    { name: 'Ringkasan', path: '/admin', icon: LayoutDashboard, end: true },
    { name: 'Profil & Bio', path: '/admin/profile', icon: User },
    { name: 'Proyek', path: '/admin/projects', icon: FolderGit2 },
    { name: 'Keahlian (Skills)', path: '/admin/skills', icon: Wrench },
    { name: 'Pengalaman & Edu', path: '/admin/experiences', icon: Milestone },
    { name: 'Artikel (Blog)', path: '/admin/articles', icon: FileText },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Pesan Kontak', path: '/admin/messages', icon: Mail },
    { name: 'Pengaturan Situs', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#071426] text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#0B1F3A] border-b border-[#1E3A5F]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            TR
          </div>
          <div>
            <div className="font-semibold text-sm text-slate-100">CMS Admin</div>
            <div className="text-xs text-sky-400 font-mono">Tisna Portfolio</div>
          </div>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-[#0B1F3A]/95 md:bg-[#0B1F3A] border-r border-[#1E3A5F] flex flex-col shrink-0 z-30`}
      >
        {/* Brand Area */}
        <div className="hidden md:flex items-center gap-3 p-5 border-b border-[#1E3A5F]">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">
            TR
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-wide text-slate-100">PORTFOLIO CMS</h1>
            <p className="text-xs text-sky-400 font-mono">Turso & Cloudinary</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-blue-600/20 text-sky-300 border border-blue-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/40'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info & Footer Actions */}
        <div className="p-4 border-t border-[#1E3A5F] space-y-3 bg-[#071426]/50">
          <div className="flex items-center gap-2 px-1">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-mono truncate" title={user?.email}>
              {user?.email || 'admin@portfolio'}
            </span>
          </div>

          <div className="flex flex-col gap-1.5 pt-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2 text-xs text-sky-300 hover:text-sky-200 bg-sky-950/40 hover:bg-sky-950/60 rounded-md border border-sky-800/40 transition-colors"
            >
              <span>Lihat Portofolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center justify-between w-full px-3 py-2 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-950/50 rounded-md border border-rose-900/40 transition-colors disabled:opacity-50"
            >
              <span>{loggingOut ? 'Keluar...' : 'Keluar (Logout)'}</span>
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="p-4 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
