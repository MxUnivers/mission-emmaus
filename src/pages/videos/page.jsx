import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { useSupabaseData } from '../../hooks/useSupabaseData.jsx';
import { mapVideo } from '../../lib/mapDbData';
import { mockVideos } from '../../mocks/data.js';

function Videos() {
  const { t, locale } = useTranslation();
  const navigate = useNavigate();
  const [activeVideo, setActiveVideo] = useState(null);
  const { data: dbVideos } = useSupabaseData('videos', { orderBy: 'created_at', ascending: false });
  const videos = dbVideos.length > 0 ? dbVideos.map(mapVideo) : mockVideos;

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = url.split('v=')[1];
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Modern%20church%20video%20recording%20studio%2C%20professional%20camera%20setup%2C%20warm%20ambient%20lighting%2C%20Christian%20worship%20video%20production%2C%20amber%20and%20gold%20tones%2C%20professional%20photography%2C%20media%20ministry%20atmosphere&width=1400&height=500&seq=videos-hero-1&orientation=landscape"
          alt="Vidéos"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('sections.videos')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('videos.subtitle')}
          </p>
        </div>
      </section>

      {/* Featured Video Player */}
      {activeVideo && (
        <section className="py-8 bg-[#1A1A2E]">
          <div className="w-full px-4 md:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-semibold text-sm">
                  {activeVideo.title}
                </h3>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="text-white/60 hover:text-white text-sm"
                >
                  <i className="ri-close-line text-lg"></i>
                </button>
              </div>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(activeVideo.videoUrl)}
                  title={activeVideo.title}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="text-white/60 text-xs mt-3">
                {activeVideo.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Videos Grid */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div
                    className="relative h-48 bg-gray-100 flex items-center justify-center cursor-pointer overflow-hidden"
                    onClick={() => setActiveVideo(video)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${video.videoUrl.split('v=')[1]}/mqdefault.jpg`}
                      alt={video.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                    <div className="w-14 h-14 rounded-full bg-amber-500/90 flex items-center justify-center group-hover:scale-110 transition-transform relative z-10">
                      <i className="ri-play-fill text-white text-2xl"></i>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                      {video.category}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 text-sm md:text-base">
                      {video.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mb-3">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-400 text-xs">
                        <i className="ri-calendar-line"></i>
                        <span>{formatDate(video.date)}</span>
                      </div>
                      <button
                        onClick={() => setActiveVideo(video)}
                        className="text-amber-600 text-xs font-medium flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        {t('common.watch')}
                        <i className="ri-play-circle-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('videos.subscribeTitle')}
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-xl mx-auto mb-8">
            {t('videos.subscribeDesc')}
          </p>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-full font-medium transition-all transform hover:scale-105 whitespace-nowrap"
          >
            <i className="ri-youtube-fill text-xl"></i>
            YouTube
          </a>
        </div>
      </section>
    </div>
  );
}

export default Videos;