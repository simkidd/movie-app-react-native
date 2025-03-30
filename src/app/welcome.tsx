import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Marquee } from "@animatereactnative/marquee";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const WelcomeScreen = () => {
  const router = useRouter();

  const imageList = [
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
    require("../assets/images/highlight.png"),
  ];

  return (
    <GestureHandlerRootView>
      <SafeAreaView className="flex-1 bg-primary">
        <Marquee
          spacing={10}
          speed={0.7}
          style={{
            transform: [{ rotate: "-4deg" }],
          }}
        >
          <View className="flex flex-row gap-[10px]">
            {[Array(9)].map((_, i) => (
              <View
                key={i}
                className="w-[160px] h-[160px] bg-accent rounded-3xl"
              ></View>
            ))}
            {/* {imageList.map((image, i) => (
              <Image
                key={i}
                source={image}
                className="w-[160px] h-[160px] rounded-3xl"
              />
            ))} */}
          </View>
        </Marquee>
        <Marquee
          spacing={10}
          speed={0.4}
          style={{
            transform: [{ rotate: "-4deg" }],
            marginTop: 10,
          }}
        >
          <View className="flex flex-row gap-[10px]">
            {/* {imageList.map((image, i) => (
              <Image
                key={i}
                source={image}
                className="w-[160px] h-[160px] rounded-3xl"
              />
            ))} */}
            {[Array(9)].map((_, i) => (
              <View
                key={i}
                className="w-[160px] h-[160px] bg-accent rounded-3xl"
              ></View>
            ))}
          </View>
        </Marquee>
        <Marquee
          spacing={10}
          speed={0.5}
          style={{
            transform: [{ rotate: "-4deg" }],
            marginTop: 10,
          }}
        >
          <View className="flex flex-row gap-[10px]">
            {/* {imageList.map((image, i) => (
              <Image
                key={i}
                source={image}
                className="w-[160px] h-[160px] rounded-3xl"
              />
            ))} */}
            {[Array(9)].map((_, i) => (
              <View
                key={i}
                className="w-[160px] h-[160px] bg-accent rounded-3xl"
              ></View>
            ))}
          </View>
        </Marquee>
        <View className="flex-1 flex justify-center p-6">
          <Text className="text-5xl text-white font-bold text-center">
            Unlimited Movies, TV shows, and more.
          </Text>
          <Text className="text-center text-text-secondary text-xl mt-2">
            Watch anywhere. Watch anytime.
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/register")}
            className="p-4 bg-accent rounded-full mb-4 mt-4"
          >
            <Text className="text-white font-bold text-lg text-center">
              Get Started
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center">
            <Text className="text-text-secondary font-semibold">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text className="text-accent font-bold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default WelcomeScreen;
