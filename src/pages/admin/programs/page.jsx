import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';
import Toast from '../../../components/base/Toast';
import { useToast } from '../../../hooks/useToast';

export default function AdminPrograms() {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id: null, title: '', day: '', start_time: '', end_time: '', location: '', description: '', category: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('programs').select('*').order('day', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error('Error fetching programs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreate = () => {
    setForm({ id: null, title: '', day: '', start_time: '', end_time: '', location: '', description: '', category: '' });
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
        const { error } = await supabase.from('programs').update(payload).eq('id', form.id);
        if (error) throw error;
        showToast('success', 'Programme mis à jour.');
      } else {
        const { error } = await supabase.from('programs').insert(payload);
        if (error) throw error;
        showToast('success', 'Programme ajouté.');
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
    if (!confirm('Supprimer ce programme ?')) return;
    try {
      const { error } = await supabase.from('programs').delete().eq('id', id);
      if (error) throw error;
      showToast('success', 'Programme supprimé.');
      fetchItems();
    } catch (e) {
      showToast('error', 'Erreur lors de la suppression.');
    }
  };

  const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
          {t('admin.programs')}
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
                  <p className="text-xs mb-1" style={{ color: siteSettings.colors.textLight }}>
                    {item.day} · {item.start_time} - {item.end_time} · {item.location}
                  </p>
                  <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{item.description}</p>
                  {item.category && <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">{item.category}</span>}
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
              <select value={form.day} onChange={(e) => setForm({ ...form, day: e.target.value })} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 bg-white" style={{ borderColor: '#E5E7EB' }}>
                <option value="">{t('common.choose') + ' ' + t('common.day')}</option>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
                <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              </div>
              <input type="text" placeholder={t('common.location')} value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              <input type="text" placeholder={t('common.category')} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
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