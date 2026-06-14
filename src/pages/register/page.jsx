import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { siteSettings } from '../../config/settings';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { register, user, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }
    if (password.length < 6) {
      setError(t('register.passwordMinLength'));
      return;
    }

    setSubmitting(true);
    try {
      const data = await register(email, password);
      // If user is directly confirmed (email confirmation disabled), go to setup-admin
      if (data?.user?.confirmed_at || data?.session) {
        setSuccess(true);
        return;
      }
      setSuccess(true);
    } catch (err) {
      setError(err.message || t('register.registerError'));
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="w-full max-w-md bg-white rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: siteSettings.colors.primary + '20' }}>
            <i className="ri-mail-check-line text-3xl" style={{ color: siteSettings.colors.primary }}></i>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            {t('register.verifyEmail')}
          </h2>
          <p className="text-sm mb-4 leading-relaxed" style={{ color: siteSettings.colors.textLight }}>
            {t('register.verifyEmailDesc').replace('{email}', email)}
          </p>
          <div className="p-3 rounded-lg mb-5 text-xs text-left" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
            <p className="font-semibold mb-1">{t('register.verifyEmailNote')}:</p>
            <p>{t('register.verifyEmailSpam')}</p>
          </div>
          <Link
            to="/setup-admin"
            className="block w-full py-2.5 rounded-md text-white text-sm font-medium text-center mb-3"
            style={{ backgroundColor: siteSettings.colors.primary }}
          >
            Devenir administrateur
          </Link>
          <Link
            to="/login"
            className="block w-full py-2.5 rounded-md text-sm font-medium text-center border"
            style={{ borderColor: '#E5E7EB', color: siteSettings.colors.text }}
          >
            {t('register.goToLogin')}
          </Link>
          <div className="mt-4 text-center">
            <Link to="/" className="text-xs underline" style={{ color: siteSettings.colors.textLight }}>
              ← {t('register.backToSite')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: siteSettings.colors.primary + '15' }}>
            <i className="ri-shield-user-line text-xl" style={{ color: siteSettings.colors.primary }}></i>
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            {t('register.createAccount')}
          </h1>
          <p className="text-xs" style={{ color: siteSettings.colors.textLight }}>
            {t('register.accessAdmin')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200 flex items-start gap-2">
            <i className="ri-error-warning-line flex-shrink-0 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: siteSettings.colors.textLight }}>
              {t('register.emailAddress')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 transition-all"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="admin@emmaus.fr"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: siteSettings.colors.textLight }}>
              {t('register.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5"
                style={{ cursor: 'pointer' }}
              >
                <i className={showPassword ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} style={{ color: siteSettings.colors.textLight }}></i>
              </button>
            </div>
            <p className="text-xs mt-1" style={{ color: siteSettings.colors.textLight }}>{t('register.minChars')}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: siteSettings.colors.textLight }}>
              {t('register.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200 transition-all"
                style={{ borderColor: '#E5E7EB' }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5"
                style={{ cursor: 'pointer' }}
              >
                <i className={showConfirmPassword ? 'ri-eye-off-line text-sm' : 'ri-eye-line text-sm'} style={{ color: siteSettings.colors.textLight }}></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-md text-white text-sm font-semibold transition-colors whitespace-nowrap mt-2"
            style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                {t('register.creatingAccount')}
              </span>
            ) : (
              t('register.createMyAccount')
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t text-center text-sm" style={{ borderColor: '#F3F4F6' }}>
          <span style={{ color: siteSettings.colors.textLight }}>{t('register.alreadyAccount')} </span>
          <Link
            to="/login"
            className="font-semibold underline"
            style={{ color: siteSettings.colors.primary }}
          >
            {t('register.signIn')}
          </Link>
        </div>

        <div className="mt-3 text-center">
          <Link
            to="/"
            className="text-xs underline"
            style={{ color: siteSettings.colors.textLight }}
          >
            ← {t('register.backToSite')}
          </Link>
        </div>
      </div>
    </div>
  );
}