import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";
import "./global.css";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const App = ({ onLayout }: { onLayout: () => void }) => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0f0f0f",
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
};

const AppLayout = () => {
  const { loading } = useAuth();

  // hide splash once auth loading is done
  const onLayoutRootView = useCallback(async () => {
    if (!loading) {
      await SplashScreen.hideAsync();
    }
  }, [loading]);

  if (loading) {
    // while loading, keep splash visible (render nothing yet)
    return null;
  }

  return <App onLayout={onLayoutRootView} />;
};

const RootLayout = () => {
  return (
    <AuthProvider>
      <QueryProvider>
        <GestureHandlerRootView>
          <AppLayout />
          <Toaster position="top-center" richColors />
        </GestureHandlerRootView>
      </QueryProvider>
    </AuthProvider>
  );
};

export default RootLayout;
