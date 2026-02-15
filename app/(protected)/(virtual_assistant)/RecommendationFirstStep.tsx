import {
  ScaleOnPressView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const feelings = [
  {
    name: "Thirsty",
    emoji: "🥵",
  },
  {
    name: "Hungry",
    emoji: "😩",
  },
  {
    name: "Tired",
    emoji: "🫩",
  },
  {
    name: "Angry",
    emoji: "😡",
  },
  {
    name: "Bored",
    emoji: "😔",
  },
  {
    name: "Sick",
    emoji: "🤧",
  },
  {
    name: "Energized",
    emoji: "😁",
  },
  {
    name: "Other",
    emoji: "😁",
  },
];

const RecommendationFirstStep = () => {
  const [selectedFeelings, setSelectedFeelings] = useState<string[]>([]);
  const router = useRouter();

  return (
    <AppLayout backButton={true} title="Step 1">
      <View className="bg-neutral-150 dark:bg-neutral-700 w-full rounded-md h-2 my-6">
        {/* {Progress bar} */}
        <View className="bg-yellow-1 w-[33%] h-2 rounded-md"></View>
      </View>
      <SlideInUpView delay={100}>
        <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white mb-4">
          How are you feeling right now?
        </Text>
        <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150 mb-10">
          Select all that applies:
        </Text>
      </SlideInUpView>
      <SlideInUpView
        delay={300}
        className="flex flex-row items-center gap-3 flex-wrap flex-1"
      >
        {feelings.map((feeling) => {
          const isSelected = selectedFeelings.includes(feeling.name);
          return (
            <ScaleOnPressView
              key={feeling.name}
              onPress={() => {
                if (isSelected) {
                  setSelectedFeelings(
                    selectedFeelings.filter((f) => f !== feeling.name),
                  );
                } else {
                  setSelectedFeelings([...selectedFeelings, feeling.name]);
                }
              }}
              className={`px-[14px] py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 ${
                isSelected ? "bg-yellow-1" : "bg-white dark:bg-neutral-800"
              }`}
            >
              <Text
                className={`text-neutral-500 dark:text-neutral-150 font-mulish-medium text-base ${
                  isSelected ? "text-white dark:text-neutral-800" : ""
                }`}
              >
                {feeling.emoji} {feeling.name}
              </Text>
            </ScaleOnPressView>
          );
        })}
      </SlideInUpView>
      <SlideInUpView delay={500} className="py-8">
        <PrimaryButton
          text="Next"
          bgClass="bg-purple-2"
          textClass="text-white"
          onPress={() => {
            router.push(
              "/(protected)/(virtual_assistant)/RecommendationSecondStep",
            );
          }}
          disabled={selectedFeelings.length === 0}
        />
      </SlideInUpView>
    </AppLayout>
  );
};

export default RecommendationFirstStep;

const styles = StyleSheet.create({});
