import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sliders,
  Globe,
} from 'lucide-react';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    site_title: '',
    site_description: '',
    enable_blog: 'true',
    enable_contact_form: 'true',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const fetchSettings = async () => {
    try {
      const data = await adminService.getSettings();
      setSettings({
        site_title: data.site_title || '',
        site_description: data.site_description || '',
        enable_blog: data.enable_blog !== undefined ? data.enable_blog : 'true',
        enable_contact_form: data.enable_contact_form !== undefined ? data.enable_contact_form : 'true',
      });
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat pengaturan');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminService.updateSettings(settings);
      showNotice('success', 'Pengaturan situs berhasil diperbarui!');
    } catch (err) {
      showNotice('error', err.message || 'Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-sky-400">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
        <p className="text-sm font-mono text-slate-400">Memuat pengaturan situs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Pengaturan Situs & SEO</h1>
        <p className="text-sm text-slate-400 mt-1">
          Konfigurasi visibilitas modul dan metadata default portofolio.
        </p>
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
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <span>Metadata & SEO Default</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Judul Halaman (Meta Title)
            </label>
            <input
              type="text"
              value={settings.site_title}
              onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
              className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Deskripsi Halaman (Meta Description)
            </label>
            <textarea
              rows={3}
              value={settings.site_description}
              onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
              className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
            />
          </div>
        </div>

        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl p-6 space-y-4">
          <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Visibilitas Fitur</span>
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_blog === 'true'}
                onChange={(e) =>
                  setSettings({ ...settings, enable_blog: e.target.checked ? 'true' : 'false' })
                }
                className="w-4 h-4 rounded border-[#1E3A5F] text-blue-600 focus:ring-sky-400 bg-[#071426]"
              />
              <div>
                <div className="text-sm font-medium text-slate-200">Aktifkan Bagian Blog / Artikel</div>
                <div className="text-xs text-slate-400">
                  Tampilkan artikel yang telah dipublikasikan di halaman depan portofolio.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer pt-2 border-t border-[#1E3A5F]/60">
              <input
                type="checkbox"
                checked={settings.enable_contact_form === 'true'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    enable_contact_form: e.target.checked ? 'true' : 'false',
                  })
                }
                className="w-4 h-4 rounded border-[#1E3A5F] text-blue-600 focus:ring-sky-400 bg-[#071426]"
              />
              <div>
                <div className="text-sm font-medium text-slate-200">Aktifkan Formulir Kontak Interaktif</div>
                <div className="text-xs text-slate-400">
                  Simpan kiriman pesan pengunjung secara langsung ke basis data Turso.
                </div>
              </div>
            </label>
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
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Simpan Pengaturan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
