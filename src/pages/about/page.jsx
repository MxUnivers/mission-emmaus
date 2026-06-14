import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation.jsx';
import { siteSettings } from '../../config/settings';
import useActiveSection from '../../hooks/useActiveSection.jsx';

function About() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const sectionIds = ['histoire', 'vision', 'valeurs', 'pasteur', 'objectifs'];
  const activeSection = useActiveSection(sectionIds);

  const anchorLinks = [
    { id: 'histoire', label: t('about.history'), icon: 'ri-history-line' },
    { id: 'vision', label: t('about.vision'), icon: 'ri-eye-line' },
    { id: 'valeurs', label: t('about.values'), icon: 'ri-heart-3-line' },
    { id: 'pasteur', label: t('about.pastor'), icon: 'ri-user-star-line' },
    { id: 'objectifs', label: t('about.goals'), icon: 'ri-flag-line' },
  ];

  const handleAnchorClick = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navHeight;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNav = (path) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const values = [
    { icon: 'ri-heart-3-line', key: 'love' },
    { icon: 'ri-book-open-line', key: 'word' },
    { icon: 'ri-community-line', key: 'community' },
    { icon: 'ri-hand-heart-line', key: 'service' },
    { icon: 'ri-earth-line', key: 'mission' },
    { icon: 'ri-lightbulb-line', key: 'excellence' },
  ];

  const goals = t('about.goalsList');

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden">
        <img
          src="https://readdy.ai/api/search-image?query=Warm%20golden%20light%20streaming%20through%20stained%20glass%20windows%20in%20a%20modern%20church%20interior%2C%20people%20worshipping%20with%20raised%20hands%2C%20soft%20bokeh%2C%20spiritual%20atmosphere%2C%20amber%20and%20gold%20tones%2C%20wide%20angle%20shot%2C%20professional%20photography&width=1400&height=500&seq=about-hero-1&orientation=landscape"
          alt="About Emmaus"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/40"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: 'Playfair Display, serif' }}
          >
            {t('about.title')}
          </h1>
          <p className="text-white/80 text-sm md:text-base max-w-2xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>
      </section>

      {/* Anchor Navigation */}
      <div className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <nav className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-hide">
            {anchorLinks.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleAnchorClick(e, link.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  activeSection === link.id
                    ? 'bg-amber-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <i className={`${link.icon} text-sm`}></i>
                <span>{link.label}</span>
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* History */}
      <section id="histoire" className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
              <div className="w-full md:w-1/2">
                <img
                  src="https://readdy.ai/api/search-image?query=Historic%20church%20building%20exterior%20with%20warm%20sunset%20light%2C%20beautiful%20architecture%2C%20modern%20Christian%20church%20facade%2C%20golden%20hour%20lighting%2C%20amber%20tones%2C%20peaceful%20spiritual%20atmosphere%2C%20professional%20architectural%20photography&width=700&height=500&seq=about-history-1&orientation=landscape"
                  alt={t('about.history')}
                  className="w-full h-64 md:h-80 object-cover rounded-2xl"
                />
              </div>
              <div className="w-full md:w-1/2">
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('about.history')}
                </h2>
                <div className="w-16 h-1 bg-amber-500 rounded-full mb-6"></div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('about.historyText1')}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('about.historyText2')}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about.historyText3')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section id="vision" className="py-10 md:py-14 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {/* Vision */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                <i className="ri-eye-line text-amber-600 text-2xl"></i>
              </div>
              <h2
                className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('about.vision')}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {siteSettings.vision}
              </p>
            </div>
            {/* Mission */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#2D5F3F]/10 flex items-center justify-center mb-6">
                <i className="ri-flag-line text-[#2D5F3F] text-2xl"></i>
              </div>
              <h2
                className="text-xl md:text-2xl font-bold text-gray-900 mb-4"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('about.mission')}
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {siteSettings.mission}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section id="valeurs" className="py-10 md:py-14 bg-white">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-gray-900 mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('about.values')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-[#FAF8F5] rounded-xl p-5 md:p-6 border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mb-4">
                    <i className={`${value.icon} text-amber-600 text-xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                    {t(`about.valuesList.${value.key}.title`)}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed">
                    {t(`about.valuesList.${value.key}.desc`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pastor */}
      <section id="pasteur" className="py-10 md:py-14 bg-[#FAF8F5]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
              <div className="w-full md:w-2/5 flex-shrink-0">
                <img
                  src="https://readdy.ai/api/search-image?query=Portrait%20of%20a%20warm%20African%20male%20pastor%20in%20elegant%20suit%2C%20gentle%20smile%2C%20professional%20headshot%2C%20warm%20studio%20lighting%2C%20soft%20background%2C%20spiritual%20leader%2C%20confident%20and%20welcoming%20expression%2C%20high%20quality%20photography&width=500&height=600&seq=about-pastor-1&orientation=portrait"
                  alt={siteSettings.pastor.name}
                  className="w-full h-72 md:h-96 object-cover rounded-2xl"
                />
              </div>
              <div className="w-full md:w-3/5">
                <h2
                  className="text-2xl md:text-3xl font-bold text-gray-900 mb-4"
                  style={{ fontFamily: 'Playfair Display, serif' }}
                >
                  {t('about.pastor')}
                </h2>
                <div className="w-16 h-1 bg-amber-500 rounded-full mb-6"></div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {siteSettings.pastor.name}
                </h3>
                <p className="text-amber-600 text-sm font-medium mb-4">
                  {siteSettings.pastor.title}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('about.pastorBio1')}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {t('about.pastorBio2')}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {t('about.pastorBio3')}
                </p>
                <div className="mt-6 flex gap-3">
                  <a
                    href={siteSettings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500 hover:text-white text-amber-600 transition-colors"
                  >
                    <i className="ri-facebook-fill text-sm"></i>
                  </a>
                  <a
                    href={siteSettings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500 hover:text-white text-amber-600 transition-colors"
                  >
                    <i className="ri-instagram-line text-sm"></i>
                  </a>
                  <a
                    href={siteSettings.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center hover:bg-amber-500 hover:text-white text-amber-600 transition-colors"
                  >
                    <i className="ri-youtube-fill text-sm"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section id="objectifs" className="py-10 md:py-14 bg-[#2D5F3F]">
        <div className="w-full px-4 md:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('about.goals')}
              </h2>
              <div className="w-16 h-1 bg-amber-500 rounded-full mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-5 md:p-6 border border-white/20"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed">
                    {goal}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <button
                onClick={() => handleNav('/contact')}
                className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-medium transition-all transform hover:scale-105 whitespace-nowrap"
              >
                {t('about.joinMission')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;