import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { siteSettings } from '../../../config/settings';
import { supabase } from '../../../lib/supabase';

export default function AdminUsers() {
  const { user, refreshRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [setupLoading, setSetupLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;

      if (!authToken) {
        setError('Session expirée. Veuillez vous reconnecter.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-users`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement');
      }
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  }, [supabaseUrl]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSetupAdmin = async () => {
    setSetupLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      if (!authToken) throw new Error('Session expirée');

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-users/setup`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');

      setSuccess('Vous êtes maintenant administrateur ! La page va se rafraîchir...');
      await refreshRole();
      setTimeout(() => window.location.reload(), 1500);
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally {
      setSetupLoading(false);
    }
  };

  const handlePromote = async (userId) => {
    setActionLoading(userId + '-promote');
    setError('');
    setSuccess('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      if (!authToken) throw new Error('Session expirée');

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-users/promote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');

      setSuccess('Utilisateur promu administrateur');
      fetchUsers();
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDemote = async (userId) => {
    setActionLoading(userId + '-demote');
    setError('');
    setSuccess('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      if (!authToken) throw new Error('Session expirée');

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-users/demote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');

      setSuccess('Utilisateur rétrogradé');
      fetchUsers();
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) return;
    setActionLoading(userId + '-delete');
    setError('');
    setSuccess('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const authToken = session?.access_token;
      if (!authToken) throw new Error('Session expirée');

      const response = await fetch(`${supabaseUrl}/functions/v1/admin-users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Erreur');

      setSuccess('Utilisateur supprimé');
      fetchUsers();
    } catch (e) {
      setError(e.message || 'Erreur');
    } finally {
      setActionLoading(null);
    }
  };

  const currentUserIsAdmin = users.find((u) => u.id === user?.id)?.role === 'admin';

  return (
    <div>
      <h1 className="text-xl font-bold mb-6" style={{ fontFamily: 'Playfair Display, serif', color: siteSettings.colors.text }}>
        Gestion des administrateurs
      </h1>

      {error && (
        <div className="mb-4 p-3 rounded-md text-sm bg-red-50 text-red-600 border border-red-200 flex items-start gap-2">
          <i className="ri-error-warning-line flex-shrink-0 mt-0.5"></i>
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 rounded-md text-sm bg-green-50 text-green-700 border border-green-200 flex items-start gap-2">
          <i className="ri-check-line flex-shrink-0 mt-0.5"></i>
          <span>{success}</span>
        </div>
      )}

      {/* Setup admin button if not admin yet */}
      {!currentUserIsAdmin && !loading && (
        <div className="mb-6 rounded-lg p-6 border border-amber-200 bg-amber-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
              <i className="ri-shield-user-line text-2xl text-amber-600"></i>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-1">Devenir administrateur</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vous êtes connecté mais vous n'avez pas encore le rôle d'administrateur. Cliquez ci-dessous pour vous attribuer ce rôle.
              </p>
              <button
                onClick={handleSetupAdmin}
                disabled={setupLoading}
                className="px-4 py-2 rounded-md text-white text-sm font-medium transition-colors"
                style={{ backgroundColor: siteSettings.colors.primary, opacity: setupLoading ? 0.7 : 1 }}
              >
                {setupLoading ? (
                  <span className="flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin"></i>
                    En cours...
                  </span>
                ) : (
                  'Me rendre administrateur'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-sm" style={{ color: siteSettings.colors.textLight }}>
          <i className="ri-loader-4-line animate-spin"></i>
          Chargement des utilisateurs...
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2 text-sm" style={{ color: siteSettings.colors.textLight }}>
            <span className="font-medium">{users.length}</span> utilisateur(s) enregistré(s)
            <span className="mx-2">·</span>
            <span className="font-medium text-amber-600">{users.filter((u) => u.role === 'admin').length}</span> admin(s)
          </div>

          <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'white', borderColor: '#E5E7EB' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Rôle</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Inscription</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#F3F4F6' }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0" style={{ backgroundColor: siteSettings.colors.primary }}>
                            {u.email?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-gray-900">{u.email}</span>
                          {u.id === user?.id && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Vous</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                            u.role === 'admin'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          <i className={u.role === 'admin' ? 'ri-shield-user-line' : 'ri-user-line'}></i>
                          {u.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('fr-FR') : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role === 'user' ? (
                            <button
                              onClick={() => handlePromote(u.id)}
                              disabled={actionLoading === u.id + '-promote'}
                              className="px-3 py-1.5 rounded-md text-xs font-medium text-white transition-colors"
                              style={{ backgroundColor: '#2D5F3F' }}
                            >
                              {actionLoading === u.id + '-promote' ? (
                                <i className="ri-loader-4-line animate-spin"></i>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <i className="ri-arrow-up-line"></i> Promouvoir
                                </span>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDemote(u.id)}
                              disabled={actionLoading === u.id + '-demote'}
                              className="px-3 py-1.5 rounded-md text-xs font-medium border transition-colors"
                              style={{ borderColor: '#E5E7EB', color: siteSettings.colors.text }}
                            >
                              {actionLoading === u.id + '-demote' ? (
                                <i className="ri-loader-4-line animate-spin"></i>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <i className="ri-arrow-down-line"></i> Rétrograder
                                </span>
                              )}
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(u.id)}
                            disabled={actionLoading === u.id + '-delete' || u.id === user?.id}
                            className="px-3 py-1.5 rounded-md text-xs font-medium text-red-600 border border-red-200 hover:bg-red-50 transition-colors disabled:opacity-50"
                          >
                            {actionLoading === u.id + '-delete' ? (
                              <i className="ri-loader-4-line animate-spin"></i>
                            ) : (
                              <i className="ri-delete-bin-line"></i>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}