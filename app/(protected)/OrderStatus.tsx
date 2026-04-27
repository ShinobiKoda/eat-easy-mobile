import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppLayout from "../../components/layout/AppLayout";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { OrderStatusSchema } from "../../schemas/OrderStatusSchema";
import { FadeInView, ScaleOnPressView } from "../../components/animations/reanimated";
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from "react-native-reanimated";

const statusEmojis: Record<string, string> = {
  start: "👍",
  mid: "⏳",
  end: "✅",
};

const OrderStatus: React.FC = () => {
  const router = useRouter();
  const { selectedRestaurant, getStorageKey } = useRestaurant();
  const [order, setOrder] = useState<any>(null);
  const [toggleList, setToggleList] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(getStorageKey("eat-easy-last-order")).then((raw) => {
      if (raw) setOrder(JSON.parse(raw));
    }).catch(() => {});
  }, [getStorageKey]);

  const { currentStatus, showRecommend, timeLeft, batches } = OrderStatusSchema(
    selectedRestaurant?.id ?? null
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;

  // Bouncing cart animation for empty state
  const bounceY = useSharedValue(0);
  useEffect(() => {
    bounceY.value = withRepeat(
      withTiming(-12, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
      -1, true
    );
  }, []);
  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ translateY: bounceY.value }] }));

  return (
    <AppLayout title="Order Status" showMenuButton={true} locationIcon={false} backButton={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <FadeInView>
          <View className="bg-white dark:bg-neutral-700 rounded-2xl shadow-sm p-6 items-center mb-5">
            {order ? (
              <>
                <Text className="text-5xl mb-4">{statusEmojis[currentStatus.statusKey] || "👍"}</Text>
                <Text className="text-base text-neutral-400 dark:text-neutral-300 text-center font-semibold">
                  {currentStatus.text}
                </Text>
                <Text className="text-xl font-extrabold text-yellow-500 mt-1">
                  {currentStatus.time} {timeLeft > 0 && `(${formattedTime})`}
                </Text>
              </>
            ) : (
              <View className="items-center py-8 gap-4">
                <Animated.View style={bounceStyle}>
                  <Ionicons name="cart-outline" size={80} color="#FFB01D" />
                </Animated.View>
                <Text className="text-lg font-bold text-neutral-800 dark:text-white">No active orders</Text>
                <Text className="text-sm text-neutral-400 text-center max-w-[260px]">
                  Your order status will appear here once you place an order.
                </Text>
              </View>
            )}
          </View>
        </FadeInView>

        {/* Order List */}
        <FadeInView delay={100}>
          <View className="bg-white dark:bg-neutral-700 rounded-2xl shadow-sm p-5 mb-5">
            <TouchableOpacity
              onPress={() => setToggleList(!toggleList)}
              className="flex-row justify-between items-center mb-3"
            >
              <Text className="text-neutral-500 font-semibold">Order list and prices</Text>
              <Feather name={toggleList ? "chevron-up" : "chevron-down"} size={20} color="#FFB01D" />
            </TouchableOpacity>

            {!toggleList && (
              <View className="gap-3 pt-2">
                {batches.length > 0 ? (
                  batches.flatMap((batch: any, bIdx: number) =>
                    batch.items.map((item: any, iIdx: number) => (
                      <View
                        key={`${batch.id}-${bIdx}-${item.id}-${iIdx}`}
                        className="flex-row items-center justify-between"
                        style={{ opacity: batch.status === "pending" ? 0.45 : 1 }}
                      >
                        <View className="flex-row items-center gap-3 flex-1">
                          <View className="w-12 h-12 rounded-full overflow-hidden">
                            <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                          </View>
                          <View>
                            <Text className="text-sm font-semibold dark:text-white">{item.name}</Text>
                            <Text className={`text-[10px] font-semibold ${
                              batch.status === "ready" ? "text-green-500"
                              : batch.status === "preparing" ? "text-yellow-500"
                              : "text-neutral-400"
                            }`}>
                              {batch.status === "ready" ? "Ready" : batch.status === "preparing" ? "Preparing..." : "Pending"}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-sm dark:text-white">
                          {item.qty}x <Text className="font-bold text-yellow-500">${(item.price ?? 0).toFixed(2)}</Text>
                        </Text>
                      </View>
                    ))
                  )
                ) : (
                  <Text className="text-sm text-neutral-400 text-center py-2">No order found.</Text>
                )}
              </View>
            )}

            {/* Add more food */}
            <ScaleOnPressView
              onPress={() => router.push("/(protected)/FullMenu")}
              className="flex-row items-center justify-center gap-2 mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-600"
            >
              <Feather name="plus" size={18} color="#FFB01D" />
              <Text className="text-yellow-500 font-semibold">Add more food to order</Text>
            </ScaleOnPressView>
          </View>
        </FadeInView>

        {/* Status action bar */}
        {order && (
          <FadeInView delay={200}>
            <View className="bg-white dark:bg-neutral-700 rounded-2xl shadow-sm p-4">
              <Text className="text-neutral-400 dark:text-neutral-300 text-sm font-semibold">
                {currentStatus.action}
              </Text>
              {showRecommend && (
                <ScaleOnPressView className="bg-neutral-800 dark:bg-purple-700 rounded-2xl p-3 mt-3 items-center">
                  <Text className="text-white text-xs font-semibold">Ask for Recommendations</Text>
                </ScaleOnPressView>
              )}
            </View>
          </FadeInView>
        )}
      </ScrollView>
    </AppLayout>
  );
};

export default OrderStatus;
