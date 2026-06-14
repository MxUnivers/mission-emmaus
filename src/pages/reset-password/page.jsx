import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useTranslation } from '../../hooks/useTranslation';
import { siteSettings } from '../../config/settings';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checking, setChecking] = useState(true);
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        const hash = window.location.hash;
        if (hash.includes('access_token')) {
          const { data, error: err } = await supabase.auth.getSession();
          if (err || !data.session) {
            setError(t('login.loginError') || 'Lien invalide ou expiré');
          }
        } else {
          setError(t('login.loginError') || 'Lien invalide ou expiré');
        }
      }
      setChecking(false);
    };
    checkSession();
  }, [t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }
    if (newPassword.length < 6) {
      setError(t('register.passwordMinLength'));
      return;
    }

    setSubmitting(true);
    try {
      const { error: err } = await supabase.auth.updateUser({ password: newPassword });
      if (err) throw err;
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="text-center">
          <i className="ri-loader-4-line animate-spin text-2xl mb-3" style={{ color: siteSettings.colors.primary }}></i>
          <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="w-full max-w-md bg-white rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: siteSettings.colors.primary + '20' }}>
            <i className="ri-check-line text-3xl" style={{ color: siteSettings.colors.primary }}></i>
          </div>
          <h2 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            Mot de passe réinitialisé !
          </h2>
          <p className="text-sm mb-4" style={{ color: siteSettings.colors.textLight }}>
            Votre mot de passe a été modifié avec succès. Redirection vers la connexion...
          </p>
          <Link
            to="/login"
            className="block w-full py-2.5 rounded-md text-white text-sm font-medium text-center"
            style={{ backgroundColor: siteSettings.colors.primary }}
          >
            {t('nav.login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            {t('login.resetPassword')}
          </h1>
          <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>
            Choisissez un nouveau mot de passe
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200 flex items-start gap-2">
            <i className="ri-error-warning-line flex-shrink-0 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>
              {t('register.password')}
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
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
            <p className="text-xs mt-1" style={{ color: siteSettings.colors.textLight }}>{t('register.minChars')}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: siteSettings.colors.text }}>
              {t('register.confirmPassword')}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 pr-10 rounded-md border text-sm outline-none focus:ring-2 focus:ring-amber-200"
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
            className="w-full py-2.5 rounded-md text-white text-sm font-medium transition-colors whitespace-nowrap"
            style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer', opacity: submitting ? 0.7 : 1 }}
            onMouseEnter={(e) => e.target.style.backgroundColor = siteSettings.colors.primaryDark}
            onMouseLeave={(e) => e.target.style.backgroundColor = siteSettings.colors.primary}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <i className="ri-loader-4-line animate-spin"></i>
                {t('common.sending')}
              </span>
            ) : (
              'Enregistrer le nouveau mot de passe'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link
            to="/login"
            className="font-medium underline"
            style={{ color: siteSettings.colors.primary }}
          >
            ← {t('login.backToSite')}
          </Link>
        </div>
      </div>
    </div>
  );
}