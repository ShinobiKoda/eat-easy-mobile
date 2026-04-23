import {
  AnimatedProgressBar,
  ScaleOnPressView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const budgets = [
  { value: "₦2,000 - ₦5,000" },
  { value: "₦5,000 - ₦10,000" },
  { value: "₦10,000 - ₦20,000" },
  { value: "₦20,000+" },
];

const RecommendationThirdStep = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const router = useRouter();

  const handleFinish = async () => {
    if (selectedBudget) {
      await AsyncStorage.setItem("eat-easy-rec-budget", selectedBudget);
    }
    // Navigate to Generating page which reads all saved prefs and calls AI
    router.push("/(protected)/(virtual_assistant)/Generating" as any);
  };

  return (
    <AppLayout backButton={true} title="Step 3">
      <View className="bg-neutral-150 dark:bg-neutral-700 w-full rounded-md h-2 my-6">
        <AnimatedProgressBar
          initialProgress={66}
          targetProgress={100}
          className="bg-yellow-1 h-2 rounded-md"
        />
      </View>
      <SlideInUpView delay={100}>
        <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white mb-4">
          What is your budget?
        </Text>
        <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150 mb-10">
          Select one option:
        </Text>
      </SlideInUpView>
      <SlideInUpView
        delay={300}
        className="flex flex-row items-center gap-3 flex-wrap flex-1"
      >
        {budgets.map((budget) => {
          const isSelected = selectedBudget === budget.value;
          return (
            <ScaleOnPressView
              key={budget.value}
              onPress={() => {
                setSelectedBudget(isSelected ? null : budget.value);
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
                {budget.value}
              </Text>
            </ScaleOnPressView>
          );
        })}
      </SlideInUpView>
      <SlideInUpView delay={500} className="py-8">
        <PrimaryButton
          text="Finish"
          bgClass="bg-purple-2"
          textClass="text-white"
          onPress={handleFinish}
          disabled={!selectedBudget}
        />
      </SlideInUpView>
    </AppLayout>
  );
};

export default RecommendationThirdStep;
