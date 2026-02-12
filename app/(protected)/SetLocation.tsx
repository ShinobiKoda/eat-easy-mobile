import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const Welcome = () => {
  const router = useRouter();

  return (
    <AppLayout title="" showMenuButton={true} locationIcon={false}>
      <View className="flex-1 px-6 flex flex-col items-center justify-center">
        <Image
          source={require("@/assets/images/location-icon.png")}
          style={{ height: 70, width: 70, marginBottom: 32 }}
        />
        <Text className="text-center font-dm-medium text-neutral-800 text-[22px]">
          Share your Location with us to order.
        </Text>
        <Text className="text-center font-mulish-medium text-neutral-600 text-base mt-[14px]">
          Please enter your location or allow access to your location to find
          all restaurants that are near you{" "}
        </Text>

        <PrimaryButton
          text="Continue"
          bgClass="bg-purple-2 mt-[78px]"
          textClass="w-full text-white"
          onPress={() => router.push("/(protected)/Restaurants")}
        />
      </View>
    </AppLayout>
  );
};

export default Welcome;
