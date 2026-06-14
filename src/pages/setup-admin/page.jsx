import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../hooks/useTranslation';
import { supabase } from '../../lib/supabase';
import { siteSettings } from '../../config/settings';

export default function SetupAdmin() {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleBecomeAdmin = async () => {
    setLoading(true);
    setError('');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData?.session?.access_token;
      if (!token) {
        setError('Vous devez être connecté pour devenir administrateur.');
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_PUBLIC_SUPABASE_URL}/functions/v1/become-admin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const result = await response.json();
      if (!response.ok) {
        setError(result.error || 'Une erreur est survenue.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Refresh the page after 2 seconds to let auth context update
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="w-full max-w-md bg-white rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#FEE2E2' }}>
            <i className="ri-user-line text-3xl text-red-500"></i>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            Connexion requise
          </h1>
          <p className="text-sm mb-6" style={{ color: siteSettings.colors.textLight }}>
            Vous devez être connecté pour devenir administrateur.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              className="block w-full py-2.5 rounded-md text-white text-sm font-medium text-center"
              style={{ backgroundColor: siteSettings.colors.primary }}
            >
              Se connecter
            </Link>
            <Link
              to="/register"
              className="block w-full py-2.5 rounded-md text-sm font-medium text-center border"
              style={{ borderColor: '#E5E7EB', color: siteSettings.colors.text }}
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
        <div className="w-full max-w-md bg-white rounded-lg p-8 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#D1FAE5' }}>
            <i className="ri-check-line text-3xl text-green-500"></i>
          </div>
          <h1 className="text-xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            Vous êtes administrateur !
          </h1>
          <p className="text-sm mb-4" style={{ color: siteSettings.colors.textLight }}>
            Votre compte a été promu au rôle administrateur. Redirection vers l'administration...
          </p>
          <Link
            to="/admin"
            className="inline-block px-6 py-2.5 rounded-md text-white text-sm font-medium"
            style={{ backgroundColor: siteSettings.colors.primary }}
          >
            Aller à l'administration
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: siteSettings.colors.backgroundWarm }}>
      <div className="w-full max-w-md bg-white rounded-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: siteSettings.colors.primary + '15' }}>
            <i className="ri-shield-user-line text-3xl" style={{ color: siteSettings.colors.primary }}></i>
          </div>
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
            Devenir administrateur
          </h1>
          <p className="text-sm" style={{ color: siteSettings.colors.textLight }}>
            Connecté en tant que <strong>{user.email}</strong>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200 flex items-start gap-2">
            <i className="ri-error-warning-line flex-shrink-0 mt-0.5"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="p-4 rounded-lg mb-6 text-sm" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
          <p className="font-semibold mb-1">Attention :</p>
          <p>Cette action donne les droits d'administrateur à votre compte. Assurez-vous que vous êtes le propriétaire du site.</p>
        </div>

        <button
          onClick={handleBecomeAdmin}
          disabled={loading}
          className="w-full py-2.5 rounded-md text-white text-sm font-semibold transition-colors whitespace-nowrap"
          style={{ backgroundColor: siteSettings.colors.primary, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <i className="ri-loader-4-line animate-spin"></i>
              Mise à jour...
            </span>
          ) : (
            'Me rendre administrateur'
          )}
        </button>

        <div className="mt-5 pt-5 border-t text-center" style={{ borderColor: '#F3F4F6' }}>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="text-sm underline"
            style={{ color: siteSettings.colors.textLight }}
          >
            Se déconnecter et retourner au site
          </button>
        </div>
      </div>
    </div>
  );
}