import {
  ScaleOnPressView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const companions = [
  {
    name: "Solo",
    emoji: "🧍",
  },
  {
    name: "Date",
    emoji: "👫",
  },
  {
    name: "Family",
    emoji: "👨‍👩‍👧‍👦",
  },
  {
    name: "Friends",
    emoji: "👯‍♂️",
  },
  {
    name: "Business",
    emoji: "💼",
  },
];

const RecommendationSecondStep = () => {
  const [selectedCompanion, setSelectedCompanion] = useState<string | null>(
    null,
  );
  const router = useRouter();

  return (
    <AppLayout backButton={true} title="Step 2">
      <View className="bg-neutral-150 w-full rounded-md h-2 my-6">
        {/* {Progress bar} */}
        <View className="bg-yellow-1 w-[66%] h-2 rounded-md"></View>
      </View>
      <SlideInUpView delay={100}>
        <Text className="font-dm-medium text-[22px] text-neutral-800 mb-4">
          Who are you eating with?
        </Text>
        <Text className="font-mulish-medium text-base text-neutral-600 mb-10">
          Select one option:
        </Text>
      </SlideInUpView>
      <SlideInUpView
        delay={300}
        className="flex flex-row items-center gap-3 flex-wrap flex-1"
      >
        {companions.map((companion) => {
          const isSelected = selectedCompanion === companion.name;
          return (
            <ScaleOnPressView
              key={companion.name}
              onPress={() => {
                if (isSelected) {
                  setSelectedCompanion(null);
                } else {
                  setSelectedCompanion(companion.name);
                }
              }}
              className={`px-[14px] py-3 rounded-2xl border border-neutral-200 ${
                isSelected ? "bg-yellow-1" : "bg-white"
              }`}
            >
              <Text
                className={`text-neutral-500 font-mulish-medium text-base ${
                  isSelected ? "text-white" : ""
                }`}
              >
                {companion.emoji} {companion.name}
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
              "/(protected)/(virtual_assistant)/RecommendationThirdStep",
            );
          }}
          disabled={!selectedCompanion}
        />
      </SlideInUpView>
    </AppLayout>
  );
};

export default RecommendationSecondStep;

const styles = StyleSheet.create({});
