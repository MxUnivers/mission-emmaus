import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { useSupabaseData } from '../../hooks/useSupabaseData.jsx';
import { mapGalleryFolder } from '../../lib/mapDbData';
import { mockGalleryFolders } from '../../mocks/data.js';

function Gallery() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: dbFolders } = useSupabaseData('gallery_folders', { orderBy: 'name', ascending: true });
  const folders = dbFolders.length > 0 ? dbFolders.map(mapGalleryFolder) : mockGalleryFolders;

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Beautiful%20church%20photo%20gallery%20wall%2C%20warm%20gallery%20lighting%2C%20framed%20photos%20of%20Christian%20events%2C%20modern%20exhibition%20space%2C%20amber%20and%20gold%20tones%2C%20professional%20interior%20photography%2C%20elegant%20gallery%20atmosphere&width=1400&height=500&seq=gallery-hero-1&orientation=landscape"
          alt="Galerie"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('sections.gallery')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>
      </section>

      {/* Folders Grid */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {folders.map((folder) => (
                <div
                  key={folder.id}
                  className="group relative rounded-xl overflow-hidden cursor-pointer aspect-[4/3]"
                  onClick={() => handleNav(`/gallery/${folder.id}`)}
                >
                  <img
                    src={folder.coverImage}
                    alt={folder.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <h3 className="font-semibold text-white text-lg mb-1">
                      {folder.name}
                    </h3>
                    <p className="text-white/80 text-xs mb-2">
                      {folder.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <i className="ri-image-line text-amber-400 text-sm"></i>
                      <span className="text-white/80 text-xs">
                        {folder.photoCount} {t('common.photos')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="ri-arrow-right-line text-white"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Gallery;