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
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
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
import { WebView } from "react-native-webview";
import { useMovies } from "../../hooks/useMovies";
import { imageUri } from "../../services/api";

export default function MediaDetails() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{
    id: string;
    type: "movie" | "tv";
  }>();
  const isMovie = type === "movie";

  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHeader, setShowHeader] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

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

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setShowHeader(offsetY > 100); // Show header when scrolled past 100px
      },
      useNativeDriver: false,
    }
  );

  if (isLoading) return <Loading />;
  if (!media)
    return (
      <View className="flex-1 bg-primary items-center justify-center">
        <Text className="text-text-primary">
          {isMovie ? "Movie" : "TV Show"} not found
        </Text>
      </View>
    );

  const title = isMovie ? media.title : media.name;
  const releaseDate = isMovie ? media.release_date : media.first_air_date;
  const runtime = isMovie
    ? `${media.runtime} mins`
    : `${media.number_of_seasons} seasons, ${media.number_of_episodes} eps`;
  const genres = media.genres?.map((g: IGenre) => g.name).join(", ");

  return (
    <View className="flex-1 bg-primary">
      {/* Collapsible Header */}
      {showHeader && (
        <Animated.View
          className="absolute top-0 left-0 right-0 z-20 bg-primary py-4 px-4"
          style={[
            styles.header,
            {
              opacity: scrollY.interpolate({
                inputRange: [100, 150],
                outputRange: [0, 1],
                extrapolate: "clamp",
              }),
            },
          ]}
        >
          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text
              className="text-text-primary text-lg font-bold flex-1"
              numberOfLines={1}
            >
              {title}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Content Scroll */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 190 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        {/* Backdrop with Gradient Overlay */}
        <View className="absolute w-full h-72">
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

          {/* Initial Back Button */}
          {!showHeader && (
            <TouchableOpacity
              onPress={() => router.back()}
              className="absolute top-4 left-4 bg-primary/50 rounded-full p-2 z-10"
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>
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
                // contentContainerStyle={{ paddingRight: 16 }}
              />
            </View>
          )}

          {/* Trailer Section */}
          {videoKey && (
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
          )}

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
                // contentContainerStyle={{ paddingHorizontal: 16 }}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
