import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { useSupabaseData } from '../../hooks/useSupabaseData.jsx';
import { mapCommunity } from '../../lib/mapDbData';
import { mockCommunities } from '../../mocks/data.js';

function Communities() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: dbCommunities } = useSupabaseData('communities', { orderBy: 'name', ascending: true });
  const communities = dbCommunities.length > 0 ? dbCommunities.map(mapCommunity) : mockCommunities;

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Diverse%20group%20of%20people%20in%20a%20modern%20church%20community%20gathering%2C%20warm%20golden%20lighting%2C%20smiling%20faces%2C%20fellowship%20and%20friendship%2C%20casual%20elegant%20attire%2C%20amber%20and%20warm%20tones%2C%20professional%20photography%2C%20shallow%20depth%20of%20field&width=1400&height=500&seq=communities-hero-1&orientation=landscape"
          alt="Communautés"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('sections.communities')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('communities.subtitle')}
          </p>
        </div>
      </section>

      {/* Intro */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">
              {t('communities.intro')}
            </p>
          </div>
        </div>
      </section>

      {/* Communities Grid */}
      <section className="py-10 md:py-14 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={community.image}
                      alt={community.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="font-semibold text-gray-900 mb-2 text-base">
                      {community.name}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-4">
                      {community.description}
                    </p>
                    <div className="space-y-2 border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <i className="ri-user-line text-amber-500"></i>
                        <span>{t('common.leader')}: <strong>{community.leader}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-xs">
                        <i className="ri-calendar-line text-amber-500"></i>
                        <span>{community.day} • {community.time}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNav('/contact')}
                      className="mt-4 w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      {t('common.join')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 md:py-16 bg-[#2D5F3F]">
        <div className="w-full px-4 md:px-6 lg:px-8 text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('communities.notFound')}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8">
            {t('communities.notFoundDesc')}
          </p>
          <button
            onClick={() => handleNav('/contact')}
            className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all transform hover:scale-105 whitespace-nowrap"
          >
            {t('common.contactUs')}
          </button>
        </div>
      </section>
    </div>
  );
}

export default Communities;