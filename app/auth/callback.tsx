import { FadeInView } from "@/components/animations/reanimated";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { supabase } from "@/lib/Supabase";
import { createProfile } from "@/services/authService";
import { couponService } from "@/services/couponService";
import { getPostAuthRoute } from "@/lib/getPostAuthRoute";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Handles the redirect after Google OAuth sign-in.
 *
 * 1. Waits for the Supabase session to be established.
 * 2. Checks if the user already has a profile in `eat_easy_profile`.
 *    - Existing user → navigate to homepage.
 *    - New user → create profile, grant welcome coupon, navigate to set-location.
 */
const AuthCallback = () => {
  const router = useRouter();
  const processed = useRef(false);

  useEffect(() => {
    const handleCallback = async () => {
      if (processed.current) return;
      processed.current = true;

      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session?.user) {
          console.error("[AuthCallback] No session after OAuth redirect:", sessionError);
          router.replace("/SignInOptions");
          return;
        }

        const user = session.user;

        // Check if user already has a profile row
        const { data: existingProfile } = await supabase
          .from("eat_easy_profile")
          .select("user_id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (existingProfile) {
          // Existing user
          const route = await getPostAuthRoute();
          router.replace(route as any);
        } else {
          // New user — create profile from Google metadata
          const meta = user.user_metadata ?? {};
          await createProfile(
            {
              username: meta.full_name || meta.name || meta.email?.split("@")[0] || "",
              email: user.email ?? "",
              phone_number: meta.phone || "",
            },
            user.id,
          );

          // Grant 30% welcome coupon
          await couponService.grantWelcomeCoupon(user.id);
          await AsyncStorage.setItem("eat-easy-show-welcome-discount", "true");

          router.replace("/(protected)/SetLocation" as any);
        }
      } catch (err) {
        console.error("[AuthCallback] Error processing OAuth callback:", err);
        router.replace("/SignInOptions");
      }
    };

    handleCallback();
  }, []);

  return (
    <SafeAreaViewWrapper>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-800">
        <FadeInView delay={100} className="items-center gap-4">
          <ActivityIndicator size="large" color="#615793" />
          <Text className="font-mulish-medium text-lg text-neutral-600 dark:text-neutral-150">
            Completing sign in...
          </Text>
        </FadeInView>
      </View>
    </SafeAreaViewWrapper>
  );
};

export default AuthCallback;
