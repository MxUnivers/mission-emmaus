import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useTranslation } from '../../../hooks/useTranslation';
import { siteSettings } from '../../../config/settings';
import Toast from '../../../components/base/Toast';
import { useToast } from '../../../hooks/useToast';

export default function AdminGallery() {
  const { t } = useTranslation();
  const { toast, showToast } = useToast();
  const [folders, setFolders] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [folderModal, setFolderModal] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [folderForm, setFolderForm] = useState({ id: null, name: '', cover_image: '', description: '' });
  const [imageUrl, setImageUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('gallery_folders').select('*').order('name', { ascending: true });
      if (error) throw error;
      setFolders(data || []);
    } catch (e) {
      console.error('Error fetching folders:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchImages = async (folderId) => {
    try {
      const { data, error } = await supabase.from('gallery_images').select('*').eq('folder_id', folderId).order('created_at', { ascending: false });
      if (error) throw error;
      setImages(data || []);
    } catch (e) {
      console.error('Error fetching images:', e);
    }
  };

  useEffect(() => {
    fetchFolders();
  }, []);

  useEffect(() => {
    if (selectedFolder) {
      fetchImages(selectedFolder.id);
    } else {
      setImages([]);
    }
  }, [selectedFolder]);

  const handleFolderSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...folderForm };
      delete payload.id;
      if (folderForm.id) {
        const { error } = await supabase.from('gallery_folders').update(payload).eq('id', folderForm.id);
        if (error) throw error;
        showToast('success', t('common.edit') + ' .');
      } else {
        const { error } = await supabase.from('gallery_folders').insert(payload);
        if (error) throw error;
        showToast('success', t('common.add') + ' .');
      }
      setFolderModal(false);
      fetchFolders();
    } catch (e) {
      showToast('error', t('common.error') + ' : ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFolder = async (id) => {
    if (!confirm(t('common.delete') + ' ?')) return;
    try {
      const { error } = await supabase.from('gallery_folders').delete().eq('id', id);
      if (error) throw error;
      showToast('success', t('common.delete') + ' .');
      fetchFolders();
      if (selectedFolder?.id === id) setSelectedFolder(null);
    } catch (e) {
      showToast('error', t('common.error'));
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!imageUrl.trim() || !selectedFolder) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('gallery_images').insert({ folder_id: selectedFolder.id, image_url: imageUrl });
      if (error) throw error;
      showToast('success', t('common.add') + ' .');
      setImageUrl('');
      setImageModal(false);
      fetchImages(selectedFolder.id);
    } catch (e) {
      showToast('error', t('common.error') + ' : ' + e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm(t('common.delete') + ' ?')) return;
    try {
      const { error } = await supabase.from('gallery_images').delete().eq('id', id);
      if (error) throw error;
      showToast('success', t('common.delete') + ' .');
      fetchImages(selectedFolder.id);
    } catch (e) {
      showToast('error', t('common.error'));
    }
  };

  return (
    <div>
      <Toast toast={toast} />
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
          {t('admin.gallery')}
        </h1>
        <div className="flex gap-2">
          {selectedFolder && (
            <button
              onClick={() => setImageModal(true)}
              className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap"
              style={{ backgroundColor: siteSettings.colors.secondary, cursor: 'pointer' }}
            >
              + {t('common.add')}
            </button>
          )}
          <button
            onClick={() => { setFolderForm({ id: null, name: '', cover_image: '', description: '' }); setFolderModal(true); }}
            className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap"
            style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}
          >
            + {t('common.add')}
          </button>
        </div>
      </div>

      {selectedFolder ? (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedFolder(null)}
              className="text-sm underline"
              style={{ color: siteSettings.colors.primary }}
            >
              ← {t('common.back')}
            </button>
            <span className="text-sm font-medium" style={{ color: siteSettings.colors.text }}>{selectedFolder.name}</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((img) => (
              <div key={img.id} className="relative group rounded-lg overflow-hidden aspect-square border" style={{ borderColor: '#E5E7EB' }}>
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDeleteImage(img.id)}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-md bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i className="ri-delete-bin-line text-sm"></i>
                </button>
              </div>
            ))}
            {images.length === 0 && (
              <p className="text-sm col-span-full" style={{ color: siteSettings.colors.textLight }}>{t('common.none')}.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          {loading ? (
            <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
          ) : folders.length === 0 ? (
            <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.none')}.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="rounded-lg border overflow-hidden cursor-pointer transition-colors hover:border-amber-300"
                  style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}
                  onClick={() => setSelectedFolder(folder)}
                >
                  <div className="aspect-video relative">
                    <img src={folder.cover_image || 'https://via.placeholder.com/400x225?text=No+Image'} alt={folder.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setFolderForm({ ...folder });
                          setFolderModal(true);
                        }}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white/90 text-amber-600 hover:bg-white transition-colors"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteFolder(folder.id); }}
                        className="w-7 h-7 flex items-center justify-center rounded-md bg-white/90 text-red-500 hover:bg-white transition-colors"
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold" style={{ color: siteSettings.colors.text }}>{folder.name}</p>
                    <p className="text-xs mt-1" style={{ color: siteSettings.colors.textLight }}>{folder.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {folderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-lg p-6" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: siteSettings.colors.text }}>{folderForm.id ? t('common.edit') : t('common.add')}</h3>
              <button onClick={() => setFolderModal(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleFolderSubmit} className="space-y-3">
              <input type="text" placeholder={t('common.folder') + ' ' + t('common.name')} value={folderForm.name} onChange={(e) => setFolderForm({ ...folderForm, name: e.target.value })} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              <input type="text" placeholder={t('common.coverImage') + ' URL'} value={folderForm.cover_image} onChange={(e) => setFolderForm({ ...folderForm, cover_image: e.target.value })} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              <textarea placeholder={t('common.description')} value={folderForm.description} onChange={(e) => setFolderForm({ ...folderForm, description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 resize-none" style={{ borderColor: '#E5E7EB' }} />
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap" style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}>
                  {submitting ? t('common.loading') : t('common.save')}
                </button>
                <button type="button" onClick={() => setFolderModal(false)} className="px-4 py-2 rounded-md text-sm border whitespace-nowrap" style={{ borderColor: '#E5E7EB', color: siteSettings.colors.textLight }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {imageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="w-full max-w-md rounded-lg p-6" style={{ backgroundColor: 'white' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: siteSettings.colors.text }}>{t('common.add')}</h3>
              <button onClick={() => setImageModal(false)} className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors">
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            <form onSubmit={handleAddImage} className="space-y-3">
              <input type="text" placeholder={t('common.image') + ' URL'} value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full px-3 py-2 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200" style={{ borderColor: '#E5E7EB' }} />
              <div className="flex gap-2">
                <button type="submit" disabled={submitting} className="px-4 py-2 rounded-md text-white text-sm font-medium whitespace-nowrap" style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}>
                  {submitting ? t('common.loading') : t('common.add')}
                </button>
                <button type="button" onClick={() => setImageModal(false)} className="px-4 py-2 rounded-md text-sm border whitespace-nowrap" style={{ borderColor: '#E5E7EB', color: siteSettings.colors.textLight }}>{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}