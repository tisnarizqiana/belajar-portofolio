import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  User,
  FileText,
  Image as ImageIcon,
} from 'lucide-react';

export function AdminProfile() {
  const [profile, setProfile] = useState({
    name: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    status: '',
    github_url: '',
    linkedin_url: '',
    whatsapp_url: '',
    hero_greeting: '',
    hero_title: '',
    hero_description: '',
    profile_image_url: '',
    resume_url: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const showNotice = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await adminService.getProfile();
      setProfile({
        name: data.name || '',
        title: data.title || '',
        bio: data.bio || '',
        email: data.email || '',
        location: data.location || '',
        status: data.status || '',
        github_url: data.github_url || '',
        linkedin_url: data.linkedin_url || '',
        whatsapp_url: data.whatsapp_url || '',
        hero_greeting: data.hero_greeting || '',
        hero_title: data.hero_title || '',
        hero_description: data.hero_description || '',
        profile_image_url: data.profile_image_url || '',
        resume_url: data.resume_url || '',
      });
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateProfile(profile);
      showNotice('success', 'Profil berhasil disimpan ke database Turso!');
    } catch (err) {
      showNotice('error', err.message || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-sky-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
        <p className="text-sm font-mono text-slate-400">Memuat profil pengembang...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Profil & Informasi Publik</h1>
          <p className="text-sm text-slate-400 mt-1">
            Sesuaikan identitas, bio, tautan sosial, dan teks hero tanpa menyentuh kode program.
          </p>
        </div>
      </div>

      {notification.message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
            notification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Identitas Utama */}
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-sky-400" />
            <span>Identitas Developer</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Nama Lengkap *</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Peran / Titel *</label>
              <input
                type="text"
                required
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Kontak</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Lokasi</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Status Ketersediaan</label>
              <input
                type="text"
                value={profile.status}
                onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Biografi Singkat</label>
            <textarea
              rows={3}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Konten Hero Section</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sapaan Hero</label>
              <input
                type="text"
                value={profile.hero_greeting}
                onChange={(e) => setProfile({ ...profile, hero_greeting: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Judul Utama Hero</label>
              <input
                type="text"
                value={profile.hero_title}
                onChange={(e) => setProfile({ ...profile, hero_title: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Deskripsi Hero</label>
            <textarea
              rows={2}
              value={profile.hero_description}
              onChange={(e) => setProfile({ ...profile, hero_description: e.target.value })}
              className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        {/* Media & Sosial Links */}
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-sky-400" />
            <span>Aset Media & Tautan Sosial</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Foto Profil (URL Cloudinary)
              </label>
              <input
                type="text"
                value={profile.profile_image_url}
                onChange={(e) => setProfile({ ...profile, profile_image_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Unduh Résumé / CV (URL Dokumen)
              </label>
              <input
                type="text"
                value={profile.resume_url}
                onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">GitHub URL</label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">LinkedIn URL</label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">WhatsApp URL</label>
              <input
                type="url"
                value={profile.whatsapp_url}
                onChange={(e) => setProfile({ ...profile, whatsapp_url: e.target.value })}
                className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                placeholder="https://wa.me/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-lg shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyimpan ke Turso...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Profil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
