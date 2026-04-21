import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

const SplashScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Progress bar animation
  const progressWidth = useSharedValue(0);

  // Fade out the entire screen before navigating
  const screenOpacity = useSharedValue(1);

  // "Easy" scale bounce
  const easyScale = useSharedValue(0.96);

  useEffect(() => {
    // Animate progress bar over 3.2s
    progressWidth.value = withTiming(100, {
      duration: 3200,
      easing: Easing.bezier(0.25, 0.8, 0.25, 1),
    });

    // "Easy" text scale bounce
    easyScale.value = withDelay(
      200,
      withSequence(
        withTiming(1.02, { duration: 450, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 450, easing: Easing.out(Easing.quad) }),
      ),
    );

    // Fade out at 3.2s then navigate at 4s
    const fadeTimer = setTimeout(() => {
      screenOpacity.value = withTiming(0, { duration: 800 });
    }, 3200);

    const navTimer = setTimeout(() => {
      router.replace("/GetStarted");
    }, 4000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(navTimer);
    };
  }, [router]);

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const easyAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: easyScale.value }],
  }));

  return (
    <SafeAreaViewWrapper style={{ flex: 1 }}>
      <Animated.View
        style={[{ flex: 1, justifyContent: "center", alignItems: "center" }, screenAnimatedStyle]}
      >
        {/* Center content */}
        <Animated.View
          entering={FadeInUp.duration(700).easing(Easing.out(Easing.quad))}
          style={{ alignItems: "center", gap: 16, paddingHorizontal: 24 }}
        >
          {/* Welcome to */}
          <Animated.View entering={FadeIn.delay(0).duration(500)}>
            <Text
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: isDark ? "#EAEAEF" : "#8E8EA9",
              }}
              className="font-mulish-medium"
            >
              Welcome to
            </Text>
          </Animated.View>

          {/* Eat Easy */}
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Animated.View entering={FadeIn.delay(100).duration(600)}>
              <Text
                className="font-mulish-medium"
                style={{
                  fontSize: 40,
                  color: isDark ? "#EAEAEF" : "#4A4A6A",
                }}
              >
                Eat{" "}
              </Text>
            </Animated.View>
            <Animated.View style={easyAnimatedStyle}>
              <Animated.View entering={ZoomIn.delay(200).duration(500)}>
                <Text
                  className="font-mulish-bold"
                  style={{
                    fontSize: 40,
                    color: "#FF7B2C",
                  }}
                >
                  Easy
                </Text>
              </Animated.View>
            </Animated.View>
          </View>

          {/* Tagline */}
          <Animated.View entering={FadeIn.delay(300).duration(500)}>
            <Text
              className="font-mulish-medium"
              style={{
                fontSize: 14,
                color: isDark ? "#EAEAEF" : "#8E8EA9",
                textAlign: "center",
                maxWidth: 260,
              }}
            >
              Curating the perfect bite for you.
            </Text>
          </Animated.View>

          {/* Progress bar */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(400)}
            style={{
              marginTop: 16,
              height: 3,
              width: 160,
              borderRadius: 99,
              backgroundColor: isDark ? "#4A4A6A" : "#EAEAEF",
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={[
                {
                  height: "100%",
                  borderRadius: 99,
                  backgroundColor: "#FF7B2C",
                },
                progressAnimatedStyle,
              ]}
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </SafeAreaViewWrapper>
  );
};

export default SplashScreen;
