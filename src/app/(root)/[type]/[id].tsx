import CastCard from "@/components/CastCard";
import { Loading } from "@/components/Loading";
import { MovieCard } from "@/components/MovieCard";
import { Rating } from "@/components/Rating";
import { Colors } from "@/constants/colors";
import { useSimilar } from "@/hooks/useSimilar";
import { useTvShows } from "@/hooks/useTvShows";
import { useVideos } from "@/hooks/useVideos";
import { IGenre, IVideo } from "@/interfaces/movie.interface";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useMovies } from "../../../hooks/useMovies";
import { imageUri } from "../../../services/api";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

export default function MediaDetails() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: "movie" | "tv";
  }>();
  const insets = useSafeAreaInsets();
  const isMovie = type === "movie";

  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Create shared values for animation
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-100);
  const scrollY = useSharedValue(0);

  const { data: movieData, isLoading: movieLoading } = useMovies.details(
    Number(id)
  );
  const { data: tvData, isLoading: tvLoading } = useTvShows.details(Number(id));
  const { data: videosData } = useVideos(type, Number(id));
  const { data: similarData } = useSimilar(type, Number(id));

  const media = isMovie ? movieData : tvData;
  const isLoading = isMovie ? movieLoading : tvLoading;

  useEffect(() => {
    if (videosData?.results) {
      const trailer = videosData.results.find(
        (video: IVideo) => video.site === "YouTube" && video.type === "Trailer"
      );
      setVideoKey(trailer?.key || null);
    }
  }, [videosData]);

  // Hook to track the scroll position
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
    // Set a threshold for when the header should appear
    if (scrollY.value > 250) {
      headerOpacity.value = withTiming(1, { duration: 300 });
      headerTranslateY.value = withTiming(0, { duration: 500 });
    } else {
      headerOpacity.value = withTiming(0, { duration: 300 });
      headerTranslateY.value = withTiming(-100, { duration: 500 });
    }
  });

  // Define animated styles
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerOpacity.value,
      transform: [{ translateY: headerTranslateY.value }],
    };
  });

  if (isLoading) return <Loading />;
  if (!media)
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text className="text-text-primary">
          {isMovie ? "Movie" : "TV Show"} not found
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity>
            <Text className="text-accent font-bold">Go Home</Text>
          </TouchableOpacity>
        </Link>
      </SafeAreaView>
    );

  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const runtime = isMovie
    ? `${media.runtime} mins`
    : `${media.number_of_seasons} seasons, ${media.number_of_episodes} eps`;
  const genres = media.genres?.map((g: IGenre) => g.name).join(", ");

  return (
    <View className="flex-1 bg-primary">
      {/* This is the new header that will appear on scroll */}
      <Animated.View
        style={[
          animatedHeaderStyle,
          {
            paddingTop: insets.top,
          },
        ]}
        className="absolute top-0 left-0 right-0 z-50 bg-primary flex-row items-center justify-between p-4 border-b"
        pointerEvents={headerOpacity.value === 1 ? "auto" : "none"}
      >
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7} className="rounded-full p-2">
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold" numberOfLines={1}>
          {title}
        </Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
      >
        {/* Backdrop with Gradient Overlay */}
        <View className="w-full h-72">
          <Image
            source={{
              uri: imageUri(media.backdrop_path || media.poster_path, "w780"),
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", Colors.primary]}
            locations={[0.2, 1]}
            style={StyleSheet.absoluteFill}
          />

          <View
            style={{ paddingTop: insets.top }}
            className="absolute px-4 pt-4 z-10"
          >
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-black/40 rounded-full p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Content */}
        <View className="p-4">
          <Text className="text-text-primary text-2xl font-bold">{title}</Text>

          <View className="flex-row items-center my-2">
            <Rating value={media.vote_average / 2} />
            <Text className="text-text-secondary ml-2">
              {media.vote_average.toFixed(1)}/10 • {runtime}
            </Text>
          </View>

          <Text className="text-text-secondary">
            {new Date(releaseDate).toLocaleDateString()} • {genres}
          </Text>

          {media.tagline && (
            <Text className="text-accent italic mt-2">"{media.tagline}"</Text>
          )}

          <Text className="text-text-primary text-lg mt-6">Overview</Text>
          <Text className="text-text-secondary mt-2">{media.overview}</Text>

          {/* Cast Section */}
          {media.credits?.cast?.length > 0 && (
            <View className="mt-6">
              <Text className="text-text-primary text-lg font-bold mb-3">
                Cast
              </Text>
              <FlatList
                horizontal
                data={media.credits.cast}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <CastCard
                    item={item}
                    fallbackImage={imageUri(media.poster_path, "w185")}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}

          {/* Trailer Section */}
          {/* {videoKey && (
            <>
              <Text className="text-text-primary text-lg mt-6 mb-2">
                Trailer
              </Text>
              <View className="aspect-video w-full mb-6">
                <WebView
                  source={{ uri: `https://www.youtube.com/embed/${videoKey}` }}
                  style={{ width: "100%", aspectRatio: 16 / 9 }}
                  allowsFullscreenVideo
                  javaScriptEnabled
                  domStorageEnabled
                />
                {!isPlaying && (
                  <TouchableOpacity
                    onPress={() => setIsPlaying(true)}
                    className="absolute inset-0 items-center justify-center"
                  >
                    <Ionicons name="play-circle" size={48} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )} */}

          {/* Similar Movies/TV Shows Section */}
          {similarData?.results?.length > 0 && (
            <View className="mt-6">
              <Text className="text-text-primary text-lg font-bold mb-3 px-4">
                More Like This
              </Text>
              <FlatList
                horizontal
                data={similarData.results}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <View className="py-2 w-40">
                    <MovieCard item={item} type={type} />
                  </View>
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>
          )}
        </View>
      </Animated.ScrollView>
    </View>
  );
}
