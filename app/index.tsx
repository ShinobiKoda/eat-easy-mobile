import {
  FadeInView,
  PopInView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ThemeButton from "@/components/ThemeButton";

const SplashScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/getStarted");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View className="flex-1 relative">
        <ThemeButton />
        <FadeInView
          duration={1000}
          style={{ position: "absolute", top: 0, left: 0, zIndex: -1 }}
        >
          <Image
            source={require("@/assets/images/splash-img-left.png")}
            contentFit="contain"
            style={{ width: 248, height: 418 }}
          />
        </FadeInView>

        <FadeInView
          duration={1000}
          delay={200}
          style={{ position: "absolute", bottom: 0, right: 0, zIndex: -1 }}
        >
          <Image
            source={require("@/assets/images/splash-img-right.png")}
            contentFit="contain"
            style={{ width: 248, height: 418 }}
          />
        </FadeInView>

        <View className="absolute bottom-[42px] ml-[39px]">
          <SlideInUpView delay={400}>
            <Text className="font-mulish-medium text-neutral-700 text-[60px]">
              Eat
            </Text>
          </SlideInUpView>
          <PopInView delay={700}>
            <Text className="font-mulish-medium text-orange-1 text-[60px]">
              Easy
            </Text>
          </PopInView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
