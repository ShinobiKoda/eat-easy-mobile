import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { LocationProvider } from "@/contexts/LocationContext";
import { getPostAuthRoute } from "@/lib/getPostAuthRoute";
import { supabase } from "@/lib/Supabase";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../contexts/ThemeContext";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [initialized, setInitialized] = useState(false);
  const segments = useSegments() as string[];
  const router = useRouter();

  const [loaded, error] = useFonts({
    "Mulish-Regular": require("../assets/fonts/Mulish-Regular.ttf"),
    "Mulish-Medium": require("../assets/fonts/Mulish-Medium.ttf"),
    "Mulish-Bold": require("../assets/fonts/Mulish-Bold.ttf"),
    "Mulish-Semibold": require("../assets/fonts/Mulish-SemiBold.ttf"),
    "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
  });

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  useEffect(() => {
    if (!initialized || !loaded) return;

    const inAuthGroup = segments[0] === "(auth)";
    const isPublicRoute =
      segments[0] === "GetStarted" ||
      segments[0] === "SignInOptions" ||
      segments.length === 0;

    if (session) {
      const isVerified = session.user.user_metadata?.email_verified === true;

      if (isVerified && (inAuthGroup || isPublicRoute)) {
        getPostAuthRoute().then((route) => {
          router.replace(route as any);
        });
      } else if (!isVerified && isPublicRoute) {
      }
    }
  }, [session, segments, initialized, loaded]);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LocationProvider>
          <StatusBar
            style="auto"
            translucent
            backgroundColor="transparent"
            hidden
          />
          {!loaded && !error ? (
            <LoadingState />
          ) : (
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen
                name="GetStarted"
                options={{ headerShown: false }}
              />
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
              <Stack.Screen
                name="(protected)"
                options={{ headerShown: false }}
              />
            </Stack>
          )}
        </LocationProvider>
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
