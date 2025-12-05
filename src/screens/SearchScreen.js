import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { ThemeContext } from '../context/ThemeContext';

const SearchScreen = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [year, setYear] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Debounce function
  const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  };

  const debouncedQuery = useDebounce(query, 500);
  const debouncedYear = useDebounce(year, 500);

  const fetchMovies = useCallback(async (searchQuery, searchYear, searchRating, pageNum, reset = false) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    if (reset) setLoading(true);

    try {
      const data = await searchMovies(searchQuery, pageNum);
      
      if (data.length === 0) {
        setHasMore(false);
      }

      const filtered = data.filter(movie => {
        const ratingMatch = movie.vote_average >= searchRating;
        const yearMatch = searchYear ? (movie.release_date && movie.release_date.startsWith(searchYear)) : true;
        return ratingMatch && yearMatch;
      });

      setResults(prev => reset ? filtered : [...prev, ...filtered]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect for Live Search
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMovies(debouncedQuery, debouncedYear, minRating, 1, true);
  }, [debouncedQuery, debouncedYear, minRating, fetchMovies]);

  const loadMore = () => {
    if (!loading && hasMore && query.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchMovies(debouncedQuery, debouncedYear, minRating, nextPage, false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={[styles.searchInput, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text }]}
          placeholder="Search movies..."
          placeholderTextColor={theme.colors.subText}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <View style={styles.filters}>
        <TextInput
          style={[styles.filterInput, { backgroundColor: theme.colors.inputBackground, color: theme.colors.text, width: 80 }]}
          placeholder="Year"
          placeholderTextColor={theme.colors.subText}
          keyboardType="numeric"
          value={year}
          onChangeText={setYear}
          maxLength={4}
        />
        <View style={styles.ratingFilter}>
          <Text style={[styles.filterLabel, { color: theme.colors.subText }]}>Min Rating: {minRating}+</Text>
          <View style={styles.ratingButtons}>
            {[0, 6, 7, 8].map((r) => (
              <TouchableOpacity
                key={r}
                style={[
                  styles.ratingBtn, 
                  { backgroundColor: theme.colors.inputBackground },
                  minRating === r && { backgroundColor: theme.colors.primary }
                ]}
                onPress={() => setMinRating(r)}
              >
                <Text style={[styles.ratingBtnText, { color: theme.colors.text }]}>{r === 0 ? 'All' : r}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {loading && page === 1 ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <MovieCard
                movie={item}
                onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
                theme={theme}
              />
            </View>
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && page > 1 ? <ActivityIndicator color={theme.colors.primary} /> : null}
          ListEmptyComponent={
            !loading && debouncedQuery.trim() ? (
              <Text style={[styles.emptyText, { color: theme.colors.subText }]}>No movies found matching your criteria.</Text>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  searchInput: {
    padding: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  filters: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  filterInput: {
    padding: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  ratingFilter: {
    flex: 1,
    marginLeft: 10,
  },
  filterLabel: {
    fontSize: 12,
    marginBottom: 5,
  },
  ratingButtons: {
    flexDirection: 'row',
  },
  ratingBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginRight: 5,
  },
  ratingBtnText: {
    fontSize: 12,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 0.5,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
  },
});

export default SearchScreen;
