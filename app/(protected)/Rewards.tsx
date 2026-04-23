import React, { useEffect, useState, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Header from "../../components/layout/Header";
import { supabase } from "../../lib/Supabase";
import { couponService, type Coupon } from "../../services/couponService";
import { FadeInView, PopInView, ScaleOnPressView, AnimatedProgressBar } from "../../components/animations/reanimated";

const MILESTONES = [
  { orders: 15, percent: 5, label: "5% off" },
  { orders: 30, percent: 10, label: "10% off" },
  { orders: 50, percent: 15, label: "15% off" },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const couponIcons: Record<string, string> = {
  welcome: "🎉",
  milestone: "🏆",
  free_drink: "🥤",
};

const Rewards: React.FC = () => {
  const colorScheme = useColorScheme();
  const [liveCoupons, setLiveCoupons] = useState<Coupon[]>([]);
  const [activeCoupons, setActiveCoupons] = useState(0);
  const [usedCoupons, setUsedCoupons] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [luckyDay, setLuckyDay] = useState<string | null>(null);
  const [isLuckyToday, setIsLuckyToday] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const coupons = await couponService.getUserCoupons();
        setLiveCoupons(coupons);

        const now = new Date();
        setActiveCoupons(coupons.filter((c) => !c.isUsed && new Date(c.expiresAt) > now).length);
        setUsedCoupons(coupons.filter((c) => c.isUsed).length);

        // Weekly orders
        const currentDay = now.getDay() || 7;
        const monday = new Date(now);
        monday.setHours(0, 0, 0, 0);
        monday.setDate(monday.getDate() - currentDay + 1);

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { count } = await supabase.from("eat_easy_orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", monday.toISOString());
          setWeeklyOrders(count ?? 0);

          // Lucky day
          const charSum = user.id.split("").reduce((s, c) => s + c.charCodeAt(0), 0);
          const oneJan = new Date(now.getFullYear(), 0, 1);
          const weekNum = Math.ceil(((now.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
          const luckyIdx = (charSum + weekNum) % 7;
          setLuckyDay(DAY_NAMES[luckyIdx]);
          setIsLuckyToday(now.getDay() === luckyIdx);
        }
      } catch (e) { console.error("Rewards fetch error:", e); }
      finally { setLoading(false); }
    })();
  }, []);

  const currentMilestone = MILESTONES.find((m) => weeklyOrders < m.orders) || MILESTONES[MILESTONES.length - 1];
  const prevThreshold = MILESTONES.indexOf(currentMilestone) > 0
    ? MILESTONES[MILESTONES.indexOf(currentMilestone) - 1].orders : 0;
  const progress = weeklyOrders >= currentMilestone.orders ? 100
    : ((weeklyOrders - prevThreshold) / (currentMilestone.orders - prevThreshold)) * 100;
  const ordersRemaining = Math.max(0, currentMilestone.orders - weeklyOrders);
  const allDone = weeklyOrders >= 50;

  if (loading) return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 items-center justify-center">
      <ActivityIndicator size="large" color="#FF7B2C" />
    </View>
  );

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="My Rewards" backButton showSideBar={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-4">
          {/* Stats Row */}
          <PopInView>
            <View className="flex-row gap-3 mb-5">
              <View className="flex-1 bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
                  <Ionicons name="ticket-outline" size={20} color="#615793" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-neutral-800 dark:text-white">{activeCoupons}</Text>
                  <Text className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">Active</Text>
                </View>
              </View>
              <View className="flex-1 bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 items-center justify-center">
                  <Ionicons name="checkmark-circle-outline" size={20} color="#FFB01D" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-neutral-800 dark:text-white">{usedCoupons}</Text>
                  <Text className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">Used</Text>
                </View>
              </View>
              <View className="flex-1 bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 items-center justify-center">
                  <Ionicons name="flame-outline" size={20} color="#FF7B2C" />
                </View>
                <View>
                  <Text className="text-xl font-bold text-neutral-800 dark:text-white">{weeklyOrders}</Text>
                  <Text className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">Weekly</Text>
                </View>
              </View>
            </View>
          </PopInView>

          {/* Milestone Progress */}
          <FadeInView>
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm mb-4">
              <View className="flex-row items-center gap-2 mb-4">
                <View className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
                  <Ionicons name="sparkles" size={16} color="#615793" />
                </View>
                <Text className="font-semibold text-base text-neutral-800 dark:text-white">Weekly Milestone</Text>
              </View>

              {allDone ? (
                <View className="items-center py-4">
                  <Text className="text-3xl mb-2">🎉</Text>
                  <Text className="font-bold text-neutral-800 dark:text-white">All milestones reached!</Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">Keep it up!</Text>
                </View>
              ) : (
                <>
                  <View className="flex-row justify-between items-end mb-2">
                    <View>
                      <Text className="text-sm text-neutral-600 dark:text-neutral-300">
                        Next at <Text className="font-bold text-purple-600">{currentMilestone.orders} orders</Text>
                      </Text>
                      <Text className="text-xs text-neutral-400 mt-0.5">
                        {ordersRemaining} more for <Text className="font-semibold text-orange-500">{currentMilestone.label}</Text>
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-purple-600">{weeklyOrders}/{currentMilestone.orders}</Text>
                  </View>

                  {/* Progress bar */}
                  <View className="w-full h-3 bg-neutral-100 dark:bg-neutral-600 rounded-full overflow-hidden">
                    <AnimatedProgressBar
                      targetProgress={Math.min(progress, 100)}
                      className="h-full rounded-full bg-purple-600"
                    />
                  </View>

                  {/* Milestone dots */}
                  <View className="flex-row justify-between mt-3 px-1">
                    {MILESTONES.map((m) => (
                      <View key={m.orders} className="items-center gap-1">
                        <View className={`w-6 h-6 rounded-full items-center justify-center ${
                          weeklyOrders >= m.orders ? "bg-purple-600" : "bg-neutral-200 dark:bg-neutral-600"
                        }`}>
                          <Text className={`text-[10px] font-bold ${weeklyOrders >= m.orders ? "text-white" : "text-neutral-400"}`}>
                            {weeklyOrders >= m.orders ? "✓" : m.orders}
                          </Text>
                        </View>
                        <Text className={`text-[10px] font-semibold ${weeklyOrders >= m.orders ? "text-purple-600" : "text-neutral-400"}`}>
                          {m.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          </FadeInView>

          {/* Lucky Day Card */}
          <FadeInView delay={100}>
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm mb-5">
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 items-center justify-center">
                  <Text className="text-base">🍀</Text>
                </View>
                <Text className="font-semibold text-base text-neutral-800 dark:text-white">Lucky Day</Text>
              </View>

              {luckyDay ? (
                <View>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                    Your lucky day this week is
                  </Text>
                  <Text className="text-2xl font-bold text-neutral-800 dark:text-white">
                    {luckyDay} {isLuckyToday && "🎯"}
                  </Text>
                  <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-2">
                    {isLuckyToday
                      ? "That's today! Order 3+ items for a free drink coupon 🥤"
                      : `Order 3+ items on ${luckyDay} for a chance at a free drink!`}
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <ActivityIndicator size="small" color="#a3a3a3" />
                  <Text className="text-sm text-neutral-400">Loading...</Text>
                </View>
              )}
            </View>
          </FadeInView>

          {/* Coupons */}
          <FadeInView delay={150}>
            <Text className="font-semibold text-base text-neutral-800 dark:text-white mb-3">
              Your Coupons
            </Text>
          </FadeInView>
        </View>

        {liveCoupons.length === 0 ? (
          <FadeInView className="mx-5">
            <View className="items-center py-12 bg-neutral-100 dark:bg-neutral-800/50 rounded-3xl border border-neutral-200 dark:border-neutral-700">
              <View className="w-20 h-20 bg-white dark:bg-neutral-700 rounded-full items-center justify-center mb-4 shadow-sm">
                <Text className="text-3xl">🎁</Text>
              </View>
              <Text className="text-lg font-bold text-neutral-800 dark:text-white mb-2">No coupons yet</Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-center max-w-[260px]">
                Keep ordering to unlock discounts and free treats!
              </Text>
            </View>
          </FadeInView>
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={liveCoupons}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            keyExtractor={(item) => item.id}
            renderItem={({ item: coupon }) => (
              <View className="mr-3" style={{ width: 220, opacity: coupon.isUsed ? 0.6 : 1 }}>
                <View className="bg-neutral-100 dark:bg-neutral-700 p-5 rounded-2xl h-[200px] justify-between shadow-sm">
                  {coupon.isUsed && (
                    <View className="absolute top-2 right-2 bg-neutral-300 dark:bg-neutral-600 px-2 py-0.5 rounded z-10">
                      <Text className="text-[10px] font-bold text-neutral-500 uppercase">Used</Text>
                    </View>
                  )}
                  <View className="gap-3">
                    <View className="w-16 h-16 rounded-full bg-neutral-700 items-center justify-center">
                      <Text className="text-2xl">{couponIcons[coupon.type] || "🎫"}</Text>
                    </View>
                    <Text className="text-neutral-800 dark:text-white font-semibold text-base" numberOfLines={2}>
                      {coupon.description}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1.5">
                    <Feather name="calendar" size={14} color="#FF7B2C" />
                    <Text className="text-neutral-500 dark:text-neutral-300 text-sm">
                      {new Date(coupon.expiresAt).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Rewards;
