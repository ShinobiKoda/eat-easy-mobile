import {
  ScaleOnPressView,
  SlideInUpView,
} from "@/components/animations/reanimated";
import { ArrowForwardIcon, CalenderIcon } from "@/components/icons/Icons";
import AppLayout from "@/components/layout/AppLayout";
import PrimaryButton from "@/components/PrimaryButton";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { getLatestRecommendation, type Recommendation } from "@/services/recommendationHistoryService";

const MakeRecommendations = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [latestRec, setLatestRec] = useState<Recommendation | null>(null);

  const forwardIconColor = "#FFB01D";
  const calendarIconColor = colorScheme === "dark" ? "#FFD7C0" : "#FFB01D";

  useEffect(() => {
    (async () => {
      try {
        const rec = await getLatestRecommendation();
        setLatestRec(rec);
      } catch (e) {
        console.error("Failed to check recommendations:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  if (loading) {
    return (
      <AppLayout title="" backButton>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#615793" />
        </View>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="" backButton={true}>
      <View className="mt-3 flex-1">
        <SlideInUpView delay={100}>
          <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white text-center">
            It seems we already know each other 🤝
          </Text>
          <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150 text-center mt-[14px]">
            You can use the recommendations configured during your last visit to
            our restaurant or you can have new ones
          </Text>
        </SlideInUpView>
        <View className="flex-1 mt-10 flex flex-col gap-6">
          <SlideInUpView delay={300}>
            <ScaleOnPressView
              onPress={() => router.push("/(protected)/(virtual_assistant)/RecommendationFirstStep")}
              className="bg-white dark:bg-neutral-700 shadow-sm rounded-2xl p-5 flex-row justify-between items-center"
            >
              <Text className="font-mulish-semibold text-base text-neutral-900 dark:text-white">
                New Recommendation
              </Text>
              <ArrowForwardIcon color={forwardIconColor} />
            </ScaleOnPressView>
          </SlideInUpView>
          {latestRec && (
            <SlideInUpView delay={500}>
              <ScaleOnPressView
                onPress={() => router.push("/(protected)/(virtual_assistant)/ShowRecommendations" as any)}
                className="bg-white dark:bg-neutral-700 shadow-sm rounded-2xl p-5 flex-row justify-between items-center"
              >
                <View className="flex flex-col gap-3">
                  <Text className="font-mulish-semibold text-base text-neutral-900 dark:text-white">
                    Your last Recommendation
                  </Text>
                  <View className="flex-row items-center gap-2">
                    <CalenderIcon size={20} color={calendarIconColor} />
                    <Text className="font-mulish-medium text-sm text-neutral-500 dark:text-neutral-300">
                      {formatDate(latestRec.created_at)}
                    </Text>
                  </View>
                </View>
                <ArrowForwardIcon color={forwardIconColor} />
              </ScaleOnPressView>
            </SlideInUpView>
          )}
        </View>
        <SlideInUpView delay={700} className="py-8">
          <PrimaryButton
            text="Next"
            textClass="text-white"
            bgClass="bg-purple-2"
            onPress={() => router.push("/(protected)/(virtual_assistant)/RecommendationFirstStep")}
          />
        </SlideInUpView>
      </View>
    </AppLayout>
  );
};

export default MakeRecommendations;
