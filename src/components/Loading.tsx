import { Colors } from "@/constants/colors";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export function Loading({ size = "large" }: { size?: "small" | "large" }) {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-primary">
      <ActivityIndicator size={size} color={Colors.accent} />
    </SafeAreaView>
  );
}
