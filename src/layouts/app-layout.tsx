import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Loading } from "../components/Loading";

interface Props {
  onLayout: () => void;
}

export default function AppLayout({ onLayout }: Props) {
  const { user, loading, showWelcome } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (showWelcome) {
      router.replace("/welcome");
      return;
    }

    // Existing authentication logic
    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)/");
    }
  }, [user, loading, segments, showWelcome]);

  // Show loading indicator while checking auth state
  if (loading) {
    return <Loading size="large" />;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0f0f",
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      onLayout={onLayout}
    >
      <StatusBar translucent backgroundColor="transparent" style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
    </View>
  );
}
