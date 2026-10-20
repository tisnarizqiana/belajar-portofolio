import React, { useEffect, useState } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  FolderGit2,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Star,
  Eye,
  EyeOff,
} from 'lucide-react';

export function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Full-Stack',
    summary: '',
    description: '',
    technologies: '',
    features: '',
    cover_url: '',
    github_url: '',
    demo_url: '',
    is_featured: false,
    status: 'published',
    display_order: 0,
  });

  const fetchProjects = async () => {
    try {
      const data = await adminService.getProjects();
      setProjects(data);
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat proyek');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const openCreateModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      slug: '',
      category: 'Full-Stack',
      summary: '',
      description: '',
      technologies: '',
      features: '',
      cover_url: '',
      github_url: '',
      demo_url: '',
      is_featured: false,
      status: 'published',
      display_order: projects.length + 1,
    });
    setModalOpen(true);
  };

  const openEditModal = (project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      slug: project.slug,
      category: project.category,
      summary: project.summary || '',
      description: project.description || '',
      technologies: (project.technologies || []).join(', '),
      features: (project.features || []).join('\n'),
      cover_url: project.cover_url || '',
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      is_featured: !!project.is_featured,
      status: project.status || 'published',
      display_order: project.display_order || 0,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showNotice('error', 'Judul proyek wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        technologies: formData.technologies
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        features: formData.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean),
      };

      if (editingProject) {
        await adminService.updateProject(editingProject.id, payload);
        showNotice('success', 'Proyek berhasil diperbarui!');
      } else {
        await adminService.createProject(payload);
        showNotice('success', 'Proyek baru berhasil ditambahkan!');
      }

      setModalOpen(false);
      fetchProjects();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menyimpan proyek');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus proyek "${title}" secara permanen dari basis data?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await adminService.deleteProject(id);
      showNotice('success', 'Proyek berhasil dihapus');
      fetchProjects();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menghapus proyek');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Manajemen Proyek</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola karya, repo GitHub, demo langsung, dan status publikasi di Turso DB.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Proyek Baru</span>
        </button>
      </div>

      {/* Notification Banner */}
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

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#0B1F3A] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-[#0B1F3A] border border-[#1E3A5F] rounded-lg text-sm text-slate-300 focus:outline-none focus:border-sky-400"
        >
          <option value="All">Semua Kategori</option>
          <option value="Full-Stack">Full-Stack</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sky-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-mono text-slate-400">Mengambil data proyek dari Turso...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FolderGit2 className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-base font-medium text-slate-300">Belum ada proyek ditemukan</p>
            <p className="text-sm mt-1">Tambahkan proyek pertama Anda untuk mulai memamerkan karya.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] bg-[#071426]/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Proyek</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Teknologi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Urutan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/60">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {p.cover_url ? (
                          <img
                            src={p.cover_url}
                            alt=""
                            className="w-10 h-10 rounded object-cover border border-[#1E3A5F] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-[#071426] border border-[#1E3A5F] flex items-center justify-center text-slate-500 shrink-0">
                            <FolderGit2 className="w-5 h-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-slate-100 flex items-center gap-1.5">
                            <span>{p.title}</span>
                            {!!p.is_featured && (
                              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            )}
                          </div>
                          <div className="text-xs text-sky-400 font-mono">/{p.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {(p.technologies || []).slice(0, 3).map((t, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-1.5 py-0.5 rounded bg-blue-950/40 text-sky-300 border border-blue-900/40 font-mono"
                          >
                            {t}
                          </span>
                        ))}
                        {(p.technologies || []).length > 3 && (
                          <span className="text-[11px] text-slate-500 self-center">
                            +{p.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === 'published' ? (
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
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {p.display_order}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-slate-400 hover:text-sky-300 rounded hover:bg-slate-800 transition-colors"
                          title="Edit Proyek"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id, p.title)}
                          disabled={deletingId === p.id}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                          title="Hapus Proyek"
                        >
                          {deletingId === p.id ? (
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

      {/* Modal Add / Edit */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <h2 className="text-lg font-bold text-slate-100">
                {editingProject ? 'Edit Data Proyek' : 'Tambah Proyek Baru'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Judul Proyek *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="Contoh: Personal Task Management"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Slug Kustom (Opsional)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400 font-mono"
                    placeholder="task-management-app"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="Mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status Publikasi</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="published">Publik (Tampil di Portofolio)</option>
                    <option value="draft">Draf (Disembunyikan)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Urutan Tampil</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Deskripsi / Ringkasan Proyek
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value, summary: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Jelaskan tujuan dan fungsi utama proyek..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Teknologi (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="React.js, Tailwind CSS, Node.js, PostgreSQL"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Fitur Utama (satu fitur per baris)
                </label>
                <textarea
                  rows={3}
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="CRUD aktivitas dinamis&#10;Filter kategori tugas&#10;Desain responsif mobile"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">URL GitHub</label>
                  <input
                    type="url"
                    value={formData.github_url}
                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    URL Demo Langsung (Opsional)
                  </label>
                  <input
                    type="url"
                    value={formData.demo_url}
                    onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="https://myapp.vercel.app"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  URL Cover Image (dari Cloudinary atau Media Library)
                </label>
                <input
                  type="text"
                  value={formData.cover_url}
                  onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="https://res.cloudinary.com/..."
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 rounded border-[#1E3A5F] text-blue-600 focus:ring-sky-400 bg-[#071426]"
                  />
                  <span className="text-sm text-slate-200">Tandai sebagai Proyek Unggulan (Featured)</span>
                </label>
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
                  <span>{editingProject ? 'Simpan Perubahan' : 'Buat Proyek'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
