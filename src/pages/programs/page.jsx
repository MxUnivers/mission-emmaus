import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { useSupabaseData } from '../../hooks/useSupabaseData.jsx';
import { mapProgram } from '../../lib/mapDbData';
import { mockPrograms } from '../../mocks/data.js';

function Programs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: dbPrograms } = useSupabaseData('programs', { orderBy: 'day', ascending: true });
  const programs = dbPrograms.length > 0 ? dbPrograms.map(mapProgram) : mockPrograms;

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      culte: 'ri-building-line',
      etude: 'ri-book-open-line',
      priere: 'ri-hand-heart-line',
      chorale: 'ri-music-2-line',
      evangelisation: 'ri-earth-line',
    };
    return icons[category] || 'ri-calendar-event-line';
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Modern%20church%20interior%20with%20warm%20lighting%2C%20worship%20service%20atmosphere%2C%20people%20sitting%20in%20elegant%20pews%2C%20golden%20ambient%20light%2C%20spiritual%20and%20peaceful%20mood%2C%20amber%20tones%2C%20professional%20photography%20wide%20angle&width=1400&height=500&seq=programs-hero-1&orientation=landscape"
          alt="Programmes"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('sections.programs')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('programs.subtitle')}
          </p>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {programs.map((program) => (
                <div
                  key={program.id}
                  className="group bg-white rounded-xl border border-gray-100 p-6 md:p-8 hover:shadow-lg transition-all hover:border-amber-200"
                >
                  <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-5 group-hover:bg-amber-100 transition-colors">
                    <i className={`${getCategoryIcon(program.category)} text-amber-600 text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-base">
                    {program.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-5">
                    {program.description}
                  </p>
                  <div className="space-y-3 border-t border-gray-100 pt-4">
                    <div className="flex items-center gap-3 text-gray-600 text-xs">
                      <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center flex-shrink-0">
                        <i className="ri-calendar-line text-[#2D5F3F]"></i>
                      </div>
                      <span>{program.day}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-xs">
                      <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center flex-shrink-0">
                        <i className="ri-time-line text-[#2D5F3F]"></i>
                      </div>
                      <span>{program.startTime} - {program.endTime}</span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600 text-xs">
                      <div className="w-8 h-8 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center flex-shrink-0">
                        <i className="ri-map-pin-line text-[#2D5F3F]"></i>
                      </div>
                      <span>{program.location}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule */}
      <section className="py-10 md:py-14 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('common.weeklySchedule')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto"></div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 divide-y divide-gray-100">
                {programs.map((program) => (
                  <div key={program.id} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 md:p-6 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                      <i className={`${getCategoryIcon(program.category)} text-amber-600 text-xl`}></i>
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {program.title}
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {program.description}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-3">
                      <span className="px-3 py-1.5 bg-[#2D5F3F]/10 text-[#2D5F3F] rounded-full text-xs font-medium">
                        {program.day}
                      </span>
                      <span className="px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-medium">
                        {program.startTime} - {program.endTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
            {t('programs.ctaTitle')}
          </h2>
          <p className="text-white/80 text-sm md:text-base max-w-xl mx-auto mb-8">
            {t('programs.ctaSubtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleNav('/contact')}
              className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all transform hover:scale-105 whitespace-nowrap"
            >
              {t('common.contactUs')}
            </button>
            <button
              onClick={() => handleNav('/events')}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white rounded-full font-medium transition-all border border-white/30 whitespace-nowrap"
            >
              {t('common.seeEvents')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Programs;