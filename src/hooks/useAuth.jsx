import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch or create profile for a user
  const fetchProfile = useCallback(async (userId) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Profile fetch error:', error);
        setRole(null);
        return;
      }

      if (profile) {
        setRole(profile.role);
      } else {
        // Create profile if missing
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ id: userId, role: 'user' })
          .select('role')
          .single();
        if (insertError) {
          console.error('Profile insert error:', insertError);
          setRole('user');
        } else {
          setRole(newProfile?.role || 'user');
        }
      }
    } catch (e) {
      console.error('Profile error:', e);
      setRole(null);
    }
  }, []);

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const u = session?.user || null;
      setUser(u);
      if (u) {
        await fetchProfile(u.id);
      }
      setLoading(false);
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user || null;
      setUser(u);
      if (u) {
        await fetchProfile(u.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  const login = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setUser(data.user);
    await fetchProfile(data.user.id);
    return data;
  }, [fetchProfile]);

  const register = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    // Create profile for new user
    if (data.user) {
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, role: 'user' });
      if (insertError) {
        console.error('Profile insert on register:', insertError);
      }
      setRole('user');
    }
    return data;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  }, []);

  const refreshRole = useCallback(async () => {
    if (user) {
      await fetchProfile(user.id);
    }
  }, [user, fetchProfile]);

  return (
    <AuthContext.Provider value={{ user, role, loading, login, register, logout, refreshRole, isAdmin: role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthProvider;