import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { getSupabase } from '../lib/supabase';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.id) {
      setWatchlist([]);
      setIsLoading(false);
      return;
    }

    loadWatchlist();
  }, [user?.id]);

  const loadWatchlist = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await getSupabase()
        .from('watchlist_items')
        .select('movie')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setWatchlist(data.map((item) => item.movie));
    } catch (e) {
      console.error('Failed to load watchlist', e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addToWatchlist = async (movie) => {
    if (watchlist.some((m) => m.id === movie.id)) return;
    const { error } = await getSupabase().from('watchlist_items').insert({
      user_id: user.id,
      movie_id: movie.id,
      movie,
    });
    if (error) throw error;
    setWatchlist((current) => [movie, ...current]);
  };

  const removeFromWatchlist = async (movieId) => {
    const { error } = await getSupabase()
      .from('watchlist_items')
      .delete()
      .eq('movie_id', movieId);
    if (error) throw error;
    setWatchlist((current) => current.filter((movie) => movie.id !== movieId));
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, isLoading, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
