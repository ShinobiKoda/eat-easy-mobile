// theme.ts
import { ColorValue } from "react-native";

export const colors: Record<"light" | "dark", Record<string, ColorValue>> = {
  light: {
    background: "#ffffff",
    text: "#000000",
    primary: "#4f46e5",
    secondary: "#facc15",
  },
  dark: {
    background: "#000000",
    text: "#ffffff",
    primary: "#6366f1",
    secondary: "#fbbf24",
  },
};
