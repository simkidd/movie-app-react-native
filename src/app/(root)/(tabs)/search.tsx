import { Loading } from "@/components/Loading";
import { MovieCardHorizontal } from "@/components/MovieCard";
import { useMovies } from "@/hooks/useMovies";
import { useTvShows } from "@/hooks/useTvShows";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { FlatList, Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"movie" | "tv">("movie");

  const searchHook =
    searchType === "movie" ? useMovies.search : useTvShows.search;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    searchHook(query);

  const items = data?.pages.flatMap((page) => page.results) || [];

  const loadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <SafeAreaView className="flex-1 p-4 bg-primary">
      {/* Search Bar with Type Toggle */}
      <View className="flex-row items-center mb-4">
        <TextInput
          className="flex-1 bg-white/10 text-text-primary p-3 rounded-lg mr-2"
          placeholder={`Search ${searchType}...`}
          placeholderTextColor="#94A3B8"
          value={query}
          onChangeText={setQuery}
        />
        <Pressable
          onPress={() =>
            setSearchType((prev) => (prev === "movie" ? "tv" : "movie"))
          }
          className="bg-accent rounded-lg p-3"
        >
          <Ionicons
            name={searchType === "movie" ? "tv-outline" : "film-outline"}
            size={20}
            color="white"
          />
        </Pressable>
      </View>

      {query ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <MovieCardHorizontal item={item} type={searchType} />
          )}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            isFetchingNextPage ? <Loading size="small" /> : null
          }
          ListEmptyComponent={() => (
            <Text className="text-text-secondary text-center mt-8">
              No {searchType} found for "{query}"
            </Text>
          )}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary text-lg">
            Search for your favorite {searchType}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}
