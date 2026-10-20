import React, { useEffect, useState, useCallback } from 'react';
import { adminService } from '../../services/admin.service';
import {
  Trash2,
  CheckCircle,
  Archive,
  Loader2,
  AlertCircle,
  Clock,
  Inbox,
} from 'lucide-react';

export function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [notification, setNotification] = useState({ type: '', message: '' });

  const showNotice = useCallback((type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification({ type: '', message: '' }), 4000);
  }, []);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await adminService.getMessages();
      setMessages(data);
    } catch (err) {
      showNotice('error', err.message || 'Gagal memuat pesan');
    } finally {
      setLoading(false);
    }
  }, [showNotice]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminService.updateMessageStatus(id, status);
      showNotice('success', `Status pesan diperbarui ke ${status}`);
      fetchMessages();
    } catch (err) {
      showNotice('error', err.message || 'Gagal memperbarui status');
    }
  };

  const handleDelete = async (id, sender) => {
    if (!window.confirm(`Hapus pesan dari "${sender}"?`)) return;

    setDeletingId(id);
    try {
      await adminService.deleteMessage(id);
      showNotice('success', 'Pesan berhasil dihapus');
      fetchMessages();
    } catch (err) {
      showNotice('error', err.message || 'Gagal menghapus pesan');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (activeFilter === 'all') return true;
    return m.status === activeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Pesan & Kontak Masuk</h1>
          <p className="text-sm text-slate-400 mt-1">
            Daftar pesan terenkripsi yang dikirim pengunjung melalui formulir kontak portofolio.
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

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {['all', 'unread', 'read', 'archived'].map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
              activeFilter === status
                ? 'bg-blue-600 text-white'
                : 'bg-[#0B1F3A] text-slate-400 hover:text-white border border-[#1E3A5F]'
            }`}
          >
            {status === 'all' ? 'Semua Pesan' : status}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-16 text-center text-sky-400 bg-[#0B1F3A] border border-[#1E3A5F] rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-mono text-slate-400">Memuat pesan dari Turso DB...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-[#0B1F3A] border border-[#1E3A5F] rounded-2xl p-12 text-center text-slate-400">
            <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-600" />
            <p className="text-base font-medium text-slate-300">Tidak ada pesan</p>
            <p className="text-sm mt-1">Pesan dari pengunjung portofolio akan muncul di sini.</p>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`p-5 bg-[#0B1F3A] border rounded-xl transition-all ${
                msg.status === 'unread'
                  ? 'border-sky-500/50 bg-[#0B1F3A]/90 shadow-md shadow-sky-500/5'
                  : 'border-[#1E3A5F] opacity-90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-[#1E3A5F]/60">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-sky-400 text-xs font-bold">
                    {msg.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-100 text-sm">{msg.name}</span>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-xs text-sky-400 hover:underline ml-2 font-mono"
                    >
                      {msg.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(msg.created_at).toLocaleString('id-ID')}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] uppercase font-bold font-mono ${
                      msg.status === 'unread'
                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                        : msg.status === 'read'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="py-4 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
                {msg.message}
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#1E3A5F]/60 flex items-center justify-end gap-2">
                {msg.status === 'unread' ? (
                  <button
                    onClick={() => handleUpdateStatus(msg.id, 'read')}
                    className="px-3 py-1.5 bg-[#071426] hover:bg-slate-800 text-xs text-emerald-400 border border-[#1E3A5F] rounded-lg transition-colors"
                  >
                    Tandai Sudah Dibaca
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(msg.id, 'unread')}
                    className="px-3 py-1.5 bg-[#071426] hover:bg-slate-800 text-xs text-slate-400 border border-[#1E3A5F] rounded-lg transition-colors"
                  >
                    Tandai Belum Dibaca
                  </button>
                )}

                <button
                  onClick={() => handleUpdateStatus(msg.id, 'archived')}
                  className="px-3 py-1.5 bg-[#071426] hover:bg-slate-800 text-xs text-slate-400 border border-[#1E3A5F] rounded-lg transition-colors flex items-center gap-1"
                >
                  <Archive className="w-3 h-3" />
                  <span>Arsipkan</span>
                </button>

                <button
                  onClick={() => handleDelete(msg.id, msg.name)}
                  disabled={deletingId === msg.id}
                  className="p-1.5 text-slate-500 hover:text-rose-400 rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                  title="Hapus Pesan"
                >
                  {deletingId === msg.id ? (
                    <Loader2 className="w-4 h-4 animate-spin text-rose-400" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
