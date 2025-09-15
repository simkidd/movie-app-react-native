import React from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Loading } from "@/components/Loading";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading size="large" />;
  }

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    />
  );
}
