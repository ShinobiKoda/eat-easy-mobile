import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeOut, ZoomIn } from "react-native-reanimated";

type SuccessProps = {
  isOpen: boolean;
};

const Success: React.FC<SuccessProps> = ({ isOpen }) => {
  const router = useRouter();

  return (
    <Modal visible={isOpen} transparent animationType="fade">
      <View style={styles.backdrop}>
        <Animated.View entering={ZoomIn.duration(400)} style={styles.card}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="checkmark-circle" size={80} color="#FFB01D" />
          </View>

          {/* Text */}
          <Text style={styles.title}>Woohoo!</Text>
          <Text style={styles.subtitle}>Thank you for your payment!</Text>

          {/* Done Button */}
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.replace("/(protected)/OrderStatus" as any)}
          >
            <Text style={styles.doneText}>Done</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#2a2a4a",
    borderRadius: 24,
    padding: 40,
    width: "100%",
    alignItems: "center",
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#a3a3a3",
    marginBottom: 32,
    textAlign: "center",
  },
  doneButton: {
    backgroundColor: "#615793",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
  },
  doneText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Success;
