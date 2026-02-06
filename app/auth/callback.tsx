import { FadeInView } from "@/components/animations/reanimated";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";


const AuthCallback = () => {
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
