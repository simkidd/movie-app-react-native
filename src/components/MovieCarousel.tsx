import { IMovieCategory, useMovies } from "@/hooks/useMovies";
import { ITVCategory, useTvShows } from "@/hooks/useTvShows";
import { Text, View, FlatList } from "react-native";
import { Loading } from "./Loading";
import { MovieCard } from "./MovieCard";

export default function MovieCarousel({
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
