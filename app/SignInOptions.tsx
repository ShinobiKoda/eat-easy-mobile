import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import ThemeButton from "@/components/ThemeButton";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignInOptions = () => {
  const router = useRouter();

  return (
    <SafeAreaViewWrapper className="w-full px-6">
      <ThemeButton className="absolute top-6 right-4 z-20" />
      <View className="w-full mt-[145px]">
        <Text className="text-center font-dm-medium text-[26px] text-neutral-800 dark:text-white">
          Let&apos;s Get Started 😁
        </Text>
        <Text className="mt-[14px] text-center font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
          Sign up or login into to have a full digital experience in our
          restaurant
        </Text>
      </View>
      <View className="mt-[56px] flex flex-col gap-3">
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
        />
      </View>
    </SafeAreaViewWrapper>
  );
};

export default SignInOptions;
