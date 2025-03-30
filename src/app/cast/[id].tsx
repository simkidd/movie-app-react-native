import { Loading } from "@/components/Loading";
import { useCastDetails } from "@/hooks/useCast";
import { imageUri } from "@/services/api";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CastDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { data: cast, isLoading, isError } = useCastDetails(id as string);
  const [showHeader, setShowHeader] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

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
  if (isError) return <Text>Error loading cast details</Text>;
  if (!cast) return null;

  return (
    <View className="flex-1 bg-primary p-4">
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
              {cast.name}
            </Text>
          </View>
        </Animated.View>
      )}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 80 }}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View className="items-center mb-6">
          <Image
            source={{
              uri: imageUri(cast.profile_path as string, "w500"),
              // : require("@/assets/default-avatar.png"),
            }}
            className="w-40 h-40 rounded-full"
            resizeMode="cover"
          />
        </View>

        <Text className="text-2xl font-bold text-white text-center mb-2">
          {cast.name}
        </Text>

        {cast.character && (
          <Text className="text-lg text-accent text-center mb-6">
            as {cast.character}
          </Text>
        )}

        <View className="mb-6">
          <Text className="text-lg font-bold text-white mb-2">Biography</Text>
          <Text className="text-text-secondary">
            {cast.biography || "No biography available."}
          </Text>
        </View>

        <View>
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
