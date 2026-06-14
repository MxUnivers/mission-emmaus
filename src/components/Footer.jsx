import { siteSettings } from '../config/settings';
import { useTranslation } from '../hooks/useTranslation';

export default function Footer() {
  const { t, lang, changeLang } = useTranslation();

  const languages = [
    { code: 'fr', flag: '🇫🇷' },
    { code: 'en', flag: '🇬🇧' },
    { code: 'de', flag: '🇩🇪' },
    { code: 'zh', flag: '🇨🇳' },
    { code: 'es', flag: '🇪🇸' },
    { code: 'it', flag: '🇮🇹' },
    { code: 'pt', flag: '🇵🇹' },
  ];

  const quickLinks = [
    { label: t('nav.home'), path: '/' },
    { label: t('nav.about'), path: '/about' },
    { label: t('nav.programs'), path: '/programs' },
    { label: t('nav.events'), path: '/events' },
    { label: t('nav.contact'), path: '/contact' },
  ];

  const handleNav = (path) => {
    window.REACT_APP_NAVIGATE(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1A1A2E] text-white">
      <div className="w-full px-4 md:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={siteSettings.logo}
                alt={siteSettings.logoAlt}
                className="h-10 w-10 object-contain rounded-full"
              />
              <span
                className="font-bold text-xl"
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {siteSettings.siteName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {t('footer.aboutText')}
            </p>
            <div className="flex gap-3">
              {siteSettings.social.facebook && (
                <a
                  href={siteSettings.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <i className="ri-facebook-fill text-sm"></i>
                </a>
              )}
              {siteSettings.social.instagram && (
                <a
                  href={siteSettings.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <i className="ri-instagram-line text-sm"></i>
                </a>
              )}
              {siteSettings.social.youtube && (
                <a
                  href={siteSettings.social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <i className="ri-youtube-fill text-sm"></i>
                </a>
              )}
              {siteSettings.social.twitter && (
                <a
                  href={siteSettings.social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-amber-500 transition-colors"
                >
                  <i className="ri-twitter-x-line text-sm"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {t('common.quickLinks')}
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => handleNav(link.path)}
                    className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {t('footer.serviceTimes')}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {t('footer.sunday')}
                </span>
                <span className="text-amber-400 text-sm font-medium">
                  {siteSettings.serviceTimes.sunday}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">
                  {t('footer.wednesday')}
                </span>
                <span className="text-amber-400 text-sm font-medium">
                  {siteSettings.serviceTimes.wednesday}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-amber-400 text-sm font-medium italic">
                {siteSettings.footer.slogan}
              </p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">
              {t('footer.contact')}
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <i className="ri-map-pin-line text-amber-400 mt-0.5"></i>
                <span className="text-gray-400 text-sm">
                  {siteSettings.address}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-phone-line text-amber-400"></i>
                <a
                  href={`tel:${siteSettings.phone}`}
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {siteSettings.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-mail-line text-amber-400"></i>
                <a
                  href={`mailto:${siteSettings.email}`}
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  {siteSettings.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <i className="ri-whatsapp-line text-amber-400"></i>
                <a
                  href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-amber-400 transition-colors text-sm"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            {siteSettings.footer.copyright}
          </p>
          <div className="flex flex-wrap flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {/* Language Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-gray-500 text-sm">{t('common.language')}:</span>
              <div className="flex flex-wrap gap-1">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => changeLang(l.code)}
                    className={`px-2 py-1 rounded text-sm transition-colors whitespace-nowrap cursor-pointer ${
                      lang === l.code
                        ? 'bg-amber-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <span className="mr-1">{l.flag}</span>
                    <span className="uppercase text-xs">{l.code}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-4">
              <button className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
                {t('common.privacy')}
              </button>
              <button className="text-gray-500 hover:text-gray-300 text-sm transition-colors cursor-pointer">
                {t('common.terms')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}