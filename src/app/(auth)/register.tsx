// app/(auth)/register.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Link, router } from "expo-router";
import { register } from "@/services/auth";
import { Feather, FontAwesome } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [confirmSecureTextEntry, setConfirmSecureTextEntry] = useState(true);

  const handleRegister = async () => {
    if (
      !displayName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert("Validation Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match");
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Validation Error",
        "Password should be at least 6 characters"
      );
      return;
    }

    try {
      setLoading(true);
      await register(email, password, displayName);
      router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-primary"
    >
      <View className="flex-1 p-6 justify-center">
        <Text className="text-3xl font-bold text-white mb-8 text-center">
          Create Account
        </Text>

        <View className="mb-4">
          <Text className="text-text-secondary mb-2">Full Name</Text>
          <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-3">
            <Feather name="user" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-text-secondary mb-2">Email</Text>
          <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-3">
            <Feather name="mail" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              className="flex-1 text-white"
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

        <View className="mb-4">
          <Text className="text-text-secondary mb-2">Password</Text>
          <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-3">
            <Feather name="lock" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Enter your password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={secureTextEntry}
            />
            <Pressable onPress={() => setSecureTextEntry(!secureTextEntry)}>
              <Feather
                name={secureTextEntry ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          </View>
          <Text className="text-text-secondary text-xs mt-1">
            Minimum 6 characters
          </Text>
        </View>

        <View className="mb-6">
          <Text className="text-text-secondary mb-2">Confirm Password</Text>
          <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-3">
            <Feather name="lock" size={20} color="#9CA3AF" className="mr-3" />
            <TextInput
              className="flex-1 text-white"
              placeholder="Confirm your password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={confirmSecureTextEntry}
            />
            <Pressable
              onPress={() => setConfirmSecureTextEntry(!confirmSecureTextEntry)}
            >
              <Feather
                name={confirmSecureTextEntry ? "eye-off" : "eye"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          </View>
        </View>

        <Pressable
          className="bg-accent p-4 rounded-full items-center mb-6"
          onPress={handleRegister}
          disabled={loading}
        >
          <Text className="text-white font-bold text-lg">
            {loading ? "Creating account..." : "Create Account"}
          </Text>
        </Pressable>

        <View className="flex-row items-center justify-center mb-6">
          <View className="flex-1 h-px bg-gray-600" />
          <Text className="mx-4 text-text-secondary">OR</Text>
          <View className="flex-1 h-px bg-gray-600" />
        </View>

        <Pressable className="flex-row items-center justify-center border border-gray-600 p-4 rounded-full mb-8">
          <FontAwesome name="google" size={20} color="white" className="mr-3" />
          <Text className="text-white font-bold">Continue with Google</Text>
        </Pressable>

        <View className="flex-row justify-center">
          <Text className="text-text-secondary">Already have an account? </Text>
          <Link href="/login" asChild>
            <Pressable>
              <Text className="text-accent font-bold">Login</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
