import { Loading } from "@/components/Loading";
import { Colors } from "@/constants/colors";
import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    return <Loading size="small" />;
  }

  return (
    <SafeAreaView className="flex-1 bg-primary px-4">
      {/* Header */}
      <View className="items-center mt-8">
        <View className="relative">
          <Image
            source={{
              uri:
                user.photoURL ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
            }}
            className="w-32 h-32 rounded-full border-4 border-accent shadow-lg"
          />
          <Pressable
            className="absolute bottom-2 right-2 bg-accent p-2 rounded-full shadow-md"
            onPress={() => console.log("Edit profile picture")}
          >
            <Ionicons name="camera" size={20} color="white" />
          </Pressable>
        </View>

        <Text className="text-text-primary text-2xl font-bold mt-4">
          {user.displayName || "Anonymous User"}
        </Text>
        <Text className="text-text-secondary mt-1">{user.email}</Text>
      </View>

      {/* Account Section */}
      <View className="mt-10 bg-white/5 rounded-2xl overflow-hidden shadow-md">
        {[
          {
            label: "Edit Profile",
            icon: "person",
            action: () => {},
          },
          {
            label: "Settings",
            icon: "settings",
            action: () => {},
          },
          {
            label: "Help & Support",
            icon: "help-circle",
            action: () => {},
          },
        ].map((item, index) => (
          <Pressable
            key={index}
            className="flex-row items-center justify-between px-4 py-5 border-b border-white/10"
            onPress={item.action}
          >
            <View className="flex-row items-center space-x-3">
              <Ionicons
                name={item.icon as any}
                size={24}
                color={Colors.accent}
              />
              <Text className="text-text-primary text-base">{item.label}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
          </Pressable>
        ))}
      </View>

      {/* Logout */}
      <View className="mt-10">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-accent/10 py-4 rounded-xl items-center"
        >
          <Text className="text-accent font-bold text-base">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
