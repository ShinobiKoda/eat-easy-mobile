import React, { createContext, useContext, useEffect, ReactNode } from "react";
import { useColorScheme } from "nativewind";
import { Appearance } from "react-native";


interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const { colorScheme, setColorScheme, toggleColorScheme } = useColorScheme();

  // 1. Listen for System Theme Changes
  useEffect(() => {
    // Set initial theme based on system
    const systemTheme = Appearance.getColorScheme();
    if (systemTheme) {
      setColorScheme(systemTheme);
    }

    // Subscribe to changes while the app is open
    const subscription = Appearance.addChangeListener(({ colorScheme: nextScheme }) => {
      if (nextScheme) {
        setColorScheme(nextScheme);
      }
    });

    return () => subscription.remove();
  }, [setColorScheme]);

  const theme = colorScheme ?? "light";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);