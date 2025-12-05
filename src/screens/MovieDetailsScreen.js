import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Share, Alert, Modal, Dimensions } from 'react-native';
import { getMovieDetails, getMovieCredits, getMovieVideos, getMovieReviews } from '../api/tmdb';
import { TMDB_IMAGE_BASE_URL } from '../utils/constants';
import { WatchlistContext } from '../context/WatchlistContext';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

const MovieDetailsScreen = ({ route, navigation }) => {
  const { movieId } = route.params;
  const { theme } = useContext(ThemeContext);
  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [trailerId, setTrailerId] = useState(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useContext(WatchlistContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieData, creditsData, videosData, reviewsData] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieVideos(movieId),
          getMovieReviews(movieId),
        ]);
        setMovie(movieData);
        setCast(creditsData);
        setVideos(videosData);
        setReviews(reviewsData);
        
        const trailer = videosData.find(v => v.site === 'YouTube' && v.type === 'Trailer') || videosData.find(v => v.site === 'YouTube');
        if (trailer) {
          setTrailerId(trailer.key);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]);

  const onStateChange = useCallback((state) => {
    if (state === "ended") {
      setPlaying(false);
    }
  }, []);

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
    if (trailerId) {
      setPlaying(true);
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
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {playing && trailerId ? (
          <View style={styles.videoContainer}>
             <YoutubePlayer
              height={250}
              play={playing}
              videoId={trailerId}
              onChangeState={onStateChange}
            />
            <TouchableOpacity style={styles.closeVideoBtn} onPress={() => setPlaying(false)}>
               <Text style={styles.closeVideoText}>Close Trailer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Image
            source={{ uri: `${TMDB_IMAGE_BASE_URL}${movie.backdrop_path || movie.poster_path}` }}
            style={styles.backdrop}
          />
        )}
        
        {!playing && (
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#fff" />
          </TouchableOpacity>
        )}

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

          {!playing && (
            <TouchableOpacity style={[styles.trailerBtn, { backgroundColor: theme.colors.card }]} onPress={handleWatchTrailer}>
              <Ionicons name="play-circle-outline" size={24} color={theme.colors.primary} />
              <Text style={[styles.trailerText, { color: theme.colors.text }]}>Watch Trailer</Text>
            </TouchableOpacity>
          )}

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
              <TouchableOpacity 
                key={actor.id} 
                style={styles.castCard}
                onPress={() => navigation.navigate('PersonDetails', { personId: actor.id })}
              >
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
              </TouchableOpacity>
            ))}
          </ScrollView>

          {reviews.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Reviews</Text>
              {reviews.slice(0, 3).map((review) => (
                <View key={review.id} style={[styles.reviewCard, { backgroundColor: theme.colors.card }]}>
                  <Text style={[styles.reviewAuthor, { color: theme.colors.text }]}>{review.author}</Text>
                  <Text style={[styles.reviewContent, { color: theme.colors.subText }]} numberOfLines={4}>
                    {review.content}
                  </Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
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
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  closeVideoBtn: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#222',
  },
  closeVideoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
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
  reviewCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  reviewAuthor: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default MovieDetailsScreen;
