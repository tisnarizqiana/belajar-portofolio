import React, { useEffect, useState, useRef } from 'react';
import { adminService } from '../../services/admin.service';
import {
  UploadCloud,
  Image as ImageIcon,
  Trash2,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  CheckCircle,
  FileText,
  Search,
} from 'lucide-react';

export function AdminMedia() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ type: '', message: '' });
  const fileInputRef = useRef(null);

  const showNotice = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  };

  const fetchMedia = async () => {
    try {
      const data = await adminService.getMedia();
      setMedia(data);
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat galeri media');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      showNotice('error', 'Ukuran file melebihi batas maksimal 10MB.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setUploading(true);
    try {
      await adminService.uploadFileToCloudinary(file, file.name);
      showNotice('success', `File "${file.name}" berhasil diunggah ke Cloudinary!`);
      fetchMedia();
    } catch (err) {
      showNotice('error', err.message || 'Gagal mengunggah file ke Cloudinary.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCopyUrl = (url, id) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id, publicId) => {
    if (!window.confirm(`Hapus aset "${publicId}" dari Cloudinary dan database? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await adminService.deleteMedia(id);
      showNotice('success', 'Aset media berhasil dihapus!');
      fetchMedia();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menghapus aset media.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMedia = media.filter((m) => {
    const term = searchTerm.toLowerCase();
    return (
      (m.public_id || '').toLowerCase().includes(term) ||
      (m.alt_text || '').toLowerCase().includes(term) ||
      (m.format || '').toLowerCase().includes(term)
    );
  });

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Media & Asset Manager</h1>
          <p className="text-sm text-slate-400 mt-1">
            Unggah dan kelola aset gambar portofolio langsung ke CDN Cloudinary dengan tanda tangan aman.
          </p>
        </div>

        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,application/pdf"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-500/20 transition-all disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengunggah ke Cloudinary...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-4 h-4" />
                <span>Unggah Media Baru</span>
              </>
            )}
          </button>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Cari aset berdasarkan ID atau format..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-[#0B1F3A] border border-[#1E3A5F] rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-sky-400"
        />
      </div>

      {/* Media Grid */}
      {loading ? (
        <div className="p-16 text-center text-sky-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
          <p className="text-sm font-mono text-slate-400">Mengambil daftar aset dari Turso & Cloudinary...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-12 text-center text-slate-400">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-600" />
          <p className="text-base font-medium text-slate-300">Belum ada aset media tersimpan</p>
          <p className="text-sm mt-1 max-w-sm mx-auto">
            Gunakan tombol &quot;Unggah Media Baru&quot; di atas untuk mengunggah gambar proyek atau avatar Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((asset) => (
            <div
              key={asset.id}
              className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl overflow-hidden group hover:border-blue-500/50 transition-all flex flex-col"
            >
              {/* Asset Preview */}
              <div className="h-40 bg-[#071426] relative flex items-center justify-center overflow-hidden border-b border-[#1E3A5F]/60">
                {asset.secure_url ? (
                  <img
                    src={asset.secure_url}
                    alt={asset.alt_text || 'Media'}
                    className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <FileText className="w-10 h-10 text-slate-600" />
                )}
                {asset.format && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold bg-[#071426]/90 text-sky-300 border border-sky-500/30">
                    {asset.format}
                  </span>
                )}
              </div>

              {/* Metadata Details */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div
                    className="text-xs font-mono text-slate-200 truncate font-semibold"
                    title={asset.public_id}
                  >
                    {asset.public_id}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between font-mono">
                    <span>{formatBytes(asset.bytes)}</span>
                    {asset.width && asset.height && (
                      <span>
                        {asset.width}x{asset.height}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-3 pt-2.5 border-t border-[#1E3A5F]/60 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyUrl(asset.secure_url, asset.id)}
                    className="flex-1 py-1.5 px-2 bg-[#071426] hover:bg-slate-800 text-sky-400 text-xs rounded border border-[#1E3A5F] flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin URL</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(asset.id, asset.public_id)}
                    disabled={deletingId === asset.id}
                    className="p-1.5 bg-[#071426] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs rounded border border-[#1E3A5F] transition-colors disabled:opacity-50"
                    title="Hapus Aset"
                  >
                    {deletingId === asset.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-400" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
