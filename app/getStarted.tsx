import PrimaryButton from "@/components/PrimaryButton";
import { ProgressBar } from "@/components/ProgressBar";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import ThemeButton from "@/components/ThemeButton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const GetStarted = () => {
  const router = useRouter();

  return (
    <SafeAreaViewWrapper>
      <ThemeButton className="absolute right-0 top-4 z-50" />

      <View className="w-full h-[432px]">
        <Image
          source={require("@/assets/images/getStarted-illustration.png")}
          contentFit="contain"
          style={{ flex: 1 }}
        />
      </View>

      <View className="w-full px-6 ">
        <ProgressBar />
        <View className="flex flex-col gap-[14px] mt-8">
          <Text className="font-dm-medium text-center text-2xl text-neutral-800 dark:text-white">
            Full contactless experience
          </Text>
          <Text className="text-center font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
            From ordering to paying, that's all contactless
          </Text>
        </View>
        <View className="flex flex-col gap-[10px] mt-8">
          <View className="px-6 py-4 w-full">
            <Text className="text-center font-mulish-semibold text-base text-purple-3 dark:text-purple-5">
              Sign up later
            </Text>
          </View>
          <PrimaryButton
            text="Get Started"
            onPress={() => router.replace("/SignInOptions")}
            bgClass="bg-primary-btn"
          />
        </View>
      </View>
    </SafeAreaViewWrapper>
  );
};

export default GetStarted;

const styles = StyleSheet.create({});
