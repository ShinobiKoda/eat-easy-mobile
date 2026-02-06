import { SlideInUpView } from "@/components/animations/reanimated";
import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { supabase } from "@/lib/Supabase";
import { makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Text, View } from "react-native";

const SignInOptions = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      // Create a redirect URL that matches your app's scheme
      // Ensure 'eateasymobile' is in your Supabase -> Authentication -> URL Configuration -> Redirect URLs
      const redirectTo = makeRedirectUri({
        scheme: "eateasymobile",
      });

      console.log("Redirecting to:", redirectTo);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        Alert.alert("Error detected", error.message);
        return;
      }
      if (!data?.url) {
        Alert.alert("Error", "No authentication URL returned");
        return;
      }

      // Open the browser for authentication
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectTo,
      );

      if (result.type === "success" && result.url) {
        // Parse the URL to get the access_token and refresh_token
        // Supabase returns these as query parameters or hash fragment depending on config
        // Default for Implicit Grant involved in OAuth is usually hash fragment,
        // but PKCE (recommended) might be different.
        // With 'signInWithOAuth' and 'redirectTo', Supabase typically appends code or tokens.

        // Simple parser for hash fragment
        const url = result.url;

        // Check for error in URL
        if (url.includes("error=")) {
          Alert.alert("Sign in failed", "Google authentication failed.");
          return;
        }

        // We need to parse access_token and refresh_token from the URL
        const extractParam = (paramName: string) => {
          const regex = new RegExp(`[#?&]${paramName}=([^&]*)`);
          const match = url.match(regex);
          return match ? decodeURIComponent(match[1]) : null;
        };

        const accessToken = extractParam("access_token");
        const refreshToken = extractParam("refresh_token");

        if (accessToken && refreshToken) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            Alert.alert("Session Error", sessionError.message);
          } else {
            // Success!
            router.replace("/GetStarted"); // Or wherever you want to send them
          }
        } else {
          // If we don't see tokens, it might be an auth code flow (PKCE) which requires exchange code.
          // But supabase-js 'signInWithOAuth' with 'skipBrowserRedirect' usually returns implicit URL if used this way?
          // Actually, Supabase favors PKCE. If PKCE is on, we receive a 'code'.
          // However, handling 'code' exchange manually is complex.
          // EASIER: rely on 'detectSessionInUrl: false' implies we do it manually.

          // Let's check for 'code'
          Alert.alert("Check", "Received URL " + url);
        }
      }
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      Alert.alert("Error", error.message || "An unexpected error occurred");
    }
  };

  return (
    <SafeAreaViewWrapper className="w-full px-6">
      <SlideInUpView delay={100} className="w-full mt-[145px]">
        <Text className="text-center font-dm-medium text-[26px] text-neutral-800 dark:text-white">
          Let&apos;s Get Started 😁
        </Text>
        <Text className="mt-[14px] text-center font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
          Sign up or login into to have a full digital experience in our
          restaurant
        </Text>
      </SlideInUpView>
      <SlideInUpView delay={300} className="mt-[56px] flex flex-col gap-3">
        <PrimaryButton
          text="Get Started"
          bgClass="bg-primary-btn"
          onPress={() => router.push("/CreateAccount")}
        />
        <View className="w-full flex flex-row items-center justify-between">
          <View className="h-px bg-neutral-200 w-1/3"></View>
          <Text className="font-mulish-regular dark:text-purple-4">OR</Text>
          <View className="h-px bg-neutral-200 w-1/3"></View>
        </View>
        <PrimaryButton
          text="Continue with Facebook"
          textClass="text-purple-2 dark:text-purple-5"
          bgClass="bg-white dark:bg-neutral-800 dark:border dark:border-purple-3"
          imageSource={require("@/assets/images/facebook-icon.png")}
        />
        <PrimaryButton
          text="Continue with Gmail"
          textClass="text-purple-2 dark:text-purple-5"
          bgClass="bg-white dark:bg-neutral-800 dark:border dark:border-purple-3"
          imageSource={require("@/assets/images/gmail-icon.png")}
          onPress={handleGoogleSignIn}
        />
      </SlideInUpView>
    </SafeAreaViewWrapper>
  );
};

export default SignInOptions;
