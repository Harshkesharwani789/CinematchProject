import React, { createContext, useEffect, useState } from 'react';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export const AuthContext = createContext();

const toAppUser = (authUser) => ({
  id: authUser.id,
  email: authUser.email,
  name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'CineMatch user',
});

const toAuthError = (error) => {
  const message = error?.message || 'Something went wrong. Please try again.';

  if (/network request failed|fetch failed|failed to fetch/i.test(message)) {
    return new Error('Cannot reach the CineMatch cloud service. Check that the Supabase project URL in .env is correct and the project is active, then restart Expo with npx expo start --clear.');
  }

  return error;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [setupError, setSetupError] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setSetupError('Cloud services are not configured yet. Follow README.md to add your Supabase keys.');
      setIsLoading(false);
      return undefined;
    }

    const client = getSupabase();
    let isMounted = true;

    const loadUser = async () => {
      const { data, error } = await client.auth.getSession();

      if (!isMounted) return;
      setSetupError(error ? error.message : null);
      setUser(data.session?.user ? toAppUser(data.session.user) : null);
      setIsLoading(false);
    };

    loadUser();

    const { data: subscriptionData } = client.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setSetupError(null);
        setUser(session?.user ? toAppUser(session.user) : null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscriptionData.subscription.unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    const { error } = await getSupabase().auth.signInWithPassword({ email: email.trim(), password });
    if (error) throw toAuthError(error);
  };

  const signup = async (name, email, password) => {
    const { data, error } = await getSupabase().auth.signUp({
      email: email.trim(),
      password,
      options: { data: { name: name.trim() } },
    });
    if (error) throw toAuthError(error);

    return { requiresEmailConfirmation: !data.session };
  };

  const logout = async () => {
    const { error } = await getSupabase().auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (name) => {
    const { data, error } = await getSupabase().auth.updateUser({
      data: { name: name.trim() },
    });
    if (error) throw error;
    setUser(toAppUser(data.user));
  };

  const changePassword = async (oldPassword, newPassword) => {
    if (!user?.email) throw new Error('You need to be signed in to change your password.');

    const { error: updateError } = await getSupabase().auth.updateUser({
      password: newPassword,
      current_password: oldPassword,
    });
    if (updateError) throw updateError;
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setupError, login, signup, logout, updateProfile, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
