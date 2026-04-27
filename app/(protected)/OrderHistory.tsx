import { Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import {
  FadeInView,
  PopInView,
  ScaleOnPressView,
} from "../../components/animations/reanimated";
import AppLayout from "../../components/layout/AppLayout";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { orderService, type OrderRecord } from "../../services/orderService";

const filterTabs = [
  "All your orders",
  "Last 7 days",
  "Last 14 days",
  "Last 30 days",
];

const OrderHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All your orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const { selectedRestaurant } = useRestaurant();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All your orders") return true;
    const diff = Math.floor(
      (Date.now() - new Date(order.createdAt).getTime()) / 86400000,
    );
    if (activeFilter === "Last 7 days") return diff <= 7;
    if (activeFilter === "Last 14 days") return diff <= 14;
    if (activeFilter === "Last 30 days") return diff <= 30;
    return true;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  return (
    <AppLayout
      title="Order History"
      showMenuButton={true}
      locationIcon={false}
      backButton={false}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Active Restaurant Card */}
        <FadeInView>
          <View className="rounded-3xl bg-neutral-900 dark:bg-red-100 flex-row items-center justify-between mb-8 overflow-hidden max-h-[240px]">
            <View className="flex-row items-center gap-5 md:gap-8 flex-1">
              {/* Food image */}
              <View className="relative w-[30%] h-[120px] sm:h-full hidden sm:flex items-center justify-center">
                <Image
                  source={require("../../assets/images/active-bg.png")}
                  style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                  contentFit="cover"
                />
                <Image
                  source={{
                    uri:
                      (selectedRestaurant as any)?.image ||
                      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                  }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    zIndex: 10,
                  }}
                  contentFit="cover"
                />
              </View>
              {/* Order info */}
              <View className="space-y-2 p-4 sm:p-6 flex-1">
                <View className="bg-neutral-150/20 dark:bg-orange-500/15 px-3 py-1 rounded-[9px] self-start mb-2">
                  <Text className="text-xs md:text-sm font-medium text-neutral-150 dark:text-orange-500">
                    Active Restaurant
                  </Text>
                </View>
                <Text className="text-white dark:text-neutral-800 font-bold text-[20px] md:text-[24px]">
                  {selectedRestaurant?.name || "Gram Bistro"}
                </Text>
                <Text className="text-neutral-400 dark:text-neutral-800 text-[13px] md:text-[14px] font-medium mt-2 leading-5">
                  From tracking its progress to making changes to the order, you
                  can view real-time updates on your current order.
                </Text>
              </View>
            </View>
            {/* Arrow button */}
            <TouchableOpacity className="w-11 h-11 rounded-2xl bg-orange-500 items-center justify-center mr-4 sm:mr-6 shadow-sm">
              <Feather name="arrow-right" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </FadeInView>

        {/* Filter Tabs */}
        <FadeInView delay={100}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-6"
          >
            {filterTabs.map((tab) => (
              <ScaleOnPressView
                key={tab}
                onPress={() => setActiveFilter(tab)}
                className={`px-4 py-2.5 rounded-[16px] mr-3 ${
                  activeFilter === tab
                    ? "bg-[#FFB01D]"
                    : "bg-transparent dark:bg-neutral-800"
                }`}
              >
                <Text
                  className={`text-[12px] md:text-sm font-semibold ${
                    activeFilter === tab
                      ? "text-neutral-800 font-bold"
                      : "text-neutral-500 dark:text-neutral-300"
                  }`}
                >
                  {tab}
                </Text>
              </ScaleOnPressView>
            ))}
          </ScrollView>
        </FadeInView>

        {/* Orders */}
        {loading ? (
          <View className="items-center py-16">
            <ActivityIndicator size="large" color="#FF7B2C" />
          </View>
        ) : filteredOrders.length === 0 ? (
          <FadeInView>
            <View className="items-center py-16">
              <Text className="text-neutral-500 dark:text-neutral-300 text-[16px] font-medium text-center">
                {activeFilter === "All your orders"
                  ? "No orders yet. Place your first order!"
                  : `No orders in the ${activeFilter.toLowerCase()}.`}
              </Text>
            </View>
          </FadeInView>
        ) : (
          <View className="gap-4">
            {filteredOrders.map((order, i) => (
              <PopInView key={order.id} delay={i * 60}>
                <TouchableOpacity
                  onPress={() => setSelectedOrder(order)}
                  activeOpacity={0.7}
                  className="bg-neutral-100 dark:bg-neutral-700 rounded-2xl pr-4 flex-row items-center justify-between shadow-sm overflow-hidden min-h-[90px]"
                >
                  <View className="flex-row items-center gap-4 flex-1">
                    {/* Order image (left side overlapping bg) */}
                    <View className="relative w-24 h-[90px] items-center justify-center">
                      <Image
                        source={
                          isDark
                            ? require("../../assets/images/food-bg.png")
                            : require("../../assets/images/dark-food-bg.png")
                        }
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                        }}
                        contentFit="cover"
                      />
                      <Image
                        source={{
                          uri:
                            order.items[0]?.image ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                        }}
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 28,
                          zIndex: 10,
                          marginLeft: 10,
                        }}
                        contentFit="cover"
                      />
                    </View>

                    {/* Order details */}
                    <View className="flex-1 py-3">
                      <Text
                        className="text-neutral-900 dark:text-white font-semibold text-[16px]"
                        numberOfLines={1}
                      >
                        {order.restaurantName}
                      </Text>
                      <View className="flex-row items-center gap-4 mt-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons
                            name="wallet-outline"
                            size={16}
                            color="#FFB01D"
                          />
                          <Text className="text-neutral-500 dark:text-neutral-300 text-[13px] font-medium">
                            ${order.total.toFixed(2)}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Feather name="calendar" size={16} color="#FF7B2C" />
                          <Text className="text-neutral-500 dark:text-neutral-300 text-[13px] font-medium">
                            {formatDate(order.createdAt)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  <View className="w-10 h-10 rounded-xl bg-orange-500 items-center justify-center">
                    <Feather name="more-horizontal" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              </PopInView>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Order Detail Modal */}
      <Modal visible={!!selectedOrder} transparent animationType="fade">
        <View className="flex-1 items-center justify-center px-4">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-black/60"
          />
          <View className="bg-white dark:bg-neutral-700 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden max-h-[80%]">
            <View className="p-6 md:p-8 flex-1">
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-2xl font-bold dark:text-white">
                    Order Details
                  </Text>
                  {selectedOrder && (
                    <Text className="text-neutral-500 dark:text-neutral-300 text-sm mt-1">
                      {selectedOrder.restaurantName} ·{" "}
                      {formatDate(selectedOrder.createdAt)}
                    </Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedOrder(null)}
                  className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-600 items-center justify-center"
                >
                  <Ionicons
                    name="close"
                    size={24}
                    color={colorScheme === "dark" ? "white" : "#333"}
                  />
                </TouchableOpacity>
              </View>

              <FlatList
                data={selectedOrder?.items || []}
                keyExtractor={(_, idx) => idx.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View className="flex-row items-center justify-between p-4 rounded-2xl bg-neutral-100/50 dark:bg-neutral-600/50 mb-3">
                    <View className="flex-row items-center gap-4 flex-1">
                      <View className="w-14 h-14 rounded-full overflow-hidden">
                        <Image
                          source={{
                            uri:
                              item.image ||
                              "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
                          }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                        />
                      </View>
                      <View>
                        <Text className="font-bold dark:text-white text-base">
                          {item.name}
                        </Text>
                        <Text className="text-sm text-neutral-500 dark:text-neutral-300">
                          {item.qty} x ${item.price.toFixed(2)}
                        </Text>
                      </View>
                    </View>
                    <Text className="font-bold text-orange-500 text-base">
                      ${(item.qty * item.price).toFixed(2)}
                    </Text>
                  </View>
                )}
              />

              {selectedOrder && (
                <View className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-600 flex-row justify-between items-center">
                  <Text className="font-bold text-xl dark:text-white">
                    Total Amount
                  </Text>
                  <Text className="font-bold text-xl text-orange-500">
                    ${selectedOrder.total.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </AppLayout>
  );
};

export default OrderHistory;
