import { View, Text, Image, Pressable, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { imageUri } from "../services/api";
import { IMovie } from "@/interfaces/movie.interface";
import { ITVShow } from "@/interfaces/tv.interface";
import { useState } from "react";
import { Colors } from "@/constants/colors";

interface MovieCardProps {
  item: IMovie | ITVShow;
  // variant?: 'vertical' | 'horizontal';
  type: "movie" | "tv";
  className?: string;
}

export function MovieCard({ item, type }: MovieCardProps) {
  const [loading, setLoading] = useState(true);

  const title =
    type === "movie" ? (item as IMovie).title : (item as ITVShow).name;

  const releaseDate =
    type === "movie"
      ? (item as IMovie).release_date
      : (item as ITVShow).first_air_date;

  return (
    <Link href={`/${type}/${item.id}`} asChild>
      <Pressable className="mx-2">
        <View className="w-full">
          <View className="rounded-lg overflow-hidden">
            <View className="w-full h-48 bg-neutral-900 items-center justify-center">
              {loading && (
                <ActivityIndicator size="small" color={Colors.accent} />
              )}
              <Image
                source={{ uri: imageUri(item.poster_path as string) }}
                className="w-full h-48 absolute"
                resizeMode="cover"
                onLoadStart={() => setLoading(true)}
                onLoadEnd={() => setLoading(false)}
              />
            </View>
          </View>
          <View className="py-3">
            <Text
              className="text-text-primary font-bold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-accent font-bold text-xs mr-1">
                {item.vote_average.toFixed(1)}
              </Text>
              <Text className="text-text-secondary text-xs">/10</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export function MovieCardHorizontal({ item, type }: MovieCardProps) {
  const [loading, setLoading] = useState(true);

  const title =
    type === "movie" ? (item as IMovie).title : (item as ITVShow).name;

  const releaseDate =
    type === "movie"
      ? (item as IMovie).release_date
      : (item as ITVShow).first_air_date;

  return (
    <Link href={`/${type}/${item.id}`} asChild>
      <Pressable className="mb-4">
        <View className="flex-row bg-white/5 rounded-lg overflow-hidden h-32">
          <View className="w-24 h-full bg-neutral-900 items-center justify-center">
            {loading && (
              <ActivityIndicator size="small" color={Colors.accent} />
            )}
            <Image
              source={{ uri: imageUri(item?.poster_path as string, "w200") }}
              className="w-24 h-full absolute"
              resizeMode="cover"
              onLoadStart={() => setLoading(true)}
              onLoadEnd={() => setLoading(false)}
            />
          </View>
          <View className="flex-1 p-3">
            <Text
              className="text-text-primary font-bold text-base"
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text className="text-text-secondary mt-1" numberOfLines={2}>{item?.overview}</Text>
            <Text className="text-text-secondary text-sm mt-1">
              {new Date(releaseDate).getFullYear()}
            </Text>
            <View className="flex-row items-center mt-2">
              <Text className="text-accent font-bold text-sm mr-1">
                {item.vote_average.toFixed(1)}
              </Text>
              <Text className="text-text-secondary text-xs">/10</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
