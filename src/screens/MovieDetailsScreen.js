import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Share, Alert } from 'react-native';
import { getMovieDetails, getMovieCredits, getMovieVideos } from '../api/tmdb';
import { TMDB_IMAGE_BASE_URL } from '../utils/constants';
import { WatchlistContext } from '../context/WatchlistContext';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { theme } = useContext(ThemeContext);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(WatchlistContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, creditsData, videosData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieVideos(movieId),
        ]);
        setMovie(movieData);
        setCast(creditsData);
        setVideos(videosData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!movie) return null;

  const isSaved = isInWatchlist(movie.id);

  const toggleWatchlist = () => {
    if (isSaved) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleWatchTrailer = () => {
    const trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videos.find(v => v.site === 'YouTube');
    if (trailer) {
      Linking.openURL(`https://www.youtube.com/watch?v=${trailer.key}`);
    } else {
      Alert.alert('Sorry', 'No trailer available for this movie.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this movie: ${movie.title} \n\n${movie.overview}`,
        title: movie.title,
      });
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Image
        source={{ uri: `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}` }}
        style={styles.backdrop}
      />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#fff" />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{movie.title}</Text>
            <Text style={[styles.subtitle, { color: theme.colors.subText }]}>
              {movie.release_date?.split('-')[0]} • {movie.runtime} min • ⭐ {movie.vote_average?.toFixed(1)}
            </Text>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
              <Ionicons name="share-social-outline" size={28} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleWatchlist} style={styles.actionBtn}>
              <Ionicons 
                name={isSaved ? "bookmark" : "bookmark-outline"} 
                size={28} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={[styles.trailerBtn, { backgroundColor: theme.colors.card }]} onPress={handleWatchTrailer}>
          <Ionicons name="play-circle-outline" size={24} color={theme.colors.primary} />
          <Text style={[styles.trailerText, { color: theme.colors.text }]}>Watch Trailer</Text>
        </TouchableOpacity>

        <View style={styles.genres}>
          {movie.genres?.map((genre) => (
            <View key={genre.id} style={[styles.genreTag, { backgroundColor: theme.colors.card }]}>
              <Text style={[styles.genreText, { color: theme.colors.subText }]}>{genre.name}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Overview</Text>
        <Text style={[styles.overview, { color: theme.colors.subText }]}>{movie.overview}</Text>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Cast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.castList}>
          {cast.slice(0, 10).map((actor) => (
            <View key={actor.id} style={styles.castCard}>
              {actor.profile_path ? (
                <Image
                  source={{ uri: `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` }}
                  style={[styles.castImage, { backgroundColor: theme.colors.card }]}
                />
              ) : (
                <View style={[styles.castImage, styles.placeholderCast, { backgroundColor: theme.colors.card }]}>
                  <Ionicons name="person" size={24} color={theme.colors.subText} />
                </View>
              )}
              <Text style={[styles.castName, { color: theme.colors.subText }]} numberOfLines={2}>{actor.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    width: '100%',
    height: 250,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  titleContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
  },
  actionBtn: {
    marginLeft: 16,
  },
  trailerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  trailerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreTag: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 10,
  },
  overview: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 20,
  },
  castList: {
    marginBottom: 20,
  },
  castCard: {
    width: 80,
    marginRight: 16,
    alignItems: 'center',
  },
  castImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  placeholderCast: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  castName: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default MovieDetailsScreen;
