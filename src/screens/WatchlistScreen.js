import React, { useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { WatchlistContext } from '../context/WatchlistContext';
import { ThemeContext } from '../context/ThemeContext';
import { TMDB_IMAGE_BASE_URL } from '../utils/constants';
import { Ionicons } from '@expo/vector-icons';

const WatchlistScreen = ({ navigation }) => {
  const { watchlist, removeFromWatchlist } = useContext(WatchlistContext);
  const { theme } = useContext(ThemeContext);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.item, { backgroundColor: theme.colors.card }]}
      onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
    >
      <Image
        source={{ uri: `${TMDB_IMAGE_BASE_URL}${item.poster_path}` }}
        style={styles.poster}
      />
      <View style={styles.info}>
        <Text style={[styles.movieTitle, { color: theme.colors.text }]}>{item.title}</Text>
        <Text style={[styles.rating, { color: theme.colors.subText }]}>⭐ {item.vote_average?.toFixed(1)}</Text>
        <Text style={[styles.year, { color: theme.colors.subText }]}>{item.release_date?.split('-')[0]}</Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => removeFromWatchlist(item.id)}
      >
        <Ionicons name="trash-outline" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.title, { color: theme.colors.text }]}>My Watchlist</Text>
      </View>

      {watchlist.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="bookmark-outline" size={64} color={theme.colors.subText} />
          <Text style={[styles.emptyText, { color: theme.colors.subText }]}>Your watchlist is empty</Text>
        </View>
      ) : (
        <FlatList
          data={watchlist}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  listContent: {
    padding: 20,
  },
  item: {
    flexDirection: 'row',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    alignItems: 'center',
  },
  poster: {
    width: 80,
    height: 120,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  rating: {
    fontSize: 14,
    marginBottom: 4,
  },
  year: {
    fontSize: 14,
  },
  removeBtn: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    marginTop: 16,
  },
});

export default WatchlistScreen;
