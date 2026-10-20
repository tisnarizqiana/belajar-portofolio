import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  FileText,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';

export function AdminArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_url: '',
    status: 'draft',
    author_name: '',
  });

  const fetchArticles = async () => {
    try {
      const data = await adminService.getArticles();
      setArticles(data);
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat artikel');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      cover_url: '',
      status: 'draft',
      author_name: 'Tisna Rizqiana',
    });
    setModalOpen(true);
  };

  const openEditModal = (art) => {
    setEditingArticle(art);
    setFormData({
      title: art.title,
      slug: art.slug,
      excerpt: art.excerpt || '',
      content: art.content || '',
      cover_url: art.cover_url || '',
      status: art.status || 'draft',
      author_name: art.author_name || 'Tisna Rizqiana',
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      showNotice('error', 'Judul dan Konten artikel wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editingArticle) {
        await adminService.updateArticle(editingArticle.id, formData);
        showNotice('success', 'Artikel berhasil diperbarui!');
      } else {
        await adminService.createArticle(formData);
        showNotice('success', 'Artikel baru berhasil dibuat!');
      }

      setModalOpen(false);
      fetchArticles();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menyimpan artikel');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus artikel "${title}" secara permanen?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteArticle(id);
      showNotice('success', 'Artikel berhasil dihapus');
      fetchArticles();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menghapus artikel');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Artikel & Catatan Teknis (Blog)</h1>
          <p className="text-sm text-slate-400 mt-1">
            Publikasikan tulisan teknologi, tutorial rekayasa perangkat lunak, dan catatan belajar Anda.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tulis Artikel Baru</span>
        </button>
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

      {/* Table */}
      <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sky-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-mono text-slate-400">Memuat artikel dari Turso...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-base font-medium text-slate-300">Belum ada artikel</p>
            <p className="text-sm mt-1">Mulai tulis wawasan dan dokumentasi teknik Anda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] bg-[#071426]/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Judul Artikel</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Waktu Baca</th>
                  <th className="py-3.5 px-4">Penulis</th>
                  <th className="py-3.5 px-4">Tanggal Buat</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/60">
                {articles.map((art) => (
                  <tr key={art.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-100">{art.title}</div>
                      <div className="text-xs font-mono text-sky-400">/{art.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      {art.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <Eye className="w-3 h-3" />
                          Publik
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <EyeOff className="w-3 h-3" />
                          Draf
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.reading_time_minutes || 1} menit</span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-300">{art.author_name || '-'}</td>
                    <td className="py-3.5 px-4 text-xs text-slate-400 font-mono">
                      {art.created_at ? new Date(art.created_at).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(art)}
                          className="p-1.5 text-slate-400 hover:text-sky-300 rounded hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(art.id, art.title)}
                          disabled={deletingId === art.id}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                          {deletingId === art.id ? (
                            <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <h2 className="text-lg font-bold text-slate-100">
                {editingArticle ? 'Edit Artikel' : 'Tulis Artikel Baru'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Judul Artikel *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="Contoh: Arsitektur Modern dengan LibSQL & React"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Slug Kustom</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400 font-mono"
                    placeholder="arsitektur-modern-libsql"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="draft">Draf (Hanya Admin)</option>
                    <option value="published">Publikasikan (Tampil di Web)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Nama Penulis</label>
                  <input
                    type="text"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ringkasan / Excerpt</label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Ringkasan singkat artikel untuk kartu preview..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Konten Artikel (Mendukung Markdown) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400 font-mono"
                  placeholder="Tulis artikel Anda di sini menggunakan sintaks Markdown..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div className="pt-4 border-t border-[#1E3A5F] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingArticle ? 'Simpan Artikel' : 'Terbitkan Artikel'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
