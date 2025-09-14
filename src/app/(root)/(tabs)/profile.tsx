import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";

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
    return null;
  }

  return (
    <View className="flex-1 bg-primary py-4">
      <View className="items-center py-8">
        <View className="relative">
          <Image
            source={{
              uri:
                user.photoURL ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            }}
            className="w-32 h-32 rounded-full border-4 border-accent"
            resizeMode="cover"
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
          // onPress={() => router.push("/profile/edit")}
        >
          <Ionicons
            name="person"
            size={24}
            color={Colors.accent}
            className="mr-2"
          />
          <Text className="text-text-primary flex-1">Edit Profile</Text>
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
          <Ionicons
            name="settings"
            size={24}
            color={Colors.accent}
            className="mr-2"
          />
          <Text className="text-text-primary flex-1">Settings</Text>
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
          <Ionicons
            name="help-circle"
            size={24}
            color={Colors.accent}
            className="mr-2"
          />
          <Text className="text-text-primary flex-1">Help & Support</Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={Colors.textSecondary}
          />
        </Pressable>
      </View>

      <View className="px-4 mt-8">
        <TouchableOpacity
          onPress={handleLogout}
          className="p-4 rounded-lg items-center"
        >
          <Text className="text-accent font-bold">Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
