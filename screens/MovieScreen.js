import {
  Image,
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ChevronLeftIcon, HeartIcon } from "react-native-heroicons/outline";
import { styles, theme } from "../theme";
import { LinearGradient } from "expo-linear-gradient";
import Cast from "../components/Cast";
import MovieList from "../components/MovieList";
import Loading from "../components/Loading";
import {
  fallbackMoviePoster,
  fetchMovieCredits,
  fetchMovieDetails,
  fetchSimilarMovie,
  image500,
} from "../api/moviedb";

var { width, height } = Dimensions.get("window");
const ios = Platform.OS === "ios";
const topMargin = ios ? "" : "mt-3";
let movieName = "Spider-man: Across the SpiderVerse";

const MovieScreen = () => {
  const { params: item } = useRoute();
  const [isFavourite, toggleFavourite] = useState(false);
  const navigation = useNavigation();
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState({});

  useEffect(() => {
    // calling the API here
    //console.log("item id", item.id);
    setLoading(true);
    getMovieDetails(item.id);
    getMovieCredits(item.id);
    getSimilarMovies(item.id);
  }, [item]);

  const getMovieDetails = async (id) => {
    const data = await fetchMovieDetails(id);
    // console.log("movie details are", data);
    if (data) setMovie(data);
    setLoading(false);
  };

  const getMovieCredits = async (id) => {
    const data = await fetchMovieCredits(id);
    //console.log("credits data", data);
    if (data && data.cast) setCast(data.cast);
  };

  const getSimilarMovies = async (id) => {
    const data = await fetchSimilarMovie(id);
    //console.log("similar data", data);
    if (data && data.results) setSimilarMovies(data.results);
  };

  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 50 }}
      className="flex-1 bg-neutral-800"
    >
      <View className="w-full">
        <SafeAreaView
          className={
            "absolute z-20 w-full flex-row justify-between items-center px-4 " +
            topMargin
          }
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.background}
            className="rounded-xl p-1"
          >
            <ChevronLeftIcon size="28" strokeWidth={2.5} color="white" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => toggleFavourite(!isFavourite)}>
            <HeartIcon
              size="35"
              color={isFavourite ? theme.background : "white"}
            />
          </TouchableOpacity>
        </SafeAreaView>
        {loading ? (
          <Loading />
        ) : (
          <View>
            <Image
              //source={require("../assets/images/moviePoster1.png")}
              source={{
                uri: image500(movie?.poster_path) || fallbackMoviePoster,
              }}
              style={{ width, height: height * 0.55 }}
            />
            <LinearGradient
              colors={["transparent", "rgba(23,23,23,0.8)", "rgba(23,23,23,1)"]}
              style={{
                width,
                height: height * 0.4,
                position: "absolute",
                bottom: 0,
              }}
            />
          </View>
        )}
      </View>
      <View style={{ marginTop: -(height * 0.09) }} className="space-y-3">
        <Text className="text-white text-center text-3xl font-bold tracking-wider">
          {movie?.title}
        </Text>
        {movie?.id ? (
          <Text className="text-neutral-400 font-semibold text-base text-center">
            {movie?.status} · {movie?.release_date?.split("-")[0]} ·{" "}
            {movie?.runtime} min
          </Text>
        ) : null}

        <View className="flex-row justify-center mx-4 space-x-2">
          {movie?.genres?.map((genre, index) => {
            let showDot = index + 1 != movie.genres.length;
            return (
              <Text className="text-neutral-400 font-semibold text-base text-center">
                {genre?.name} {showDot ? "·" : null}
              </Text>
            );
          })}
        </View>
        <Text className="text-neutral-400 mx-4 tracking-wide text-center ">
          {movie?.overview}
        </Text>
      </View>
      {cast.length > 0 && <Cast navigation={navigation} cast={cast} />}
      {similarMovies.length > 0 && (
        <MovieList
          title="Similar Movies"
          hideSeeAll={true}
          data={similarMovies}
        />
      )}
    </ScrollView>
  );
};

export default MovieScreen;
