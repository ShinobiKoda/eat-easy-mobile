import { SlideInUpView } from "@/components/animations/reanimated";
import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { supabase } from "@/lib/Supabase";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Alert, Text, View } from "react-native";

const SignInOptions = () => {
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("/auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No authentication URL returned");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const extract = (url: string, key: string) => {
          const regex = new RegExp(`${key}=([^&]*)`);
          const match = url.match(regex);
          return match ? match[1] : null;
        };

        const access_token = extract(result.url, "access_token");
        const refresh_token = extract(result.url, "refresh_token");

        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            Alert.alert("Session Error", sessionError.message);
            return;
          }

          router.replace("/Welcome");
          return;
        }

        Alert.alert("Login Error", "Tokens missing from URL.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
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
          disabled={true}
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
