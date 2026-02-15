import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { Image } from "expo-image";
import { Text } from "react-native";

import React from "react";

const ChooseVirtualAssistant = () => {
  return (
    <SafeAreaViewWrapper>
      <FadeInView>
        <Image
          source={require("@/assets/images/virtual-assistant-empty.png")}
          style={{ width: "100%", height: 366 }}
          contentFit="cover"
        />
      </FadeInView>
      <SlideInUpView delay={200} className="px-6 flex-1">
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
      <SlideInUpView delay={400} className="flex flex-col gap-3 px-6 py-4">
        <PrimaryButton
          text="Take me to the Menu"
          textClass="text-purple-3 dark:text-purple-5"
          onPress={() => {}}
        />
        <PrimaryButton
          text="Great, Let's Start"
          textClass="text-white"
          bgClass="bg-purple-2"
          onPress={() => {}}
        />
      </SlideInUpView>
    </SafeAreaViewWrapper>
  );
};

export default ChooseVirtualAssistant;
