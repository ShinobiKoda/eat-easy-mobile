import React from "react";
import { KeyboardAvoidingView, Platform, ViewStyle } from "react-native";

interface KeyboardAvoidingViewWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  behavior?: "height" | "position" | "padding";
  keyboardVerticalOffset?: number;
}

const KeyboardAvoidingViewWrapper: React.FC<
  KeyboardAvoidingViewWrapperProps
> = ({ children, style, behavior, keyboardVerticalOffset }) => {
  return (
    <KeyboardAvoidingView
      style={[{ flex: 1 }, style]}
      behavior={behavior || (Platform.OS === "ios" ? "padding" : "height")}
      keyboardVerticalOffset={
        keyboardVerticalOffset || (Platform.OS === "ios" ? 40 : 0)
      }
    >
      {children}
    </KeyboardAvoidingView>
  );
};

export default KeyboardAvoidingViewWrapper;
