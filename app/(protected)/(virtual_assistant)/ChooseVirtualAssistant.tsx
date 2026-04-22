import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";

import React from "react";

const ChooseVirtualAssistant = () => {
  const router = useRouter();
  return (
    <AppLayout title="Virtual Assistant" backButton={true}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
      <View className="flex flex-col gap-6 flex-1">
        <FadeInView>
          <Image
            source={require("@/assets/images/virtual-assistant-empty.png")}
            style={{ width: "100%", height: 300 }}
            contentFit="cover"
          />
        </FadeInView>

        <SlideInUpView delay={200} className="px-6 mt-20">
          <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white text-center">
            Hello! 👋{" "}
          </Text>
          <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white text-center">
            I'm your virtual Assistant
          </Text>
          <Text className="font-mulish-medium text-neutral-600 dark:text-neutral-150 text-base text-center mt-[14px]">
            In order to find the best suited choices for you, please answer the
            next few questions.
          </Text>
        </SlideInUpView>
        <SlideInUpView delay={400} className="flex flex-col gap-3 px-6 py-8">
          <PrimaryButton
            text="Take me to the Menu"
            textClass="text-purple-3 dark:text-purple-5"
            onPress={() => {}}
          />
          <PrimaryButton
            text="Great, Let's Start"
            textClass="text-white"
            bgClass="bg-purple-2"
            onPress={() => {
              router.push(
                "/(protected)/(virtual_assistant)/MakeRecommendations",
              );
            }}
          />
        </SlideInUpView>
      </View>
      </ScrollView>
    </AppLayout>
  );
};

export default ChooseVirtualAssistant;
