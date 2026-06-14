import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';
import Toast from '../../../components/base/Toast';
import { useToast } from '../../../hooks/useToast';

export default function AdminVideos() {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', video_url: '', description: '', category: '', date: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error('Error fetching videos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setForm({ id: null, title: '', video_url: '', description: '', category: '', date: '' });
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ ...item });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form };
      delete payload.id;
      if (form.id) {
        const { error } = await supabase.from('videos').update(payload).eq('id', form.id);
        if (error) throw error;
        showToast('success', 'Vidéo mise à jour.');
      } else {
        const { error } = await supabase.from('videos').insert(payload);
        if (error) throw error;
        showToast('success', 'Vidéo ajoutée.');
      }
      setModal(false);
      fetchItems();
    } catch (e) {
      showToast('error', 'Erreur : ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette vidéo ?')) return;
    try {
      const { error } = await supabase.from('videos').delete().eq('id', id);
      if (error) throw error;
      showToast('success', 'Vidéo supprimée.');
      fetchItems();
    } catch (e) {
      showToast('error', 'Erreur lors de la suppression.');
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
          {t('admin.videos')}
        </h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap"
          style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}
        >
          + {t('common.add')}
        </button>
      </div>

      {loading ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
      ) : items.length === 0 ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.none')}.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-lg border p-4" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold mb-1" style={{ color: siteSettings.colors.text }}>{item.title}</p>
                  <p className="text-xs mb-1" style={{ color: siteSettings.colors.textLight }}>{item.category} · {item.date}</p>
                  <p className="text-sm truncate" style={{ color: siteSettings.colors.textLight }}>{item.video_url}</p>
                  <p className="text-sm mt-1" style={{ color: siteSettings.colors.textLight }}>{item.description}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md text-amber-600 hover:bg-amber-50 transition-colors">
                    <i className="ri-edit-line"></i>
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors">
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-lg rounded-lg p-6 max-h-[90vh] overflow-auto" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: siteSettings.colors.text }}>{form.id ? t('common.edit') : t('common.add')}</h3>
              <button onClick={() => setModal(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder={t('common.title')} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              <input type="text" placeholder={t('common.videoUrl')} value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder={t('common.category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              </div>
              <textarea placeholder={t('common.description')} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 resize-none" style={{ borderColor: '#E5E7EB' }} />
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap" style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}>
                  {submitting ? t('common.loading') : t('common.save')}
                </button>
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded-md text-sm border whitespace-nowrap" style={{ borderColor: '#E5E7EB', color: siteSettings.colors.textLight }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}