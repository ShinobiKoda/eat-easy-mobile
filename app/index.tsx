import { Image } from "expo-image";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";

const SplashScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* This View is the "anchor" for all absolute children */}
      <View className="flex-1 relative">
        {/* Left Image */}
        <Image
          source={require("@/assets/images/splash-img-left.png")}
          contentFit="contain"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 248,
            height: 418,
            zIndex: -1
          }}
        />

        <Image
          source={require("@/assets/images/splash-img-right.png")}
          contentFit="contain"
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: 248,
            height: 418,
            zIndex: -1
          }}
        />

     
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
