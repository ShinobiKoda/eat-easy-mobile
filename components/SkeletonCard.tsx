import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from "react-native-reanimated";

type SkeletonCardProps = {
  variant?: "vertical" | "horizontal";
};

const SkeletonCard: React.FC<SkeletonCardProps> = ({ variant = "vertical" }) => {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  if (variant === "vertical") {
    return (
      <Animated.View style={[styles.containerVertical, animatedStyle]}>
        <View style={styles.imageCircle} />
        <View style={styles.textLine1} />
        <View style={styles.textLine2} />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={[styles.containerHorizontal, animatedStyle]}>
      <View style={styles.imageSquare} />
      <View style={styles.textContainer}>
        <View style={styles.textLine1} />
        <View style={styles.textLine2} />
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  containerVertical: {
    width: "100%",
    alignItems: "center",
  },
  imageCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#e5e5e5",
    marginBottom: 12,
  },
  textLine1: {
    width: "80%",
    height: 16,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
    marginBottom: 8,
  },
  textLine2: {
    width: "60%",
    height: 16,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },
  containerHorizontal: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
  },
  imageSquare: {
    width: 64,
    height: 64,
    borderRadius: 8,
    backgroundColor: "#e5e5e5",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default SkeletonCard;
