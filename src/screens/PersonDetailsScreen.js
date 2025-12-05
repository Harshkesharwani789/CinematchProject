import React, { useEffect, useState, useContext } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getPersonDetails, getPersonMovieCredits } from '../api/tmdb';
import { TMDB_IMAGE_BASE_URL } from '../utils/constants';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const PersonDetailsScreen = ({ route, navigation }) => {
  const { personId } = route.params;
  const { theme } = useContext(ThemeContext);
  const [person, setPerson] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [personData, moviesData] = await Promise.all([
          getPersonDetails(personId),
          getPersonMovieCredits(personId),
        ]);
        setPerson(personData);
        setMovies(moviesData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [personId]);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!person) return null;

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={theme.colors.text} />
      </TouchableOpacity>

      <View style={styles.header}>
        <Image
          source={{ uri: `${TMDB_IMAGE_BASE_URL}${person.profile_path}` }}
          style={[styles.profileImage, { backgroundColor: theme.colors.card }]}
        />
        <Text style={[styles.name, { color: theme.colors.text }]}>{person.name}</Text>
        <Text style={[styles.info, { color: theme.colors.subText }]}>
          {person.birthday} • {person.place_of_birth}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Biography</Text>
        <Text style={[styles.biography, { color: theme.colors.subText }]}>
          {person.biography || 'No biography available.'}
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Known For</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.movieList}>
          {movies.slice(0, 10).map((movie) => (
            <TouchableOpacity
              key={movie.id}
              style={styles.movieCard}
              onPress={() => navigation.push('MovieDetails', { movieId: movie.id })}
            >
              <Image
                source={{ uri: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` }}
                style={[styles.movieImage, { backgroundColor: theme.colors.card }]}
              />
              <Text style={[styles.movieTitle, { color: theme.colors.text }]} numberOfLines={2}>
                {movie.title}
              </Text>
            </TouchableOpacity>
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
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    padding: 8,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },
  biography: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  movieList: {
    marginBottom: 20,
  },
  movieCard: {
    width: 120,
    marginRight: 16,
  },
  movieImage: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default PersonDetailsScreen;
