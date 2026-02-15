import {
  ScaleOnPressView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import { ArrowForwardIcon } from "@/components/icons/Icons";
import AppLayout from "@/components/layout/AppLayout";
import { useTheme } from "@/contexts/ThemeContext";
import { reverseGeocode } from "@/lib/tomtom";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

const HomePageOptions = [
  {
    image_url: require("@/assets/images/bulb-icon.png"),
    title: "Choose Virtual Assistant",
    description: "Simplify your decisions through our Smart Menu",
    navigateTo: "/ChooseVirtualAssistant",
  },
  {
    image_url: require("@/assets/images/book-icon.png"),
    title: "Go to the menu",
    description: "If you already know what to order, this is the best choice",
    navigateTo: "/ChooseVirtualAssistant",
  },
];

const Homepage = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [locationName, setLocationName] = useState("Locating...");
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLocationName("Permission denied");
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const address = await reverseGeocode(latitude, longitude);
        setLocationName(address);
      } catch (error) {
        console.error("Error fetching location:", error);
        setLocationName("Unknown Location");
      }
    })();
  }, []);

  return (
    <AppLayout title={locationName} locationIcon={true}>
      <SlideInUpView delay={100}>
        <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white text-center mt-3">
          Let's find the perfect dish for you
        </Text>
      </SlideInUpView>
      <View className="mt-6 flex flex-col gap-6">
        {HomePageOptions.map((option, index) => (
          <SlideInUpView
            key={index}
            delay={300 + index * 200}
            className="p-5 shadow-sm flex flex-col rounded-2xl bg-white dark:bg-neutral-700"
          >
            <Image
              source={option.image_url}
              alt={option.title}
              style={{ width: 70, height: 70, marginBottom: 20 }}
            />
            <View className="flex flex-row justify-between items-center">
              <View className="max-w-[225px] flex flex-col gap-3">
                <Text className="font-mulish-semibold text-base text-neutral-900 dark:text-white">
                  {option.title}
                </Text>
                <Text className="font-mulish-medium text-neutral-500 text-sm dark:text-neutral-300">
                  {option.description}
                </Text>
              </View>
              <ScaleOnPressView
                onPress={() => router.push(option.navigateTo as any)}
                className="w-[46px] h-[46px] rounded-xl bg-orange-5 dark:bg-orange-1 flex items-center justify-center"
              >
                <ArrowForwardIcon color={isDark ? "#fff" : "#FF7B2C"} />
              </ScaleOnPressView>
            </View>
          </SlideInUpView>
        ))}
      </View>
    </AppLayout>
  );
};

export default Homepage;
