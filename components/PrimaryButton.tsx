import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScaleOnPressView } from "./animations/reanimated";

interface PrimaryButtonProps {
  text: string;
  onPress?: () => void;
  bgClass?: string;
  textClass?: string;
  leftIcon?: React.ReactNode;
}

const PrimaryButton = ({
  text,
  onPress,
  bgClass = "bg-primary-btn-light dark:bg-primary-btn-dark",
  textClass = "text-white",
  leftIcon,
}: PrimaryButtonProps) => {
  return (
    <ScaleOnPressView
      className={`px-6 py-4 w-full ${bgClass} rounded-2xl`}
      onPress={onPress}
    >
      <View className="flex flex-row items-center justify-center">
        {leftIcon && <View className="mr-2">{leftIcon}</View>}
        <Text
          className={`text-center font-mulish-semibold text-base ${textClass}`}
        >
          {text}
        </Text>
      </View>
    </ScaleOnPressView>
  );
};

export default PrimaryButton;

const styles = StyleSheet.create({});
