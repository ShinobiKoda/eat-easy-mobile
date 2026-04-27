import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { LocationProvider } from "@/contexts/LocationContext";
import { RestaurantProvider } from "@/contexts/RestaurantContext";
import { OrderProvider } from "@/contexts/OrderContext";
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
import OrderBatchMonitor from "../components/dashboard/OrderBatchMonitor";
import OrderReadyToast from "../components/OrderReadyToast";
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
          <RestaurantProvider>
            <OrderProvider>
              <StatusBar
                style="auto"
                translucent
                backgroundColor="transparent"
                hidden
              />
              {!loaded && !error ? (
                <LoadingState />
              ) : (
                <>
                  <StackWithTheme />
                  <OrderBatchMonitor />
                  <OrderReadyToast />
                </>
              )}
            </OrderProvider>
          </RestaurantProvider>
        </LocationProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function StackWithTheme() {
  const { theme } = useTheme();
  // Match the SafeAreaViewWrapper gradient base color
  const bgColor = theme === "dark" ? "#32324D" : "#F7F7F7";

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bgColor },
        animation: "fade",
        animationDuration: 200,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="GetStarted" />
      <Stack.Screen name="SignInOptions" />
      <Stack.Screen name="(auth)/CreateAccount" />
      <Stack.Screen name="(auth)/SignIn" />
      <Stack.Screen name="(auth)/ForgotPassword" />
      <Stack.Screen name="(auth)/VerifyCode" />
      <Stack.Screen name="(protected)" />
    </Stack>
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
