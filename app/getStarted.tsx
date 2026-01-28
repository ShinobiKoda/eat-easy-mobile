import React from 'react';
import { StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import ThemeButton from "@/components/ThemeButton";
import { ProgressBar } from "@/components/ProgressBar";

const GetStarted = () => {
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
      </View>
    </SafeAreaViewWrapper>
  );
};

export default GetStarted;

const styles = StyleSheet.create({});