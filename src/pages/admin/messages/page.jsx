import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';
import Toast from '../../../components/base/Toast';
import { useToast } from '../../../hooks/useToast';

export default function AdminMessages() {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');
  const [replying, setReplying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchMessages = async () => {
    setLoading(true);
    try {
      let query = supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      const { data, error } = await query;
      if (error) throw error;
      setMessages(data || []);
    } catch (e) {
      console.error('Error fetching messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplying(true);
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ admin_reply: reply, status: 'replied' })
        .eq('id', selected.id);
      if (error) throw error;
      showToast('success', 'Réponse envoyée.');
      setReply('');
      setSelected(null);
      fetchMessages();
    } catch (e) {
      showToast('error', 'Erreur lors de l\'envoi de la réponse.');
    } finally {
      setReplying(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce message ?')) return;
    setDeleting(true);
    try {
      const { error } = await supabase.from('contact_messages').delete().eq('id', id);
      if (error) throw error;
      showToast('success', 'Message supprimé.');
      fetchMessages();
      if (selected?.id === id) setSelected(null);
    } catch (e) {
      showToast('error', 'Erreur lors de la suppression.');
    } finally {
      setDeleting(false);
    }
  };

  const statusBadge = (status) => {
    const colors = {
      new: 'bg-amber-100 text-amber-700',
      replied: 'bg-green-100 text-green-700',
      archived: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      new: t('common.new'),
      replied: t('common.replied'),
      archived: t('common.archived'),
    };
    return (
      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || colors.new}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div>
      <Toast toast={toast} />
      <h1 className="text-xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
        {t('admin.messages')}
      </h1>

      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'new', 'replied', 'archived'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
              statusFilter === s ? 'text-white' : 'bg-gray-100 text-gray-600'
            }`}
            style={statusFilter === s ? { backgroundColor: siteSettings.colors.primary } : {}}
          >
            {s === 'all' ? t('common.all') : t('common.' + s)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
      ) : messages.length === 0 ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.none')}.</p>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded-lg border p-4 cursor-pointer transition-colors hover:border-amber-300"
              style={{ backgroundColor: 'white', borderColor: selected?.id === msg.id ? siteSettings.colors.primary : '#E5E7EB' }}
              onClick={() => { setSelected(msg); setReply(msg.admin_reply || ''); }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold" style={{ color: siteSettings.colors.text }}>{msg.name}</span>
                    {statusBadge(msg.status)}
                  </div>
                  <p className="text-xs mb-1" style={{ color: siteSettings.colors.textLight }}>{msg.email} {msg.phone && `· ${msg.phone}`}</p>
                  <p className="text-xs font-medium mb-1" style={{ color: siteSettings.colors.text }}>{msg.subject}</p>
                  <p className="text-sm leading-relaxed" style={{ color: siteSettings.colors.textLight }}>{msg.message}</p>
                  {msg.admin_reply && (
                    <div className="mt-2 p-2 rounded-md bg-green-50 text-xs text-green-700">
                      <strong>{t('common.reply')} :</strong> {msg.admin_reply}
                    </div>
                  )}
                  <p className="text-xs mt-2" style={{ color: '#9CA3AF' }}>
                    {new Date(msg.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(msg.id); }}
                  disabled={deleting}
                  className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                >
                  <i className="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg rounded-lg p-6 max-h-[90vh] overflow-auto" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: siteSettings.colors.text }}>{t('common.message')} {selected.name}</h3>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>

            <div className="mb-4 p-3 rounded-md" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
              <p className="text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{selected.subject}</p>
              <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{selected.message}</p>
            </div>

            {selected.admin_reply && (
              <div className="mb-4 p-3 rounded-md bg-green-50">
                <p className="text-xs font-medium text-green-700 mb-1">{t('common.reply')} :</p>
                <p className="text-sm text-green-700">{selected.admin_reply}</p>
              </div>
            )}

            <form onSubmit={handleReply} className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.reply')}</label>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 resize-none"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder={t('common.reply') + '...'}
                />
                <p className="text-xs mt-1 text-right" style={{ color: siteSettings.colors.textLight }}>{reply.length}/500</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={replying || !reply.trim()}
                  className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap"
                  style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}
                >
                  {replying ? t('common.loading') : t('common.send')}
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="px-4 py-2 rounded-md text-sm border whitespace-nowrap"
                  style={{ borderColor: '#E5E7EB', color: siteSettings.colors.textLight }}
                >
                  {t('common.close')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}