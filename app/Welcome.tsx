import { SlideInUpView } from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Welcome = () => {
  const router = useRouter();

  return (
    <AppLayout title="" showMenuButton={true} locationIcon={false}>
      <View className="flex-1 px-6 justify-center items-center">
        <SlideInUpView delay={100} className="items-center">
          <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={60} color="#10B981" />
          </View>

          <Text className="font-dm-bold text-[32px] text-neutral-800 text-center mb-4">
            Welcome to{"\n"}Eat Easy!
          </Text>

          <Text className="font-mulish-medium text-base text-neutral-600 text-center mb-10 px-4">
            Your account has been successfully verified. You are now ready to
            explore delicious food around you.
          </Text>
        </SlideInUpView>

        <SlideInUpView delay={300} className="w-full">
          <TouchableOpacity
            className="w-full bg-primary-btn py-4 rounded-2xl items-center"
            onPress={() => router.replace("/")} // Or navigate to Home/Dashboard
          >
            <Text className="text-white font-mulish-bold text-base">
              Get Started
            </Text>
          </TouchableOpacity>
        </SlideInUpView>
      </View>
    </AppLayout>
  );
};

export default Welcome;
