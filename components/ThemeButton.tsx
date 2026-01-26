import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable } from "react-native";
import { useTheme } from "../contexts/ThemeContext";

interface ThemeButtonProps {
  size?: number;
  style?: object;
  className?: string;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  size = 28,
  style,
  className,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Pressable
      onPress={toggleTheme}
      style={({ pressed }) => [
        {
          padding: 8,
          borderRadius: 9999,
          backgroundColor: theme === "dark" ? "#222" : "#f3f3f3",
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.7 : 1,
          position: "absolute",
          bottom: 0,
        },
        style,
      ]}
      className={className}
      accessibilityLabel="Toggle theme"
      accessibilityRole="button"
    >
      {theme === "dark" ? (
        <Ionicons name="sunny-outline" size={size} color="#FFD700" />
      ) : (
        <Ionicons name="moon-outline" size={size} color="#222" />
      )}
    </Pressable>
  );
};

export default ThemeButton;
