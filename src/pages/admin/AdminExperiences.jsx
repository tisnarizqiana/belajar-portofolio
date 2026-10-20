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
  Milestone,
  Eye,
  EyeOff,
} from 'lucide-react';

export function AdminExperiences() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const [formData, setFormData] = useState({
    type: 'milestone',
    title: '',
    organization: '',
    description: '',
    period: '',
    tags: '',
    display_order: 0,
    is_visible: true,
  });

  const fetchExperiences = async () => {
    try {
      const data = await adminService.getExperiences();
      setExperiences(data);
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat milestone');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const openCreateModal = () => {
    setEditingExp(null);
    setFormData({
      type: 'milestone',
      title: '',
      organization: '',
      description: '',
      period: '',
      tags: '',
      display_order: experiences.length + 1,
      is_visible: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (exp) => {
    setEditingExp(exp);
    setFormData({
      type: exp.type || 'milestone',
      title: exp.title,
      organization: exp.organization,
      description: exp.description || '',
      period: exp.period,
      tags: (exp.tags || []).join(', '),
      display_order: exp.display_order || 0,
      is_visible: !!exp.is_visible,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.organization.trim() || !formData.period.trim()) {
      showNotice('error', 'Judul, Organisasi/Instansi, dan Periode wajib diisi');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingExp) {
        await adminService.updateExperience(editingExp.id, payload);
        showNotice('success', 'Milestone berhasil diperbarui!');
      } else {
        await adminService.createExperience(payload);
        showNotice('success', 'Milestone baru berhasil ditambahkan!');
      }

      setModalOpen(false);
      fetchExperiences();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menyimpan milestone');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Hapus milestone "${title}"?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteExperience(id);
      showNotice('success', 'Milestone berhasil dihapus');
      fetchExperiences();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menghapus milestone');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Perjalanan, Pengalaman & Edukasi
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Kelola rekam jejak, riwayat pendidikan, magang, atau milestone pembelajaran di Turso.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Milestone</span>
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
            <p className="text-sm font-mono text-slate-400">Memuat riwayat milestone...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Milestone className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <p className="text-base font-medium text-slate-300">Belum ada milestone tercatat</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#1E3A5F] bg-[#071426]/70 text-slate-400 text-xs uppercase tracking-wider font-semibold">
                  <th className="py-3.5 px-4">Judul / Peran</th>
                  <th className="py-3.5 px-4">Organisasi / Instansi</th>
                  <th className="py-3.5 px-4">Periode</th>
                  <th className="py-3.5 px-4">Tipe</th>
                  <th className="py-3.5 px-4">Visibilitas</th>
                  <th className="py-3.5 px-4 text-center">Urutan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/60">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-100">{exp.title}</td>
                    <td className="py-3.5 px-4 text-slate-300">{exp.organization}</td>
                    <td className="py-3.5 px-4 text-xs font-mono text-sky-400">{exp.period}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-xs uppercase font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {exp.type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {exp.is_visible ? (
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
                      {exp.display_order}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(exp)}
                          className="p-1.5 text-slate-400 hover:text-sky-300 rounded hover:bg-slate-800 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.id, exp.title)}
                          disabled={deletingId === exp.id}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                          {deletingId === exp.id ? (
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
          <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-[#1E3A5F]">
              <h2 className="text-lg font-bold text-slate-100">
                {editingExp ? 'Edit Milestone' : 'Tambah Milestone Baru'}
              </h2>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tipe</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  >
                    <option value="milestone">Milestone Pembelajaran</option>
                    <option value="experience">Pengalaman Kerja / Magang</option>
                    <option value="education">Edukasi / Sertifikasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Periode Waktu *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                    placeholder="Contoh: 2024 - Sekarang"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Judul / Peran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Contoh: Eksplorasi Full-Stack Modern"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Organisasi / Lembaga / Konteks *
                </label>
                <input
                  type="text"
                  required
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Contoh: Pembelajaran Mandiri & Proyek Terarah"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Uraian Deskripsi
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="Fokus dan pencapaian selama periode ini..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Tags Terkait (pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-[#071426] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-400"
                  placeholder="React.js, Node.js, PostgreSQL"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Urutan Tampil</label>
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
                    <span className="text-sm text-slate-200">Tampilkan di Publik</span>
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
                  <span>{editingExp ? 'Simpan' : 'Tambah'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
