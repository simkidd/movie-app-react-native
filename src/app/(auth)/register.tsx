import { useAuth } from "@/contexts/AuthContext";
import { register } from "@/services/auth";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
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
import { toast } from "sonner-native";

export default function RegisterScreen() {
  const { loginUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const [confirmShowPassword, setConfirmShowPassword] = useState(true);

  const handleRegister = async () => {
    Keyboard.dismiss();
    if (
      !displayName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      const res = await register(email, password, displayName);

      if (res) {
        await loginUser(email, password);
      }
    } catch (error: any) {
      toast.error(error.message);
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
              Create Account
            </Text>

            <View className="mb-4">
              <Text className="text-text-secondary mb-2">Full Name</Text>
              <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-2">
                <Feather
                  name="user"
                  size={20}
                  color="#9CA3AF"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-white text-lg"
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

            <View className="mb-4">
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
              <Text className="text-text-secondary text-xs mt-1">
                Minimum 6 characters
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-text-secondary mb-2">Confirm Password</Text>
              <View className="flex-row items-center bg-white/10 rounded-lg px-4 py-2">
                <Feather
                  name="lock"
                  size={20}
                  color="#9CA3AF"
                  className="mr-3"
                />
                <TextInput
                  className="flex-1 text-white text-lg"
                  placeholder="Confirm your password"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={confirmShowPassword}
                />
                <Pressable
                  onPress={() => setConfirmShowPassword(!confirmShowPassword)}
                >
                  <Feather
                    name={confirmShowPassword ? "eye-off" : "eye"}
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

            {/* <View className="flex-row items-center justify-center mb-6">
          <View className="flex-1 h-px bg-gray-600" />
          <Text className="mx-4 text-text-secondary">OR</Text>
          <View className="flex-1 h-px bg-gray-600" />
        </View> */}

            {/* <Pressable className="flex-row items-center justify-center border border-gray-600 p-4 rounded-full mb-8">
          <FontAwesome name="google" size={20} color="white" className="mr-3" />
          <Text className="text-white font-bold">Continue with Google</Text>
        </Pressable> */}

            <View className="flex-row justify-center">
              <Text className="text-text-secondary text-lg">
                Already have an account?{" "}
              </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-accent font-bold text-lg">Login</Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
