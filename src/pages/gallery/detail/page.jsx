import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from '../../../hooks/useTranslation.jsx';
import { supabase } from '../../../lib/supabase';
import { mapGalleryFolder } from '../../../lib/mapDbData';
import { mockGalleryFolders } from '../../../mocks/data.js';

function GalleryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [previewImage, setPreviewImage] = useState(null);
  const [folder, setFolder] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data: folderData, error: folderError } = await supabase
          .from('gallery_folders')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        if (folderError) throw folderError;
        if (folderData) {
          setFolder(mapGalleryFolder(folderData));
        } else {
          const mockFolder = mockGalleryFolders.find((f) => f.id === id);
          setFolder(mockFolder || null);
        }

        const { data: imagesData, error: imagesError } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('folder_id', id)
          .order('created_at', { ascending: false });
        if (imagesError) throw imagesError;
        setImages(imagesData?.map((img) => img.image_url) || []);
      } catch (e) {
        const mockFolder = mockGalleryFolders.find((f) => f.id === id);
        setFolder(mockFolder || null);
        setImages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-500 text-sm">{t('common.loading')}</p>
      </div>
    );
  }

  if (!folder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('gallery.folderNotFound')}</h2>
          <button
            onClick={() => navigate('/gallery')}
            className="mt-4 px-6 py-3 bg-amber-500 text-white rounded-full font-medium"
          >
            {t('gallery.backToGallery')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-white pt-6 pb-4 border-b border-gray-100">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <button
            onClick={() => navigate('/gallery')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            {t('gallery.backToGallery')}
          </button>
          <h1
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {folder.name}
          </h1>
          <p className="text-gray-500 text-sm">
            {folder.description} • {images.length} {t('common.photos')}
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-8 md:py-12 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                  onClick={() => setPreviewImage(img)}
                >
                  <img
                    src={img}
                    alt={`${folder.name} ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <i className="ri-zoom-in-line text-white text-2xl opacity-0 group-hover:opacity-100 transition-opacity"></i>
                  </div>
                </div>
              ))}
            </div>
            {images.length === 0 && (
              <div className="text-center py-16">
                <i className="ri-image-line text-4xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-sm">{t('common.noPhotos')}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            onClick={() => setPreviewImage(null)}
          >
            <i className="ri-close-line"></i>
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default GalleryDetail;