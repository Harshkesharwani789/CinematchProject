import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { TMDB_IMAGE_BASE_URL } from '../utils/constants';

const MovieCard = ({ movie, onPress, theme }) => {
  return (
    <TouchableOpacity style={[styles.card, { backgroundColor: theme.colors.card }]} onPress={onPress}>
      <Image
        source={{ uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` }}
        style={styles.poster}
        resizeMode="cover"
      />
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.colors.text }]} numberOfLines={1}>
          {movie.title}
        </Text>
        <Text style={[styles.rating, { color: theme.colors.subText }]}>⭐ {movie.vote_average?.toFixed(1)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 140,
    marginRight: 16,
    borderRadius: 8,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: 200,
  },
  info: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rating: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default MovieCard;
