import { BlurView } from "expo-blur";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";

interface ConfirmationModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  loadingText?: string;
}

const ConfirmationModal = ({
  isVisible,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isLoading = false,
  loadingText = "Loading...",
}: ConfirmationModalProps) => {
  if (!isVisible && !isLoading) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center items-center bg-black/60">
        <BlurView
          intensity={20}
          tint="dark"
          style={{ position: "absolute", width: "100%", height: "100%" }}
        />

        <Animated.View
          entering={ZoomIn.duration(300)}
          exiting={ZoomOut.duration(200)}
          className="w-[85%] bg-white dark:bg-[#1E1E2D] rounded-3xl p-6 items-center shadow-xl"
        >
          {isLoading ? (
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              className="py-4 items-center gap-4"
            >
              <ActivityIndicator size="large" color="#FFB01D" />
              <Text className="text-neutral-600 dark:text-neutral-200 font-mulish-bold text-lg">
                {loadingText}
              </Text>
            </Animated.View>
          ) : (
            <>
              <Text className="text-xl font-dm-bold text-neutral-800 dark:text-white mb-3 text-center">
                {title}
              </Text>
              <Text className="text-base font-mulish-medium text-neutral-500 dark:text-neutral-400 text-center mb-8 leading-6">
                {message}
              </Text>

              <View className="flex-row w-full gap-4">
                <TouchableOpacity
                  onPress={onCancel}
                  className="flex-1 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-600 items-center justify-center bg-white dark:bg-transparent"
                >
                  <Text className="font-mulish-bold text-base text-neutral-600 dark:text-neutral-300">
                    {cancelText}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onConfirm}
                  className="flex-1 py-3.5 rounded-xl bg-orange-1 items-center justify-center shadow-orange-1/20 shadow-md"
                >
                  <Text className="font-mulish-bold text-base text-white">
                    {confirmText}
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ConfirmationModal;
