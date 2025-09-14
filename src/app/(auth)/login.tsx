import { Loading } from "@/components/Loading";
import { useAuth } from "@/contexts/AuthContext";
import { googleSignIn, login } from "@/services/auth";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return <Loading size="small" />;
  }

  const handleLogin = async () => {
    Keyboard.dismiss();

    if (!email.trim() || !password.trim()) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            padding: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="items-center mt-10">
            <Image
              source={require("../../assets/images/logo-icon-removebg-preview.png")}
              className="h-12"
              resizeMode="contain"
              accessibilityLabel="App logo"
            />
          </View>
          <View className="flex-1 justify-center">
            <Text className="text-3xl font-bold text-white mb-8 text-center">
              Welcome Back
            </Text>

            <View className="mb-6">
              <Text className="text-text-secondary mb-2">Email</Text>
              <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-2">
                <Feather
                  name="mail"
                  size={20}
                  color="#9CA3AF"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-white text-lg"
                  placeholder="Enter your email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View className="mb-8">
              <Text className="text-text-secondary mb-2">Password</Text>
              <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-2">
                <Feather
                  name="lock"
                  size={20}
                  color="#9CA3AF"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-white text-lg"
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={showPassword}
                />
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? "eye-off" : "eye"}
                    size={20}
                    color="#9CA3AF"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              className="bg-accent p-4 rounded-full items-center mb-6"
              onPress={handleLogin}
              disabled={loading}
            >
              <Text className="text-white font-bold text-lg">
                {loading ? "Loading..." : "Login"}
              </Text>
            </Pressable>

            {/* <View className="flex-row items-center justify-center mb-6">
          <View className="flex-1 h-px bg-gray-600" />
          <Text className="mx-4 text-text-secondary">OR</Text>
          <View className="flex-1 h-px bg-gray-600" />
        </View> */}

            {/* <Pressable
          className="flex-row items-center justify-center border border-gray-600 p-4 rounded-full mb-4"
          onPress={() => googleSignIn()}
        >
          <FontAwesome name="google" size={20} color="white" className="mr-3" />
          <Text className="text-white font-bold">Continue with Google</Text>
        </Pressable> */}

            <View className="flex-row justify-center">
              <Text className="text-text-secondary text-lg">
                Don't have an account?{" "}
              </Text>
              <Link href="/register" asChild>
                <Pressable>
                  <Text className="text-accent font-bold text-lg">Sign up</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
