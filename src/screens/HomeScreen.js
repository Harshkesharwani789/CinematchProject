import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, ActivityIndicator, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const { theme, isDark } = useContext(ThemeContext);
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingData, popularData, topRatedData] = await Promise.all([
          getTrendingMovies(1),
          getPopularMovies(1),
          getTopRatedMovies(1),
        ]);
        setTrending(trendingData);
        setPopular(popularData);
        setTopRated(topRatedData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSurpriseMe = () => {
    if (topRated.length > 0) {
      const randomMovie = topRated[Math.floor(Math.random() * topRated.length)];
      navigation.navigate('MovieDetails', { movieId: randomMovie.id });
    }
  };

  const renderSection = (title, data) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>{title}</Text>
      <FlatList
        data={data}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MovieCard
            movie={item}
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id })}
            theme={theme}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.primary }]}>CineMatch</Text>
          <TouchableOpacity onPress={handleSurpriseMe} style={styles.surpriseBtn}>
            <Ionicons name="dice-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        
        {renderSection('Trending Now', trending)}
        {renderSection('Popular Now', popular)}
        {renderSection('Top Rated', topRated)}
        {renderSection('Recommended for You', popular.slice().reverse())} 
        
        <View style={styles.bottomSpacer} />
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
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  surpriseBtn: {
    padding: 8,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 20,
  },
  bottomSpacer: {
    height: 50,
  },
});

export default HomeScreen;
