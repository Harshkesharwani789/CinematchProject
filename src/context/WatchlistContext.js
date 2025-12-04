import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const storedWatchlist = await AsyncStorage.getItem('watchlist');
      if (storedWatchlist) {
        setWatchlist(JSON.parse(storedWatchlist));
      }
    } catch (e) {
      console.error('Failed to load watchlist', e);
    }
  };

  const addToWatchlist = async (movie) => {
    // Avoid duplicates
    if (watchlist.some((m) => m.id === movie.id)) return;

    const updatedWatchlist = [...watchlist, movie];
    setWatchlist(updatedWatchlist);
    await AsyncStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const removeFromWatchlist = async (movieId) => {
    const updatedWatchlist = watchlist.filter((m) => m.id !== movieId);
    setWatchlist(updatedWatchlist);
    await AsyncStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
  };

  const isInWatchlist = (movieId) => {
    return watchlist.some((m) => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};
