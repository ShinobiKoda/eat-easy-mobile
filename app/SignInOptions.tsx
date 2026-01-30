import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const SignInOptions = () => {
  const router = useRouter();

  return (
    <SafeAreaViewWrapper className="w-full px-6">
      <View className="w-full mt-[145px]">
        <Text className="text-center font-dm-medium text-[26px] text-neutral-800">
          Let's Get Started 😁
        </Text>
        <Text className="mt-[14px] text-center font-mulish-medium text-base text-neutral-600">
          Sign up or login into to have a full digital experience in our
          restaurant
        </Text>
      </View>
      <View className="mt-[56px] flex flex-col gap-3">
        <PrimaryButton text="Get Started" bgClass="bg-primary-btn" />
        <View className="w-full flex flex-row items-center justify-between">
          <View className="h-px bg-neutral-200 w-1/3"></View>
          <Text>OR</Text>
          <View className="h-px bg-neutral-200 w-1/3"></View>
        </View>
        <PrimaryButton
          text="Continue with Facebook"
          textClass="text-purple-2"
          bgClass="bg-white"
          imageSource={require("@/assets/images/facebook-icon.png")}
        />
        <PrimaryButton
          text="Continue with Gmail"
          textClass="text-purple-2"
          bgClass="bg-white"
        />
      </View>
    </SafeAreaViewWrapper>
  );
};

export default SignInOptions;

const styles = StyleSheet.create({});
