import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLayout from "@/components/layout/AppLayout";
import { FadeInView } from "@/components/animations/reanimated";
import { supabase } from "@/lib/Supabase";
import { generateRecommendations } from "@/services/recommendationService";
import { saveRecommendation } from "@/services/recommendationHistoryService";
import { getMenuItems } from "@/services/menuService";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";

const statusMessages = [
  "Analyzing your mood...",
  "Checking the kitchen...",
  "Finding perfect dishes...",
  "Matching your preferences...",
  "Almost ready...",
];

/* Pulsing ring component */
const PulsingRing = ({ delay }: { delay: number }) => {
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0.8);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(withTiming(1.4, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false)
    );
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }), -1, false)
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    position: "absolute" as const,
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: "#615793",
  }));

  return <Animated.View style={style} />;
};

/* Progress dot */
const ProgressDot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.3);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(
        withTiming(1, { duration: 600 }),
        withTiming(0.3, { duration: 600 }),
      ), -1, true)
    );
  }, []);
  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[{ width: 10, height: 10, borderRadius: 5, backgroundColor: "#615793" }, style]}
    />
  );
};

const Generating = () => {
  const router = useRouter();
  const [statusIndex, setStatusIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasStarted = useRef(false);

  // Cycle status messages
  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusMessages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Generate on mount
  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;

    async function generate() {
      try {
        // Read saved preferences from AsyncStorage
        const [moodsRaw, partySize, budgetRange] = await Promise.all([
          AsyncStorage.getItem("eat-easy-rec-moods"),
          AsyncStorage.getItem("eat-easy-rec-party"),
          AsyncStorage.getItem("eat-easy-rec-budget"),
        ]);

        const moods: string[] = moodsRaw ? JSON.parse(moodsRaw) : [];
        const party = partySize || "solo";
        const budget = budgetRange || "any";

        // Daily limit check
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const todayStart = new Date();
          todayStart.setHours(0, 0, 0, 0);

          const { data: todayRecs } = await supabase
            .from("recommendations")
            .select("id, item_ids")
            .eq("user_id", user.id)
            .gte("created_at", todayStart.toISOString())
            .order("created_at", { ascending: false })
            .limit(1);

          if (todayRecs && todayRecs.length > 0) {
            // Already generated today — use existing
            await AsyncStorage.setItem(
              "eat-easy-rec-item-ids",
              JSON.stringify(todayRecs[0].item_ids)
            );
            router.replace("/(protected)/(virtual_assistant)/ShowRecommendations" as any);
            return;
          }
        }

        // Fetch menu and call Gemini
        const menuItems = await getMenuItems();
        const itemIds = await generateRecommendations(
          { moods, budgetRange: budget, partySize: party, foodPreferences: [] },
          menuItems as any,
        );

        // Save to Supabase
        await saveRecommendation({
          moods,
          budgetRange: budget,
          partySize: party,
          foodPreferences: [],
          itemIds,
        });

        // Store item IDs for the results page
        await AsyncStorage.setItem("eat-easy-rec-item-ids", JSON.stringify(itemIds));

        // Navigate to results
        router.replace("/(protected)/(virtual_assistant)/ShowRecommendations" as any);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Something went wrong.";
        console.error("[Generating] Error:", err);
        setError(message);
      }
    }

    generate();
  }, []);

  return (
    <AppLayout title="Smart Assistant" backButton={!error}>
      <View className="flex-1 items-center justify-center px-6">
        {error ? (
          /* ─── Error State ─── */
          <FadeInView className="items-center gap-6">
            <View className="w-24 h-24 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center">
              <Text className="text-4xl">😞</Text>
            </View>
            <Text className="text-[22px] text-neutral-800 dark:text-white font-dm-medium text-center">
              Something went wrong
            </Text>
            <Text className="text-neutral-500 dark:text-neutral-300 text-center max-w-[300px]">
              {error}
            </Text>
            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                onPress={() => { setError(null); hasStarted.current = false; }}
                className="bg-purple-2 rounded-2xl px-8 py-3"
              >
                <Text className="text-white font-mulish-bold">Try Again</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.back()}
                className="border-2 border-neutral-300 dark:border-neutral-600 rounded-2xl px-8 py-3"
              >
                <Text className="text-neutral-600 dark:text-neutral-200 font-mulish-bold">Go Back</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
        ) : (
          /* ─── Loading Animation ─── */
          <FadeInView className="items-center gap-10">
            {/* Pulsing circles */}
            <View className="w-40 h-40 items-center justify-center">
              <PulsingRing delay={0} />
              <PulsingRing delay={600} />
              <PulsingRing delay={1200} />
              <View className="w-20 h-20 rounded-full bg-purple-2 items-center justify-center" style={{ elevation: 8 }}>
                <Text className="text-3xl">🤖</Text>
              </View>
            </View>

            {/* Status text */}
            <View className="items-center gap-3">
              <Text className="text-[22px] text-neutral-800 dark:text-white font-dm-medium text-center">
                Finding your perfect meal
              </Text>
              <Text className="text-purple-3 dark:text-purple-4 font-mulish-bold text-lg">
                {statusMessages[statusIndex]}
              </Text>
            </View>

            {/* Progress dots */}
            <View className="flex-row gap-2">
              {[0, 1, 2, 3, 4].map((i) => (
                <ProgressDot key={i} delay={i * 200} />
              ))}
            </View>
          </FadeInView>
        )}
      </View>
    </AppLayout>
  );
};

export default Generating;
