import { View, Text } from "react-native";
import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/Loading";

export default function ProtectedLayout() {
  const { isAuthenticated, showWelcome, loading } = useAuth();

  // Show loading while auth state is being determined
  if (loading) {
    return <Loading size="large" />;
  }

  // Redirect to welcome screen if user hasn't completed it
  if (showWelcome) {
    return <Redirect href="/welcome" />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
