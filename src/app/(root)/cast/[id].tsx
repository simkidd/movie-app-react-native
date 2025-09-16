import { Loading } from "@/components/Loading";
import { useCastDetails } from "@/hooks/useCast";
import { imageUri } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function CastDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: cast, isLoading, isError } = useCastDetails(id as string);
  // Create shared values for animation
  const headerOpacity = useSharedValue(0);
  const headerTranslateY = useSharedValue(-100);
  const scrollY = useSharedValue(0);

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
  if (isError) return <Text>Error loading cast details</Text>;
  if (!cast) return null;

  return (
    <SafeAreaView className="flex-1 bg-primary">
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
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          className="rounded-full p-2"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-text-primary text-lg font-bold" numberOfLines={1}>
          {cast.name}
        </Text>
        <View style={{ width: 24 }} />
      </Animated.View>

      <Animated.ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
      >
        <View className="p-4 flex-row">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-black/40 rounded-full p-2"
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View className="items-center mb-6 px-4">
          <Image
            source={{
              uri: imageUri(cast.profile_path as string, "w500"),
              // : require("@/assets/default-avatar.png"),
            }}
            className="w-40 h-40 rounded-full"
            resizeMode="cover"
          />
        </View>

        <View className="px-4">
          <Text className="text-2xl font-bold text-white text-center mb-2">
            {cast.name}
          </Text>

          {cast.character && (
            <Text className="text-lg text-accent text-center mb-6">
              as {cast.character}
            </Text>
          )}
        </View>

        <View className="mb-6 px-4">
          <Text className="text-lg font-bold text-white mb-2">Biography</Text>
          <Text className="text-text-secondary">
            {cast.biography || "No biography available."}
          </Text>
        </View>

        <View className="px-4">
          <Text className="text-lg font-bold text-white mb-2">
            Personal Info
          </Text>
          <View className="space-y-2">
            {cast.birthday && (
              <Text className="text-text-secondary">
                <Text className="font-semibold">Born:</Text> {cast.birthday}
              </Text>
            )}
            {cast.place_of_birth && (
              <Text className="text-text-secondary">
                <Text className="font-semibold">From:</Text>{" "}
                {cast.place_of_birth}
              </Text>
            )}
          </View>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
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
