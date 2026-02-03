import { useColorScheme } from "nativewind";
import React, { createContext, ReactNode, useContext, useEffect } from "react";

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

  useEffect(() => {
    setColorScheme("system");
  }, [setColorScheme]);

  const theme = colorScheme ?? "light";

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
