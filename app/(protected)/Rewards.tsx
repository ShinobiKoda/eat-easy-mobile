import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, Dimensions } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import AppLayout from "../../components/layout/AppLayout";
import { FadeInView, PopInView, ScaleOnPressView } from "../../components/animations/reanimated";
import { couponService, type Coupon } from "../../services/couponService";
import { supabase } from "../../lib/Supabase";
import CouponDetailModal from "../../components/dashboard/CouponDetailModal";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from "react-native-reanimated";

const MILESTONES = [
  { orders: 15, percent: 5, label: "5% off" },
  { orders: 30, percent: 10, label: "10% off" },
  { orders: 50, percent: 15, label: "15% off" },
];

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Rewards: React.FC = () => {
  const [liveCoupons, setLiveCoupons] = useState<Coupon[]>([]);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats
  const [activeCoupons, setActiveCoupons] = useState(0);
  const [usedCoupons, setUsedCoupons] = useState(0);
  const [weeklyOrders, setWeeklyOrders] = useState(0);
  const [luckyDay, setLuckyDay] = useState<string | null>(null);
  const [isLuckyToday, setIsLuckyToday] = useState(false);

  // Animation for progress bar
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const coupons = await couponService.getUserCoupons();
        setLiveCoupons(coupons);

        const now = new Date();
        const active = coupons.filter(
          (c) => !c.isUsed && new Date(c.expiresAt) > now
        );
        const used = coupons.filter((c) => c.isUsed);
        setActiveCoupons(active.length);
        setUsedCoupons(used.length);

        const currentDay = now.getDay() || 7;
        const monday = new Date(now);
        monday.setHours(0, 0, 0, 0);
        monday.setDate(monday.getDate() - currentDay + 1);

        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { count } = await supabase
            .from("eat_easy_orders")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .gte("created_at", monday.toISOString());

          const finalCount = count ?? 0;
          setWeeklyOrders(finalCount);

          // Update progress bar
          const currentMilestone = MILESTONES.find((m) => finalCount < m.orders) || MILESTONES[MILESTONES.length - 1];
          const prevThreshold = MILESTONES.indexOf(currentMilestone) > 0
            ? MILESTONES[MILESTONES.indexOf(currentMilestone) - 1].orders
            : 0;
          const progress = finalCount >= currentMilestone.orders
            ? 100
            : ((finalCount - prevThreshold) / (currentMilestone.orders - prevThreshold)) * 100;
            
          progressWidth.value = withTiming(Math.min(progress, 100), {
            duration: 1000,
            easing: Easing.out(Easing.exp),
          });

          // Lucky day
          const charSum = user.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
          const oneJan = new Date(now.getFullYear(), 0, 1);
          const weekNum = Math.ceil(((now.getTime() - oneJan.getTime()) / 86400000 + oneJan.getDay() + 1) / 7);
          const luckyDayIndex = (charSum + weekNum) % 7;
          setLuckyDay(DAY_NAMES[luckyDayIndex]);
          setIsLuckyToday(now.getDay() === luckyDayIndex);
        }
      } catch (err) {
        console.error("Error fetching reward stats", err);
      }
    };

    fetchAll();
  }, []);

  const currentMilestone = MILESTONES.find((m) => weeklyOrders < m.orders) || MILESTONES[MILESTONES.length - 1];
  const ordersRemaining = Math.max(0, currentMilestone.orders - weeklyOrders);
  const allMilestonesReached = weeklyOrders >= 50;

  const animatedProgressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value}%`,
    };
  });

  const renderCoupon = ({ item: coupon }: { item: Coupon }) => {
    return (
      <ScaleOnPressView 
        className="mr-4"
        onPress={() => {
          setSelectedCoupon(coupon);
          setIsModalOpen(true);
        }}
      >
        <View 
          className={`w-[240px] h-[210px] bg-neutral-100 dark:bg-neutral-700 p-5 rounded-2xl flex-col justify-between ${coupon.isUsed ? "opacity-60" : ""}`}
        >
          {coupon.isUsed && (
            <View className="absolute top-3 right-3 px-2 py-0.5 bg-gray-200 dark:bg-gray-600 rounded">
              <Text className="text-[10px] font-bold uppercase text-gray-500">Used</Text>
            </View>
          )}
          <View className="space-y-4">
            <View className="w-16 h-16 rounded-full bg-[#50506F] justify-center items-center">
              <Feather name="gift" size={24} color="white" />
            </View>
            <Text className="text-neutral-900 dark:text-white font-semibold text-lg line-clamp-2">
              {coupon.description}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Feather name="calendar" size={14} color="#f97316" />
            <Text className="text-neutral-500 dark:text-neutral-300 font-medium">
              {new Date(coupon.expiresAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </ScaleOnPressView>
    );
  };

  return (
    <AppLayout title="My Rewards" showMenuButton={true} locationIcon={false} backButton={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Stats Grid */}
        <View className="flex-row flex-wrap justify-between mb-6">
          <PopInView delay={100} className="w-[31%]">
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm items-center">
              <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                <Feather name="tag" size={18} color="#9333ea" />
              </View>
              <Text className="text-xl font-bold text-neutral-800 dark:text-white">{activeCoupons}</Text>
              <Text className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 text-center">Active</Text>
            </View>
          </PopInView>
          
          <PopInView delay={200} className="w-[31%]">
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm items-center">
              <View className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center mb-2">
                <Feather name="check-circle" size={18} color="#eab308" />
              </View>
              <Text className="text-xl font-bold text-neutral-800 dark:text-white">{usedCoupons}</Text>
              <Text className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 text-center">Used</Text>
            </View>
          </PopInView>

          <PopInView delay={300} className="w-[31%]">
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm items-center">
              <View className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                <Feather name="zap" size={18} color="#f97316" />
              </View>
              <Text className="text-xl font-bold text-neutral-800 dark:text-white">{weeklyOrders}</Text>
              <Text className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 text-center">Weekly</Text>
            </View>
          </PopInView>
        </View>

        {/* Milestone Progress */}
        <FadeInView delay={400} className="mb-4">
          <View className="bg-white dark:bg-neutral-700 rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Ionicons name="sparkles" size={16} color="#9333ea" />
              </View>
              <Text className="font-semibold text-base text-neutral-800 dark:text-white">Weekly Milestone</Text>
            </View>

            {allMilestonesReached ? (
              <View className="items-center py-4">
                <Text className="text-3xl mb-2">🎉</Text>
                <Text className="font-bold text-neutral-800 dark:text-white text-lg">All milestones reached!</Text>
                <Text className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 text-center">You've unlocked every reward this week. Keep it up!</Text>
              </View>
            ) : (
              <View>
                <View className="flex-row items-end justify-between mb-2">
                  <View>
                    <Text className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                      Next reward at <Text className="font-bold text-purple-600">{currentMilestone.orders} orders</Text>
                    </Text>
                    <Text className="text-xs text-neutral-400 mt-1">
                      {ordersRemaining} more order{ordersRemaining !== 1 ? "s" : ""} to unlock{" "}
                      <Text className="font-semibold text-orange-500">{currentMilestone.label}</Text>
                    </Text>
                  </View>
                  <Text className="text-sm font-bold text-purple-600">
                    {weeklyOrders}/{currentMilestone.orders}
                  </Text>
                </View>

                {/* Progress bar */}
                <View className="w-full h-3 bg-neutral-100 dark:bg-neutral-600 rounded-full overflow-hidden my-3">
                  <Animated.View className="h-full bg-purple-600 rounded-full" style={animatedProgressStyle} />
                </View>

                {/* Dots */}
                <View className="flex-row justify-between items-center px-1">
                  {MILESTONES.map((m) => {
                    const reached = weeklyOrders >= m.orders;
                    return (
                      <View key={m.orders} className="items-center">
                        <View className={`w-6 h-6 rounded-full items-center justify-center mb-1 ${reached ? "bg-purple-600" : "bg-neutral-200 dark:bg-neutral-600"}`}>
                          {reached ? (
                            <Feather name="check" size={12} color="white" />
                          ) : (
                            <Text className={`text-[10px] font-bold ${reached ? "text-white" : "text-neutral-400"}`}>{m.orders}</Text>
                          )}
                        </View>
                        <Text className={`text-[10px] font-semibold ${reached ? "text-purple-600" : "text-neutral-400"}`}>{m.label}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        </FadeInView>

        {/* Lucky Day Card */}
        <FadeInView delay={500} className="mb-8">
          <View className="bg-white dark:bg-neutral-700 rounded-2xl p-6 shadow-sm">
            <View className="flex-row items-center gap-2 mb-4">
              <View className="w-8 h-8 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <Text className="text-base">🍀</Text>
              </View>
              <Text className="font-semibold text-base text-neutral-800 dark:text-white">Lucky Day</Text>
            </View>

            <View>
              {luckyDay ? (
                <>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">Your lucky day this week is</Text>
                  <View className="flex-row items-center">
                    <Text className="text-2xl font-bold text-neutral-800 dark:text-white">{luckyDay}</Text>
                    {isLuckyToday && <Text className="ml-2 text-xl">🎯</Text>}
                  </View>
                  {isLuckyToday ? (
                    <Text className="text-xs font-medium text-orange-500 mt-2">
                      That's today! Order 3+ items for a free drink coupon 🥤
                    </Text>
                  ) : (
                    <Text className="text-xs text-neutral-400 mt-2">
                      Order 3+ items on {luckyDay} for a chance at a free drink!
                    </Text>
                  )}
                </>
              ) : (
                <Text className="text-sm text-neutral-400">Loading...</Text>
              )}
            </View>
          </View>
        </FadeInView>

        {/* Coupons List */}
        <FadeInView delay={600}>
          <Text className="font-semibold text-base text-neutral-800 dark:text-white mb-4">
            Your Coupons
          </Text>

          {liveCoupons.length === 0 ? (
            <View className="bg-neutral-50 dark:bg-neutral-800/50 rounded-3xl border border-neutral-200 dark:border-neutral-700 p-8 items-center">
              <View className="w-16 h-16 bg-white dark:bg-neutral-700 rounded-full items-center justify-center mb-4 shadow-sm">
                <Text className="text-3xl">🎁</Text>
              </View>
              <Text className="text-xl font-bold text-neutral-900 dark:text-white mb-2 text-center">
                No coupons yet
              </Text>
              <Text className="text-neutral-500 dark:text-neutral-400 text-center text-sm">
                Keep ordering your favorite meals to unlock special discounts and free treats!
              </Text>
            </View>
          ) : (
            <FlatList
              data={liveCoupons}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderCoupon}
              contentContainerStyle={{ paddingRight: 20 }}
            />
          )}
        </FadeInView>

      </ScrollView>

      <CouponDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        coupon={selectedCoupon}
      />
    </AppLayout>
  );
};

export default Rewards;
