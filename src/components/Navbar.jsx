import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { siteSettings } from '../config/settings';
import { useTranslation } from '../hooks/useTranslation';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { t, lang, changeLang } = useTranslation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/communities', label: t('nav.communities') },
    { path: '/programs', label: t('nav.programs') },
    { path: '/events', label: t('nav.events') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/videos', label: t('nav.videos') },
    { path: '/contact', label: t('nav.contact') },
  ];

  const languages = [
    { code: 'fr', label: t('language.fr'), flag: '🇫🇷' },
    { code: 'en', label: t('language.en'), flag: '🇬🇧' },
    { code: 'de', label: t('language.de'), flag: '🇩🇪' },
    { code: 'zh', label: t('language.zh'), flag: '🇨🇳' },
    { code: 'es', label: t('language.es'), flag: '🇪🇸' },
    { code: 'it', label: t('language.it'), flag: '🇮🇹' },
    { code: 'pt', label: t('language.pt'), flag: '🇵🇹' },
  ];

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setUserMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="w-full px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => handleNav('/')}
          >
            <img
              src={siteSettings.logo}
              alt={siteSettings.logoAlt}
              className="h-10 w-10 md:h-12 md:w-12 object-contain rounded-full"
            />
            <span
              className={`font-bold text-lg md:text-xl transition-colors ${
                isScrolled ? 'text-gray-900' : 'text-white'
              }`}
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {siteSettings.siteName}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-black/5 whitespace-nowrap ${
                  isScrolled
                    ? 'text-gray-700 hover:text-gray-900'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </button>
            ))}
            {user && (
              <Link
                to="/admin"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-black/5 whitespace-nowrap ${
                  isScrolled
                    ? 'text-amber-600 hover:text-amber-700'
                    : 'text-amber-300 hover:text-amber-200 hover:bg-white/10'
                }`}
              >
                {t('nav.admin')}
              </Link>
            )}
          </div>

          {/* Right side: Language + User + Mobile menu */}
          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isScrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="text-base">
                  {languages.find((l) => l.code === lang)?.flag}
                </span>
                <span className="hidden sm:inline uppercase text-xs">
                  {lang}
                </span>
                <i className="ri-arrow-down-s-line text-xs"></i>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        changeLang(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50 ${
                        lang === l.code
                          ? 'text-amber-600 font-medium bg-amber-50'
                          : 'text-gray-700'
                      }`}
                    >
                      <span className="text-base">{l.flag}</span>
                      <span>{l.label}</span>
                      {lang === l.code && (
                        <i className="ri-check-line ml-auto text-amber-600"></i>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            {user && (
              <div className="relative hidden lg:block">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isScrolled
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium text-white" style={{ backgroundColor: siteSettings.colors.primary }}>
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <i className="ri-arrow-down-s-line text-xs"></i>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      to="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-dashboard-line"></i>
                      {t('nav.admin')}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <i className="ri-logout-box-line"></i>
                      {t('nav.logout')}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isScrolled
                  ? 'text-gray-700 hover:bg-gray-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <i className={`ri-${isOpen ? 'close' : 'menu'}-line text-xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {/* Mobile Language Selector */}
            <div className={`px-4 py-3 transform transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`} style={{ transitionDelay: isOpen ? '60ms' : '0ms' }}>
              <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{t('footer.language')}</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((l, lIndex) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      changeLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap transform duration-300 ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'} ${
                      lang === l.code
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    style={{ transitionDelay: isOpen ? `${100 + lIndex * 30}ms` : '0ms' }}
                  >
                    <span className="mr-1">{l.flag}</span>
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
            <div className={`border-t border-gray-100 my-2 transform transition-all duration-300 ${isOpen ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`} style={{ transitionDelay: isOpen ? '110ms' : '0ms', transformOrigin: 'left' }} />

            {navLinks.map((link, index) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors font-medium transform transition-transform duration-200 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                style={{ transitionDelay: isOpen ? `${120 + index * 40}ms` : '0ms' }}
              >
                {link.label}
              </button>
            ))}
            {user && (
              <>
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-2 px-4 py-3 rounded-lg text-amber-700 hover:bg-amber-50 transition-colors font-medium transform duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  style={{ transitionDelay: isOpen ? `${120 + navLinks.length * 40}ms` : '0ms' }}
                >
                  {t('nav.admin')}
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors font-medium transform duration-300 ${isOpen ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'}`}
                  style={{ transitionDelay: isOpen ? `${160 + navLinks.length * 40}ms` : '0ms' }}
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}