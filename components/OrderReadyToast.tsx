import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Easing,
  runOnJS,
} from "react-native-reanimated";
import { DeviceEventEmitter } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TOAST_DURATION = 5000;

const OrderReadyToast: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const soundRef = useRef<Audio.Sound | null>(null);
  
  const insets = useSafeAreaInsets();
  
  // Animation values
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(100);
  const checkScale = useSharedValue(0);
  const checkRotate = useSharedValue(-30);

  useEffect(() => {
    // Pre-load audio
    async function loadSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("../assets/sounds/ding.mp3")
        );
        soundRef.current = sound;
      } catch (e) {
        console.log("Audio file not found, skipping pre-load. Make sure assets/sounds/ding.mp3 exists.");
      }
    }
    loadSound();

    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  useEffect(() => {
    const handleReady = async (data: { restaurantName: string }) => {
      setRestaurantName(data.restaurantName || "Gram Bistro");
      
      if (soundRef.current) {
        try {
          await soundRef.current.replayAsync();
        } catch (e) {
          console.log("Could not play sound", e);
        }
      }

      // Reset animation values
      progressWidth.value = 100;
      checkScale.value = 0;
      checkRotate.value = -30;
      
      // Animate in
      setVisible(true);
      translateY.value = withSpring(insets.top > 0 ? insets.top + 10 : 30, { damping: 15, stiffness: 200 });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Animate checkmark
      checkScale.value = withDelay(150, withSpring(1, { damping: 12, stiffness: 250 }));
      checkRotate.value = withDelay(150, withSpring(0, { damping: 12, stiffness: 250 }));

      // Animate progress bar
      progressWidth.value = withTiming(0, { duration: TOAST_DURATION, easing: Easing.linear });

      // Animate out after duration
      setTimeout(() => {
        closeToast();
      }, TOAST_DURATION);
    };

    const subscription = DeviceEventEmitter.addListener("order-batch-ready", handleReady);
    
    return () => {
      subscription.remove();
    };
  }, [insets.top]);

  const closeToast = () => {
    translateY.value = withTiming(-150, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    });
  };

  const containerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  const checkStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: checkScale.value },
        { rotate: `${checkRotate.value}deg` }
      ],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <TouchableOpacity 
        activeOpacity={0.9} 
        onPress={closeToast}
        style={styles.toastBox}
      >
        <Animated.View style={[styles.iconContainer, checkStyle]}>
          <Ionicons name="checkmark-circle" size={28} color="#10b981" />
        </Animated.View>

        <View style={styles.textContainer}>
          <Text style={styles.title}>
            {restaurantName}: Order Ready! 🎉
          </Text>
          <Text style={styles.subtitle}>
            Your food is ready — enjoy your meal!
          </Text>
        </View>

        <Animated.View style={[styles.progressBar, progressStyle]} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    alignItems: "center",
  },
  toastBox: {
    width: "92%",
    maxWidth: 420,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.3)",
    overflow: "hidden", // for progress bar
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#059669",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: "#4b5563",
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 4,
    backgroundColor: "rgba(16, 185, 129, 0.6)",
    borderBottomLeftRadius: 16,
  },
});

export default OrderReadyToast;
