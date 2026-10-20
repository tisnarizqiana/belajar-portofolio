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
  Wrench,
  Eye,
  EyeOff,
} from 'lucide-react';

export function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    name: '',
    category: 'frontend',
    detail: '',
    icon: '',
    display_order: 0,
    is_visible: true,
  });

  const fetchSkills = async () => {
    try {
      const data = await adminService.getSkills();
      setSkills(data);
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat keahlian');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const openCreateModal = () => {
    setEditingSkill(null);
    setFormData({
      name: '',
      category: activeCategory !== 'All' ? activeCategory : 'frontend',
      detail: '',
      icon: '',
      display_order: skills.length + 1,
      is_visible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      detail: skill.detail || '',
      icon: skill.icon || '',
      display_order: skill.display_order || 0,
      is_visible: !!skill.is_visible,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showNotice('error', 'Nama keahlian wajib diisi');
      return;
    }

    setSaving(true);
    try {
      if (editingSkill) {
        await adminService.updateSkill(editingSkill.id, formData);
        showNotice('success', 'Keahlian berhasil diperbarui!');
      } else {
        await adminService.createSkill(formData);
        showNotice('success', 'Keahlian baru berhasil ditambahkan!');
      }

      setModalOpen(false);
      fetchSkills();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menyimpan keahlian');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Hapus keahlian "${name}"?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteSkill(id);
      showNotice('success', 'Keahlian berhasil dihapus');
      fetchSkills();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menghapus keahlian');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredSkills = skills.filter((s) => {
    if (activeCategory === 'All') return true;
    return s.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const categories = ['All', 'frontend', 'backend', 'databases', 'tools'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Keahlian Teknis (Skills)</h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola bahasa, framework, pustaka, dan perkakas teknis yang tampil di portofolio.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Keahlian</span>
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

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-[#0B1F3A] text-slate-400 hover:text-white border border-[#1E3A5F]'
            }`}
          >
            {cat === 'All' ? 'Semua Kategori' : cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Skills Table */}
      <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-sky-400">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-mono text-slate-400">Memuat keahlian...</p>
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Wrench className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-base font-medium text-slate-300">Belum ada keahlian di kategori ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] bg-[#071426]/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Nama Keahlian</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Detail / Fokus</th>
                  <th className="py-3.5 px-4">Visibilitas</th>
                  <th className="py-3.5 px-4 text-center">Urutan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/60">
                {filteredSkills.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{s.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs font-mono bg-slate-800 text-sky-300 border border-slate-700">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 text-xs">{s.detail || '-'}</td>
                    <td className="py-3.5 px-4">
                      {s.is_visible ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <Eye className="w-3.5 h-3.5" />
                          Tampil
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                          <EyeOff className="w-3.5 h-3.5" />
                          Tersembunyi
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                      {s.display_order}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 text-slate-400 hover:text-sky-300 rounded hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          disabled={deletingId === s.id}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                          {deletingId === s.id ? (
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <h2 className="text-lg font-bold text-slate-100">
                {editingSkill ? 'Edit Keahlian' : 'Tambah Keahlian Baru'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Keahlian / Teknologi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Contoh: React.js"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                >
                  <option value="frontend">Frontend Development</option>
                  <option value="backend">Backend Development</option>
                  <option value="databases">Databases</option>
                  <option value="tools">Tools & Workflow</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Keterangan / Detail (Opsional)
                </label>
                <input
                  type="text"
                  value={formData.detail}
                  onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Hooks, Komponen Modular, State Management"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Urutan</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_visible}
                      onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                      className="w-4 h-4 rounded border-[#1E3A5F] text-blue-600 focus:ring-sky-400 bg-[#071426]"
                    />
                    <span className="text-sm text-slate-200">Tampilkan</span>
                  </label>
                </div>
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
                  <span>{editingSkill ? 'Simpan' : 'Tambah'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
