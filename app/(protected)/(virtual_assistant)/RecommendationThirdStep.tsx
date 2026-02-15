import {
  ScaleOnPressView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const budgets = [
  {
    value: "₦2,000 - ₦5,000",
    description: "",
  },
  {
    value: "₦5,000 - ₦10,000",
    description: "",
  },
  {
    value: "₦10,000 - ₦20,000",
    description: "",
  },
  {
    value: "₦20,000+",
    description: "",
  },
];

const RecommendationThirdStep = () => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const router = useRouter();

  return (
    <AppLayout backButton={true} title="Step 3">
      <View className="bg-neutral-150 w-full rounded-md h-2 my-6">
        {/* {Progress bar} */}
        <View className="bg-yellow-1 w-[100%] h-2 rounded-md"></View>
      </View>
      <SlideInUpView delay={100}>
        <Text className="font-dm-medium text-[22px] text-neutral-800 mb-4">
          What is your budget?
        </Text>
        <Text className="font-mulish-medium text-base text-neutral-600 mb-10">
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
                if (isSelected) {
                  setSelectedBudget(null);
                } else {
                  setSelectedBudget(budget.value);
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
          onPress={() => {
            // Navigate to results or home for now
            router.push("/(protected)/Homepage");
          }}
          disabled={!selectedBudget}
        />
      </SlideInUpView>
    </AppLayout>
  );
};

export default RecommendationThirdStep;

const styles = StyleSheet.create({});
