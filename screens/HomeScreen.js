import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Bars3CenterLeftIcon,
  MagnifyingGlassIcon,
} from "react-native-heroicons/outline";
import { styles } from "../theme";
import TrendingMovies from "../components/TrendingMovies";
import MovieList from "../components/MovieList";
import { useNavigation } from "@react-navigation/native";
import Loading from "../components/Loading";
import {
  fetchTopRatedMovies,
  fetchTrendingMovies,
  fetchUpcomingMovies,
} from "../api/moviedb";

const HomeScreen = () => {
  const [trending, setTrending] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    getTrendingMovies();
    getUpcomingMovies();
    getTopRatedMovies();
  }, []);

  const getTrendingMovies = async () => {
    const data = await fetchTrendingMovies();
    //console.log("got the movies", data);
    if (data && data.results) setTrending(data.results);
    setLoading(false);
  };

  const getUpcomingMovies = async () => {
    const data = await fetchUpcomingMovies();
    //console.log("got the movies", data);
    //console.log("upcoming are", data);
    if (data && data.results) setUpcoming(data.results);
  };

  const getTopRatedMovies = async () => {
    const data = await fetchTopRatedMovies();
    //console.log("got the movies", data);
    if (data && data.results) setTopRated(data.results);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#262626" }}>
      <View className="bg-neutral-800">
        <SafeAreaView className="mb-3 mt-4">
          <StatusBar style="light" />
          <View className="flex-row justify-between items-center mx-4">
            <Bars3CenterLeftIcon size="30" strokeWidth={2} color="white" />
            <Text className="text-white text-3xl font-bold">
              <Text style={styles.text}>C</Text>info
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
              <MagnifyingGlassIcon size="30" strokeWidth={2} color="white" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
      {loading ? (
        <Loading />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {trending.length > 0 && <TrendingMovies data={trending} />}
          <MovieList title="Upcoming" data={upcoming} />
          <MovieList title="Top Rated" data={topRated} />
        </ScrollView>
      )}
    </View>
  );
};

export default HomeScreen;
