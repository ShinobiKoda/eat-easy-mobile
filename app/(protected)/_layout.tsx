import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/Supabase";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedLayout() {
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    if (!session) {
      // Redirect to sign-in if not authenticated
      router.replace("/(auth)/SignIn");
    }
  }, [session, isLoading]);

  const { theme } = useTheme();
  const bgColor = theme === "dark" ? "#32324D" : "#F7F7F7";

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: bgColor }}>
        <ActivityIndicator size="large" color={theme === "dark" ? "#fff" : "#32324D"} />
      </View>
    );
  }

  // If session exists, render the child route
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: bgColor },
        animation: "fade",
        animationDuration: 200,
      }}
    />
  );
}
