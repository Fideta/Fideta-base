import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

const AuthContext = createContext(null);

let supabaseSingleton = null;

function getSupabaseClient(url, key) {
  if (!supabaseSingleton) {
    supabaseSingleton = createClient(url, key);
  }
  return supabaseSingleton;
}

export function AuthProvider({ children }) {
  const { siteConfig } = useDocusaurusContext();
  const { customFields } = siteConfig;

  const supabase = useMemo(() => {
    return getSupabaseClient(
      customFields.supabaseUrl,
      customFields.supabasePublishableKey
    );
  }, [customFields.supabaseUrl, customFields.supabasePublishableKey]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.error('Erreur session :', error.message);
        setUser(null);
        setLoading(false);
        return;
      }

      setSession(data?.session ?? null);
      setUser(data?.session?.user ?? null);
      setLoading(false);
    }

    initSession();

    const {
  data: { subscription },
} = supabase.auth.onAuthStateChange((_event, session) => {
  if (!mounted) return;
  setSession(session ?? null);
  setUser(session?.user ?? null);
});

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function refreshAuth() {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      setUser(null);
      return;
    }

    setSession(data?.session ?? null);
    setUser(data?.session?.user ?? null);
  }

  async function sendLoginCode(email) {
    return await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    });
  }

  async function verifyLoginCode(email, token) {
    return await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
  }

  async function signInWithPassword(email, password) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}

async function sendPasswordReset(email, redirectTo) {
  return await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
}

  async function signOut() {
    return await supabase.auth.signOut();
  }

const value = {
  supabase,
  loading,
  session,
  user,
  isLoggedIn: !!user,
  sendLoginCode,
  verifyLoginCode,
  signInWithPassword,
  sendPasswordReset,
  signOut,
  refreshAuth,
};

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth doit être utilisé dans AuthProvider');
  }

  return context;
}