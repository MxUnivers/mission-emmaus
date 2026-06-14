import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';

export default function AdminTestimonials() {
  const { t } = useTranslation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', role: '', content: '', avatar: '', is_active: true });
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [reorderLoading, setReorderLoading] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [toggleLoading, setToggleLoading] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      setItems(data || []);
    } catch (e) {
      console.error('Error fetching testimonials:', e);
      setToast({ type: 'error', message: 'Erreur lors du chargement des témoignages.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % items.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [items.length]);

  useEffect(() => {
    setPreviewIndex(0);
  }, [items.map(i => i.sort_order).join(',')]);

  const openCreate = () => {
    setForm({ id: null, name: '', role: '', content: '', avatar: '', is_active: true });
    setModal(true);
  };

  const openEdit = (item) => {
    setForm({ id: item.id, name: item.name || '', role: item.role || '', content: item.content || '', avatar: item.avatar || '', is_active: item.is_active !== false });
    setModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { name: form.name, role: form.role, content: form.content, avatar: form.avatar || null, is_active: form.is_active };
      if (form.id) {
        const { error } = await supabase.from('testimonials').update(payload).eq('id', form.id);
        if (error) throw error;
        setToast({ type: 'success', message: 'Témoignage mis à jour.' });
      } else {
        const { error } = await supabase.from('testimonials').insert(payload);
        if (error) throw error;
        setToast({ type: 'success', message: 'Témoignage ajouté.' });
      }
      setModal(false);
      fetchItems();
    } catch (e) {
      setToast({ type: 'error', message: 'Erreur : ' + e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    setDeleteLoading(true);
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', message: 'Témoignage supprimé.' });
      fetchItems();
    } catch (e) {
      setToast({ type: 'error', message: 'Erreur lors de la suppression.' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleMove = async (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;

    setReorderLoading(true);
    try {
      const itemA = items[index];
      const itemB = items[newIndex];
      const tempOrder = itemA.sort_order;

      const { error: errorA } = await supabase
        .from('testimonials')
        .update({ sort_order: itemB.sort_order })
        .eq('id', itemA.id);
      if (errorA) throw errorA;

      const { error: errorB } = await supabase
        .from('testimonials')
        .update({ sort_order: tempOrder })
        .eq('id', itemB.id);
      if (errorB) throw errorB;

      setToast({ type: 'success', message: 'Ordre mis à jour.' });
      fetchItems();
    } catch (e) {
      setToast({ type: 'error', message: 'Erreur lors de la réorganisation.' });
    } finally {
      setReorderLoading(false);
    }
  };

  const handleToggleActive = async (id, currentValue) => {
    setToggleLoading(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .update({ is_active: !currentValue })
        .eq('id', id);
      if (error) throw error;
      setToast({ type: 'success', message: !currentValue ? 'Témoignage activé.' : 'Témoignage désactivé.' });
      fetchItems();
    } catch (e) {
      setToast({ type: 'error', message: 'Erreur lors du changement de statut.' });
    } finally {
      setToggleLoading(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
          {t('admin.testimonials')}
        </h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap"
          style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}
        >
          + {t('common.add')}
        </button>
      </div>

      {/* Preview Carousel */}
      {items.length > 0 && (
        <div className="mb-6 rounded-xl border p-5" style={{ backgroundColor: '#FAF8F5', borderColor: '#E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: siteSettings.colors.textLight }}>{t('common.carouselPreview')}</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPreviewIndex((prev) => (prev - 1 + items.length) % items.length)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white border hover:border-amber-300 transition-colors"
                style={{ borderColor: '#E5E7EB' }}
              >
                <i className="ri-arrow-left-s-line text-sm" style={{ color: siteSettings.colors.text }}></i>
              </button>
              <button
                onClick={() => setPreviewIndex((prev) => (prev + 1) % items.length)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white border hover:border-amber-300 transition-colors"
                style={{ borderColor: '#E5E7EB' }}
              >
                <i className="ri-arrow-right-s-line text-sm" style={{ color: siteSettings.colors.text }}></i>
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-xl bg-white border" style={{ borderColor: '#E5E7EB' }}>
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${previewIndex * 100}%)` }}
            >
              {items.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex-shrink-0 p-6 md:p-8 flex flex-col items-center text-center"
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden mb-3 border-2 border-amber-200">
                    <img
                      src={item.avatar || ''}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="w-6 h-6 flex items-center justify-center mb-3">
                    <i className="ri-double-quotes-l text-lg text-amber-300"></i>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4 max-w-lg italic">
                    &ldquo;{item.content}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                    <p className="text-amber-600 text-xs mt-0.5">{item.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-2 mt-3">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setPreviewIndex(index)}
                className={`h-2 rounded-full transition-all ${index === previewIndex ? 'bg-amber-500 w-5' : 'bg-gray-300 w-2'}`}
              ></button>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className={`mb-4 px-4 py-2 rounded-md text-sm ${toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
      ) : items.length === 0 ? (
        <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.none')}.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={item.id} className={`rounded-lg border p-4 ${item.is_active === false ? 'opacity-60' : ''}`} style={{ backgroundColor: 'white', borderColor: item.is_active === false ? '#E5E7EB' : '#E5E7EB' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white text-sm font-medium overflow-hidden" style={{ backgroundColor: siteSettings.colors.primary }}>
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    item.name?.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold" style={{ color: siteSettings.colors.text }}>{item.name}</p>
                        {item.is_active === false && (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-500">{t('common.inactive')}</span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: siteSettings.colors.textLight }}>{item.role}</p>
                    </div>
                    <div className="flex gap-1 flex-shrink-0 items-center">
                      <button onClick={() => handleToggleActive(item.id, item.is_active)} disabled={toggleLoading === item.id} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50" title={item.is_active === false ? 'Activer' : 'Désactiver'}>
                        <i className={item.is_active === false ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                      </button>
                      <button onClick={() => handleMove(index, 'up')} disabled={index === 0 || reorderLoading} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30">
                        <i className="ri-arrow-up-line"></i>
                      </button>
                      <button onClick={() => handleMove(index, 'down')} disabled={index === items.length - 1 || reorderLoading} className="w-8 h-8 flex items-center justify-center rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-30">
                        <i className="ri-arrow-down-line"></i>
                      </button>
                      <button onClick={() => openEdit(item)} className="w-8 h-8 flex items-center justify-center rounded-md text-amber-600 hover:bg-amber-50 transition-colors">
                        <i className="ri-edit-line"></i>
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={deleteLoading} className="w-8 h-8 flex items-center justify-center rounded-md text-red-500 hover:bg-red-50 transition-colors">
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed mt-2" style={{ color: siteSettings.colors.textLight }}>
                    {item.content.length > 180 ? item.content.slice(0, 180) + '...' : item.content}
                  </p>
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
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.name')}</label>
                <input type="text" placeholder={t('common.name')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.role')}</label>
                <input type="text" placeholder={t('common.role')} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.testimonial')}</label>
                <textarea placeholder={t('common.testimonial')} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required rows={4} maxLength={500} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 resize-none" style={{ borderColor: '#E5E7EB' }} />
                <p className="text-xs mt-1 text-right" style={{ color: siteSettings.colors.textLight }}>{form.content.length}/500</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>{t('common.avatarUrl')} ({t('common.optional')})</label>
                <input type="text" placeholder="https://..." value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                />
                <label htmlFor="is_active" className="text-sm" style={{ color: siteSettings.colors.text }}>{t('common.active')} ({t('common.visible')})</label>
              </div>
              <div className="flex gap-2 pt-1">
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