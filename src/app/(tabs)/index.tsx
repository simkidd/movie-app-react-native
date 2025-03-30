import { Loading } from "@/components/Loading";
import { MovieCard } from "@/components/MovieCard";
import { IMovieCategory, useMovies } from "@/hooks/useMovies";
import { ITVCategory, useTvShows } from "@/hooks/useTvShows";
import { FlatList, Text, View } from "react-native";

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
    <View className="flex-1 bg-primary pt-4">
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
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

function MovieCarousel({
  title,
  category,
  type,
}: {
  title: string;
  category: IMovieCategory | ITVCategory;
  type: "movie" | "tv";
}) {
  const { data, isLoading, isError } =
    type === "movie"
      ? useMovies[category as IMovieCategory]()
      : useTvShows[category as ITVCategory]();

  if (isLoading) {
    return (
      <View className="h-64 justify-center">
        <Loading size="small" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="h-32 justify-center items-center">
        <Text className="text-text-secondary">Failed to load {title}</Text>
      </View>
    );
  }

  const movies = data?.pages[0]?.results || [];

  return (
    <View className="mb-6">
      <Text className="text-text-primary text-xl font-bold px-4 mb-2">
        {title}
      </Text>
      <FlatList
        horizontal
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="py-2 w-40">
            <MovieCard item={item} type={type} />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 16 }}
        ListEmptyComponent={() => (
          <View className="h-32 justify-center items-center">
            <Text className="text-text-secondary">No items found</Text>
          </View>
        )}
      />
    </View>
  );
}
