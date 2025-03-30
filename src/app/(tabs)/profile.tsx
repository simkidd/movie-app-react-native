import { View, Text, Image, Pressable, ScrollView } from "react-native";
import { Link, useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/colors";

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutUser();
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-primary p-4">
        <Text className="text-text-primary text-lg mb-4">
          You're not logged in
        </Text>
        <Link href="/login" asChild>
          <Pressable className="bg-accent px-6 py-3 rounded-lg">
            <Text className="text-white font-bold">Login</Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-primary">
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{
              uri: user.photoURL || "https://i.imgur.com/3Zq3Z8m.png",
            }}
            className="w-32 h-32 rounded-full border-4 border-accent"
          />
          <Pressable
            className="absolute bottom-0 right-0 bg-accent p-2 rounded-full"
            onPress={() => console.log("Edit profile")}
          >
            <Ionicons name="camera" size={20} color="white" />
          </Pressable>
        </View>

        <Text className="text-text-primary text-2xl font-bold mt-4">
          {user.displayName || "Anonymous User"}
        </Text>
        <Text className="text-text-secondary mt-1">{user.email}</Text>
      </View>

      <View className="px-4 mt-8">
        <Text className="text-text-primary text-xl font-bold mb-4">
          Account Settings
        </Text>

        <Pressable
          className="flex-row items-center py-4 border-b border-gray-800"
          onPress={() => router.push("/profile/edit")}
        >
          <Ionicons name="person" size={24} color={Colors.accent} />
          <Text className="text-text-primary ml-4 flex-1">Edit Profile</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>

        <Pressable
          className="flex-row items-center py-4 border-b border-gray-800"
          // onPress={() => router.push("/settings")}
        >
          <Ionicons name="settings" size={24} color={Colors.accent} />
          <Text className="text-text-primary ml-4 flex-1">Settings</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>

        <Pressable
          className="flex-row items-center py-4 border-b border-gray-800"
          // onPress={() => router.push("/help")}
        >
          <Ionicons name="help-circle" size={24} color={Colors.accent} />
          <Text className="text-text-primary ml-4 flex-1">Help & Support</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>

      <View className="px-4 mt-8">
        <Pressable
          className="bg-red-500/10 p-4 rounded-lg items-center"
          onPress={handleLogout}
        >
          <Text className="text-red-500 font-bold">Log Out</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default Profile;
