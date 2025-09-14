import { Loading } from "@/components/Loading";
import { IMovie } from "@/interfaces/movie.interface";
import { FlatList, Pressable, Text, View } from "react-native";
import { MovieCard } from "@/components/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { useState } from "react";
import { useTvShows } from "@/hooks/useTvShows";

export default function ExploreScreen() {
  const [activeTab, setActiveTab] = useState<"movie" | "tv">("movie");

  const {
    data: moviesData,
    fetchNextPage: fetchNextMovies,
    hasNextPage: hasNextMoviePage,
    isFetchingNextPage: isFetchingMoreMovies,
    isError: moviesError,
    refetch: refetchMovies,
  } = useMovies.popular();

  // TV Shows data
  const {
    data: tvData,
    fetchNextPage: fetchNextTV,
    hasNextPage: hasNextTVPage,
    isFetchingNextPage: isFetchingMoreTV,
    isError: tvError,
    refetch: refetchTV,
  } = useTvShows.popular();

  const currentData = activeTab === "movie" ? moviesData : tvData;
  const currentItems = currentData?.pages.flatMap((page) => page.results) || [];
  const isError = activeTab === "movie" ? moviesError : tvError;
  const refetch = activeTab === "movie" ? refetchMovies : refetchTV;

  const loadMore = () => {
    if (activeTab === "movie") {
      if (hasNextMoviePage && !isFetchingMoreMovies) fetchNextMovies();
    } else {
      if (hasNextTVPage && !isFetchingMoreTV) fetchNextTV();
    }
  };

  if (isError) {
    return (
      <View className="flex-1 items-center justify-center bg-primary">
        <Text className="text-white">
          Failed to load {activeTab === "movie" ? "movies" : "TV shows"}
        </Text>
        <Pressable onPress={() => refetch()} className="mt-4">
          <Text className="text-accent font-semibold">Retry</Text>
        </Pressable>
      </View>
    );
  }

  if (!currentData && !isError) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-primary">
      {/* Tabs */}
      <View className="flex-row px-4 pt-4">
        <Pressable
          className={`flex-1 py-3 border-b-2 ${
            activeTab === "movie" ? "border-accent" : "border-transparent"
          }`}
          onPress={() => setActiveTab("movie")}
        >
          <Text
            className={`text-center font-bold ${
              activeTab === "movie" ? "text-accent" : "text-text-secondary"
            }`}
          >
            Movies
          </Text>
        </Pressable>
        <Pressable
          className={`flex-1 py-3 border-b-2 ${
            activeTab === "tv" ? "border-accent" : "border-transparent"
          }`}
          onPress={() => setActiveTab("tv")}
        >
          <Text
            className={`text-center font-bold ${
              activeTab === "tv" ? "text-accent" : "text-text-secondary"
            }`}
          >
            TV Series
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={currentItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-1 max-w-[33.333%] py-1">
            <MovieCard item={item} type={activeTab} />
          </View>
        )}
        numColumns={3}
        columnWrapperStyle={null}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isFetchingMoreMovies || isFetchingMoreTV ? (
            <View className="py-4">
              <Loading size="small" />
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center py-10">
            <Text className="text-text-secondary text-center">
              No {activeTab === "movie" ? "movies" : "TV shows"} found
            </Text>
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 16,
          paddingTop: 16,
        }}
      />
    </View>
  );
}
