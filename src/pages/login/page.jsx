import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { supabase } from '../../lib/supabase';
import { siteSettings } from '../../config/settings';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSending, setResetSending] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState('');
  const { login, user, isAdmin } = useAuth();
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
    setSubmitting(true);
    try {
      const data = await login(email, password);
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
        if (profile?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/setup-admin');
        }
      }
    } catch (err) {
      setError(err.message || t('login.loginError'));
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setResetError('');
    setResetSuccess(false);
    setResetSending(true);
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });
      if (err) throw err;
      setResetSuccess(true);
      setResetEmail('');
    } catch (err) {
      setResetError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setResetSending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            {t('nav.login')}
          </h1>
          <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>
            {t('login.adminSpace')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>
              {t('login.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200"
              style={{ borderColor: '#E5E7EB' }}
              placeholder="admin@emmaus.fr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>
              {t('login.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200"
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
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                setShowForgot(true);
                setResetError('');
                setResetSuccess(false);
                setResetEmail(email);
              }}
              className="text-xs font-medium underline"
              style={{ color: siteSettings.colors.primary, cursor: 'pointer' }}
            >
              {t('login.forgotPassword')}
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 rounded-md text-white text-sm font-medium transition-colors whitespace-nowrap"
            style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = siteSettings.colors.primaryDark}
            onMouseLeave={(e) => e.target.style.backgroundColor = siteSettings.colors.primary}
          >
            {submitting ? t('login.loggingIn') : t('nav.login')}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span style={{ color: siteSettings.colors.textLight }}>{t('login.noAccount')} </span>
          <Link
            to="/register"
            className="font-medium underline"
            style={{ color: siteSettings.colors.primary }}
          >
            {t('login.signUp')}
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link
            to="/"
            className="text-xs underline"
            style={{ color: siteSettings.colors.textLight }}
          >
            ← {t('login.backToSite')}
          </Link>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowForgot(false)}
            style={{ cursor: 'pointer' }}
          />
          <div className="relative bg-white rounded-lg p-6 w-full max-w-sm">
            <button
              onClick={() => setShowForgot(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-md hover:bg-black/5"
              style={{ cursor: 'pointer' }}
            >
              <i className="ri-close-line text-sm" style={{ color: siteSettings.colors.textLight }}></i>
            </button>

            <h2 className="text-lg font-bold mb-1" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
              {t('login.resetPassword')}
            </h2>
            <p className="text-xs mb-4" style={{ color: siteSettings.colors.textLight }}>
              {t('login.resetPasswordDesc')}
            </p>

            {resetError && (
              <div className="mb-3 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200">
                {resetError}
              </div>
            )}
            {resetSuccess && (
              <div className="mb-3 p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200 flex items-start gap-2">
                <i className="ri-check-line flex-shrink-0 mt-0.5"></i>
                <span>{t('login.resetPasswordSent')}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <input
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200"
                  style={{ borderColor: '#E5E7EB' }}
                  placeholder="admin@emmaus.fr"
                />
              </div>
              <button
                type="submit"
                disabled={resetSending || resetSuccess}
                className="w-full py-2.5 rounded-md text-white text-sm font-medium transition-colors whitespace-nowrap"
                style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer', opacity: resetSending || resetSuccess ? 0.7 : 1 }}
                onMouseEnter={(e) => e.target.style.backgroundColor = siteSettings.colors.primaryDark}
                onMouseLeave={(e) => e.target.style.backgroundColor = siteSettings.colors.primary}
              >
                {resetSending ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    {t('common.sending')}
                  </span>
                ) : (
                  t('login.sendResetLink')
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}