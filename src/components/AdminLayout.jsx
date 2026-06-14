import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../hooks/useTranslation';
import { siteSettings } from '../config/settings';

export default function AdminLayout() {
  const { user, logout, role, isAdmin } = useAuth();
  const { t, lang, changeLang } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="text-center">
          <p className="mb-4 text-sm" style={{ color: siteSettings.colors.textLight }}>Vous devez être connecté pour accéder à l'admin.</p>
          <Link
            to="/login"
            className="inline-block px-6 py-2.5 rounded-md text-white text-sm font-medium"
            style={{ backgroundColor: siteSettings.colors.primary }}
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  // Block non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-red-500"></i>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            Accès refusé
          </h1>
          <p className="text-sm mb-6" style={{ color: siteSettings.colors.textLight }}>
            Vous n'avez pas les permissions d'administrateur. Seuls les administrateurs peuvent accéder à cette interface.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 rounded-md text-white text-sm font-medium"
              style={{ backgroundColor: siteSettings.colors.primary }}
            >
              Retour au site
            </button>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="px-6 py-2.5 rounded-md text-sm font-medium border"
              style={{ borderColor: '#E5E7EB', color: siteSettings.colors.text }}
            >
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: '/admin', icon: 'ri-dashboard-line', label: t('admin.dashboard') },
    { path: '/admin/messages', icon: 'ri-message-3-line', label: t('admin.messages') },
    { path: '/admin/events', icon: 'ri-calendar-event-line', label: t('admin.events') },
    { path: '/admin/programs', icon: 'ri-book-open-line', label: t('admin.programs') },
    { path: '/admin/communities', icon: 'ri-group-line', label: t('admin.communities') },
    { path: '/admin/gallery', icon: 'ri-image-line', label: t('admin.gallery') },
    { path: '/admin/videos', icon: 'ri-video-line', label: t('admin.videos') },
    { path: '/admin/testimonials', icon: 'ri-chat-quote-line', label: t('admin.testimonials') },
    { path: '/admin/users', icon: 'ri-shield-user-line', label: 'Administrateurs' },
    { path: '/admin/settings', icon: 'ri-settings-3-line', label: t('admin.settings') },
  ];

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'de', label: 'DE' },
    { code: 'zh', label: 'ZH' },
    { code: 'es', label: 'ES' },
    { code: 'it', label: 'IT' },
    { code: 'pt', label: 'PT' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 lg:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: '#1A1A2E' }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white" style={{ fontFamily: 'Playfair Display, serif' }}>
            Admin
          </h2>
          <button
            className="lg:hidden text-white w-6 h-6 flex items-center justify-center"
            onClick={() => setSidebarOpen(false)}
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  color: isActive ? '#1A1A2E' : '#A0A0B0',
                  backgroundColor: isActive ? siteSettings.colors.primary : 'transparent',
                }}
                onClick={() => setSidebarOpen(false)}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className={item.icon}></i>
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          {/* Language selector */}
          <div className="relative mb-3">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <i className="ri-global-line"></i>
                {languages.find((l) => l.code === lang)?.label}
              </span>
              <i className={langMenuOpen ? 'ri-arrow-up-s-line text-xs' : 'ri-arrow-down-s-line text-xs'}></i>
            </button>
            {langMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      changeLang(l.code);
                      setLangMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                      lang === l.code ? 'text-amber-600 font-medium bg-amber-50' : 'text-gray-700'
                    }`}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <i className="ri-check-line text-amber-600"></i>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium" style={{ backgroundColor: siteSettings.colors.primary }}>
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white truncate">{user.email}</p>
              <span className="text-[10px] text-white/50 uppercase">{role}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-logout-box-line"></i>
            </div>
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center gap-3 px-4 py-3 border-b lg:hidden" style={{ backgroundColor: 'white' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-md"
            style={{ color: siteSettings.colors.text }}
          >
            <i className="ri-menu-line text-xl"></i>
          </button>
          <h1 className="text-sm font-semibold" style={{ color: siteSettings.colors.text }}>
            Admin
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}