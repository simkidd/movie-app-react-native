import { ActivityIndicator, View } from "react-native";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import { Loading } from "./Loading";

export default function InitialLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      // User not authenticated and not on auth screen - redirect to login
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      // User authenticated but on auth screen - redirect to tabs
      router.replace("/(tabs)");
    }
    // If user is authenticated and not on auth screen, or
    // not authenticated and on auth screen, do nothing
  }, [user, loading, segments]);

  // Show loading indicator while checking auth state
  if (loading) {
    return <Loading size="large" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
