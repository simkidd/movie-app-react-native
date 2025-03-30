import InitialLayout from "@/components/IntialLayout";
import { AuthProvider } from "@/contexts/AuthContext";
import QueryProvider from "@/providers/QueryProvider";
import React from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "./global.css";

const RootLayout = () => {
  return (
    <AuthProvider>
      <QueryProvider>
        <StatusBar className="bg-primary" />
        <SafeAreaProvider>
          <SafeAreaView className="flex-1 bg-primary">
            <InitialLayout />
          </SafeAreaView>
        </SafeAreaProvider>
      </QueryProvider>
    </AuthProvider>
  );
};

export default RootLayout;
