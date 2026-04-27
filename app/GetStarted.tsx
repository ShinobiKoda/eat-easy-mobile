import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import PrimaryButton from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { supabase } from "@/lib/Supabase";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";

const GetStarted = () => {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(false);

  const handleGetStarted = async () => {
    setIsChecking(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        // User already has an active session, skip sign-in
        router.replace("/(protected)/Homepage");
      } else {
        // No session, proceed with normal sign-up/sign-in flow
        router.push("/SignInOptions");
      }
    } catch {
      // On error, fall back to normal flow
      router.push("/SignInOptions");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <SafeAreaViewWrapper>
      <FadeInView className="w-full h-[432px]">
        <Image
          source={require("@/assets/images/getStarted-illustration.png")}
          contentFit="contain"
          style={{ flex: 1 }}
        />
      </FadeInView>

      <View className="w-full px-6 ">
        <ProgressBar />
        <SlideInUpView delay={200} className="flex flex-col gap-[14px] mt-8">
          <Text className="font-dm-medium text-center text-2xl text-neutral-800 dark:text-white">
            Full contactless experience
          </Text>
          <Text className="text-center font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
            From ordering to paying, that&apos;s all contactless
          </Text>
        </SlideInUpView>
        <SlideInUpView delay={400} className="flex flex-col gap-[10px] mt-8">
          <PrimaryButton
            text="Sign up later"
            onPress={() => router.push("/(protected)/Homepage")}
          />
          <PrimaryButton
            text={isChecking ? "Checking..." : "Get Started"}
            onPress={handleGetStarted}
            bgClass="bg-primary-btn"
            disabled={isChecking}
          />
        </SlideInUpView>
      </View>
    </SafeAreaViewWrapper>
  );
};

export default GetStarted;
