import { Colors } from "@/constants/colors";
import { View, ActivityIndicator } from "react-native";

export function Loading({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <ActivityIndicator size={size} color={Colors.accent} />
    </View>
  );
}
