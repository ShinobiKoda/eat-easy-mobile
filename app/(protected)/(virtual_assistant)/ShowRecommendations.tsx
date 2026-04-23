import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLayout from "@/components/layout/AppLayout";
import { FadeInView, PopInView, ScaleOnPressView } from "@/components/animations/reanimated";
import { useOrder } from "@/hooks/useOrder";
import { getMenuItems } from "@/services/menuService";
import { getLatestRecommendation } from "@/services/recommendationHistoryService";
import ViewDish from "@/components/dashboard/ViewDish";
import type { PropType } from "@/types";

const ShowRecommendations = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedItems, setRecommendedItems] = useState<PropType[]>([]);
  const [showDish, setShowDish] = useState<PropType | null>(null);

  const { addToOrder } = useOrder();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Try reading item IDs from AsyncStorage (set by Generating page)
        let itemIds: number[] | undefined;
        const stored = await AsyncStorage.getItem("eat-easy-rec-item-ids");
        if (stored) {
          itemIds = JSON.parse(stored);
        }

        // Fallback: fetch latest from DB
        if (!itemIds || itemIds.length === 0) {
          const latestRec = await getLatestRecommendation();
          if (latestRec) {
            itemIds = latestRec.item_ids;
          } else {
            setError("No recommendations yet. Start by telling us your mood!");
            setLoading(false);
            return;
          }
        }

        // Fetch menu and filter
        const allItems = await getMenuItems();
        const idSet = new Set(itemIds);
        const filtered = allItems.filter((item) => idSet.has(item.id));

        if (filtered.length === 0) {
          setError("Couldn't load recommended items. Please try generating new ones.");
        } else {
          setRecommendedItems(filtered);
        }
      } catch (err) {
        console.error("[ShowRecommendations] Error:", err);
        setError("Failed to load recommendations. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <AppLayout title="Smart Assistant" backButton>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <FadeInView>
          <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white mt-3 mb-2">
            We think you might enjoy these specially selected dishes
          </Text>
        </FadeInView>

        {/* Action bar */}
        <FadeInView delay={100}>
          <View className="bg-white dark:bg-neutral-700 rounded-2xl p-4 flex-row justify-between items-center shadow-sm mt-2 mb-5">
            <View className="flex-row items-center gap-3">
              <Text className="text-2xl">🤖</Text>
              <Text className="font-mulish-semibold text-sm text-neutral-600 dark:text-neutral-200">
                AI-picked just for you
              </Text>
            </View>
            <ScaleOnPressView
              onPress={() => router.push("/(protected)/(virtual_assistant)/RecommendationFirstStep")}
              className="bg-neutral-800 dark:bg-purple-2 rounded-2xl px-4 py-2.5"
            >
              <Text className="text-white text-xs font-mulish-bold">New recommendation</Text>
            </ScaleOnPressView>
          </View>
        </FadeInView>

        {/* Error */}
        {error && (
          <FadeInView className="items-center py-16 gap-6">
            <View className="w-24 h-24 rounded-full bg-yellow-100 dark:bg-yellow-900/20 items-center justify-center">
              <Text className="text-4xl">🍽️</Text>
            </View>
            <Text className="text-lg font-dm-medium text-neutral-800 dark:text-white text-center">
              {error}
            </Text>
            <ScaleOnPressView
              onPress={() => router.push("/(protected)/(virtual_assistant)/RecommendationFirstStep")}
              className="bg-purple-2 rounded-2xl px-8 py-3"
            >
              <Text className="text-white font-mulish-bold">Get Recommendations</Text>
            </ScaleOnPressView>
          </FadeInView>
        )}

        {/* Loading */}
        {loading && !error && (
          <View className="items-center py-16">
            <ActivityIndicator size="large" color="#615793" />
          </View>
        )}

        {/* Results grid */}
        {!loading && !error && (
          <View className="gap-3">
            {recommendedItems.map((eat, i) => (
              <PopInView key={eat.id} delay={i * 60}>
                <View className="bg-white dark:bg-neutral-700 rounded-2xl p-3 shadow-sm">
                  <View className="flex-row items-center gap-3">
                    <View className="w-[80px] h-[80px] rounded-full overflow-hidden">
                      <Image
                        source={{ uri: eat.image }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="font-mulish-semibold text-[15px] text-neutral-800 dark:text-white" numberOfLines={1}>
                        {eat.name}
                      </Text>
                      <View className="flex-row items-center gap-1 mt-1">
                        <Ionicons name="star" size={14} color="#FFB01D" />
                        <Text className="text-neutral-500 dark:text-neutral-200 text-sm font-mulish-medium">
                          {eat.rating.toFixed(1)}
                        </Text>
                        <Text className="text-neutral-300 dark:text-neutral-500 text-xs ml-1">
                          ({eat.reviews} reviews)
                        </Text>
                      </View>
                      <Text className="text-orange-500 text-[15px] font-mulish-bold mt-1">
                        ${eat.price.toFixed(2)}
                      </Text>
                    </View>
                    <ScaleOnPressView
                      onPress={() => setShowDish(eat)}
                      className="bg-orange-100 dark:bg-orange-500 rounded-xl p-2.5"
                    >
                      <Ionicons name="add" size={18} color="#FF7B2C" />
                    </ScaleOnPressView>
                  </View>
                </View>
              </PopInView>
            ))}
          </View>
        )}
      </ScrollView>

      {/* ViewDish Modal */}
      {showDish && (
        <ViewDish
          item={showDish}
          onClose={() => setShowDish(null)}
          onAddToOrder={addToOrder}
        />
      )}
    </AppLayout>
  );
};

export default ShowRecommendations;
