import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  SafeAreaView,
  SafeAreaViewProps,
} from "react-native-safe-area-context";

export function SafeAreaViewWrapper({
  children,
  style,
  className,
  ...rest
}: SafeAreaViewProps & { className?: string }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // 1. Define the sets as constants so TS knows their exact length
  const light = {
    colors: ["#FCFCFC", "#F7F7F7", "#F7F7F7", "#F7F7F7", "#FCFCFC"] as const,
    locations: [0, 0.1, 0.52, 0.9, 1] as const,
  };

  const dark = {
    colors: ["#32324D", "#32324D", "#2C2C45", "#32324D"] as const,
    locations: [0, 0.1, 0.52, 0.9] as const,
  };

  // 2. Select the configuration based on the theme
  const config = isDark ? dark : light;

  return (
    <SafeAreaView
      // style={[{ flex: 1 }, style]} handles the outer container
      style={[{ flex: 1 }, style]}
      {...rest}
    >
      <LinearGradient
        colors={config.colors}
        locations={config.locations}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        // Ensure the gradient itself fills the SafeAreaView
        style={{ flex: 1 }}
        className={`flex-1 ${className || ""}`}
      >
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
}
