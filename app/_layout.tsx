import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "Mulish-Regular": require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-Semibold": require("../assets/fonts/Mulish-SemiBold.ttf"),
    "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="auto" translucent backgroundColor="transparent" />
        {!loaded && !error ? (
          <LoadingState />
        ) : (
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="GetStarted" options={{ headerShown: false }} />
            <Stack.Screen
              name="SignInOptions"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/CreateAccount"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/SignIn"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/ForgotPassword"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(auth)/VerifyCode"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          </Stack>
        )}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function LoadingState() {
  const { theme } = useTheme();

  return (
    <SafeAreaViewWrapper>
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator
          size="small"
          color={theme === "dark" ? "#FFFFFF" : "#32324D"}
        />
      </View>
    </SafeAreaViewWrapper>
  );
}
