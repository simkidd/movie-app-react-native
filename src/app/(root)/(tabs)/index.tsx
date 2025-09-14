import MovieCarousel from "@/components/MovieCarousel";
import { IMovieCategory } from "@/hooks/useMovies";
import { ITVCategory } from "@/hooks/useTvShows";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const categories = [
  { title: "Popular Movies", value: "popular", type: "movie" },
  { title: "Trending Movies", value: "trending", type: "movie" },
  { title: "Now Playing", value: "nowPlaying", type: "movie" },
  { title: "Top Rated Movies", value: "topRated", type: "movie" },
  { title: "Upcoming Movies", value: "upcoming", type: "movie" },
  { title: "Popular TV Shows", value: "popular", type: "tv" },
  { title: "Trending TV Shows", value: "trending", type: "tv" },
  { title: "Airing Today", value: "airingToday", type: "tv" },
  { title: "Top Rated TV", value: "topRated", type: "tv" },
  { title: "On The Air", value: "onTheAir", type: "tv" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <FlatList
        data={categories}
        keyExtractor={(item) => `${item.type}-${item.value}`}
        renderItem={({ item }) => (
          <MovieCarousel
            title={item.title}
            category={item.value as IMovieCategory | ITVCategory}
            type={item.type as "movie" | "tv"}
          />
        )}
        // ListHeaderComponent={() => (
        //   <Text className="text-text-primary text-2xl font-bold px-4 pt-4 pb-2">
        //     What to Watch
        //   </Text>
        // )}
        // contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}
