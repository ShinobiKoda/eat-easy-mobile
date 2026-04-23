import React, { useEffect } from "react";
import { View, Text, Modal, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
} from "react-native-reanimated";

type ProcessingPaymentProps = {
  isOpen: boolean;
};

const Dot = ({ delay }: { delay: number }) => {
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-8, { duration: 400 }),
          withTiming(0, { duration: 400 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
};

const ProcessingPayment: React.FC<ProcessingPaymentProps> = ({ isOpen }) => {
  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.content}>
          {/* Card icon placeholder */}
          <View style={styles.cardIcon}>
            <View style={styles.cardStripe} />
          </View>

          {/* Dots */}
          <View style={styles.dotsRow}>
            <Dot delay={0} />
            <Dot delay={150} />
            <Dot delay={300} />
          </View>

          {/* Text */}
          <Text style={styles.title}>Processing Payment</Text>
          <Text style={styles.subtitle}>
            Please wait while we process your transaction
          </Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 24,
  },
  cardIcon: {
    width: 96,
    height: 64,
    borderRadius: 12,
    backgroundColor: "#615793",
    justifyContent: "center",
    alignItems: "center",
  },
  cardStripe: {
    width: 56,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  dotsRow: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#a3a3a3",
    fontSize: 14,
  },
});

export default ProcessingPayment;
