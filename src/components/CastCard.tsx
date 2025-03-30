import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { imageUri } from "@/services/api";
import { ICastMember } from "@/interfaces/movie.interface";
import { useRouter } from "expo-router";

const CastCard = ({
  item,
  fallbackImage,
}: {
  item: ICastMember;
  fallbackImage?: string;
}) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/cast/${item.id}`)}
      className="w-24 items-center"
    >
      <Image
        source={{
          uri: item.profile_path
            ? imageUri(item.profile_path as string, "w185")
            : fallbackImage,
            // : fallbackImage || require("@/assets/default-avatar.png"),
        }}
        className="w-20 h-20 rounded-lg"
        resizeMode="cover"
      />
      <Text className="text-text-primary text-sm mt-2 text-center font-medium">
        {item.name}
      </Text>
      <Text className="text-text-secondary text-xs text-center italic">
        {item.character}
      </Text>
    </Pressable>
  );
};

export default CastCard;
