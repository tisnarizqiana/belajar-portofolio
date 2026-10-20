import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/admin.service';
import {
  FolderGit2,
  Wrench,
  FileText,
  Mail,
  Image as ImageIcon,
  ArrowUpRight,
  PlusCircle,
  Database,
  Cloud,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setError('');
      const data = await adminService.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data statistik dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-sky-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
        <p className="text-sm font-mono text-slate-400">Memuat statistik CMS dari Turso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Ringkasan Sistem CMS</h1>
          <p className="text-sm text-slate-400 mt-1">
            Pantau dan kelola konten portofolio, basis data Turso, dan aset Cloudinary Anda.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-300 bg-[#0B1F3A] border border-[#1E3A5F] hover:bg-[#1E3A5F] rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
          <Link
            to="/admin/projects"
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-500/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Tambah Proyek</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          {error}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects Card */}
        <div className="p-5 bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Proyek</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-sky-400">
              <FolderGit2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-100">{stats?.totalProjects ?? 0}</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">{stats?.publishedProjects ?? 0} publikasi</span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{stats?.draftProjects ?? 0} draf</span>
            </div>
          </div>
          <Link
            to="/admin/projects"
            className="mt-4 pt-3 border-t border-[#1E3A5F]/60 flex items-center justify-between text-xs text-sky-400 hover:text-sky-300"
          >
            <span>Kelola Proyek</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Skills Card */}
        <div className="p-5 bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Keahlian</span>
            <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-100">{stats?.totalSkills ?? 0}</div>
            <div className="text-xs text-slate-400 mt-1">Teknologi & Tools terdaftar</div>
          </div>
          <Link
            to="/admin/skills"
            className="mt-4 pt-3 border-t border-[#1E3A5F]/60 flex items-center justify-between text-xs text-sky-400 hover:text-sky-300"
          >
            <span>Kelola Keahlian</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Articles Card */}
        <div className="p-5 bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Artikel / Blog</span>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-100">{stats?.totalArticles ?? 0}</div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-medium">
                {(stats?.totalArticles ?? 0) - (stats?.draftArticles ?? 0)} publikasi
              </span>
              <span>•</span>
              <span className="text-amber-400 font-medium">{stats?.draftArticles ?? 0} draf</span>
            </div>
          </div>
          <Link
            to="/admin/articles"
            className="mt-4 pt-3 border-t border-[#1E3A5F]/60 flex items-center justify-between text-xs text-sky-400 hover:text-sky-300"
          >
            <span>Tulis Artikel</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Messages Card */}
        <div className="p-5 bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Pesan Masuk</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-bold text-slate-100">{stats?.unreadMessages ?? 0}</div>
            <div className="text-xs text-slate-400 mt-1">Pesan belum dibaca</div>
          </div>
          <Link
            to="/admin/messages"
            className="mt-4 pt-3 border-t border-[#1E3A5F]/60 flex items-center justify-between text-xs text-sky-400 hover:text-sky-300"
          >
            <span>Lihat Kotak Masuk</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* System Infrastructure Status */}
      <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>Status Layanan Terintegrasi</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#071426] border border-[#1E3A5F]/80 rounded-lg flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-sky-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">Turso Database (LibSQL)</div>
              <div className="text-xs text-emerald-400 font-mono flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Terhubung & Aktif
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#071426] border border-[#1E3A5F]/80 rounded-lg flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">Cloudinary Media CDN</div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {stats?.totalAssets ?? 0} file tersimpan di DB
              </div>
            </div>
          </div>

          <div className="p-4 bg-[#071426] border border-[#1E3A5F]/80 rounded-lg flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-200">Vercel Functions Engine</div>
              <div className="text-xs text-sky-400 font-mono mt-0.5">
                Node.js ES Modules /api/*
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
