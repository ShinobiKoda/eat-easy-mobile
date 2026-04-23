import React, { useEffect, useState } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, Modal, FlatList, ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import Header from "../../components/layout/Header";
import { orderService, type OrderRecord } from "../../services/orderService";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { FadeInView, PopInView, ScaleOnPressView } from "../../components/animations/reanimated";
import { useColorScheme } from "react-native";

const filterTabs = ["All your orders", "Last 7 days", "Last 14 days", "Last 30 days"];

const OrderHistory: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("All your orders");
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const { selectedRestaurant } = useRestaurant();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await orderService.getUserOrders();
        setOrders(data);
      } catch (e) { console.error("Failed to fetch orders:", e); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const filteredOrders = orders.filter((order) => {
    if (activeFilter === "All your orders") return true;
    const diff = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 86400000);
    if (activeFilter === "Last 7 days") return diff <= 7;
    if (activeFilter === "Last 14 days") return diff <= 14;
    if (activeFilter === "Last 30 days") return diff <= 30;
    return true;
  });

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Order History" backButton showSideBar={false} />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Active Restaurant Card */}
        <FadeInView>
          <View className="rounded-3xl bg-neutral-800 dark:bg-neutral-200 p-6 mb-6 overflow-hidden">
            <View className="flex-row items-center gap-2 mb-1">
              <View className="bg-orange-500/20 px-3 py-1 rounded-lg">
                <Text className="text-orange-500 text-xs font-semibold">Active Restaurant</Text>
              </View>
            </View>
            <Text className="text-white dark:text-neutral-800 font-bold text-2xl mt-2">
              {selectedRestaurant?.name || "Gram Bistro"}
            </Text>
            <Text className="text-neutral-400 dark:text-neutral-600 text-sm mt-1">
              View real-time updates on your current order.
            </Text>
          </View>
        </FadeInView>

        {/* Filter Tabs */}
        <FadeInView delay={100}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
            {filterTabs.map((tab) => (
              <ScaleOnPressView
                key={tab}
                onPress={() => setActiveFilter(tab)}
                className={`px-4 py-2.5 rounded-2xl mr-2 ${
                  activeFilter === tab
                    ? "bg-yellow-400"
                    : "bg-transparent"
                }`}
              >
                <Text className={`text-sm font-semibold ${
                  activeFilter === tab
                    ? "text-neutral-800 font-bold"
                    : "text-neutral-500 dark:text-neutral-300"
                }`}>
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
              <Text className="text-neutral-500 dark:text-neutral-300 text-base">
                {activeFilter === "All your orders"
                  ? "No orders yet. Place your first order!"
                  : `No orders in the ${activeFilter.toLowerCase()}.`}
              </Text>
            </View>
          </FadeInView>
        ) : (
          filteredOrders.map((order, i) => (
            <PopInView key={order.id} delay={i * 60}>
              <TouchableOpacity
                onPress={() => setSelectedOrder(order)}
                activeOpacity={0.7}
                className="bg-neutral-100 dark:bg-neutral-700 rounded-2xl p-4 flex-row items-center justify-between mb-3 shadow-sm"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-14 h-14 rounded-full overflow-hidden bg-neutral-200 dark:bg-neutral-600">
                    {order.items[0]?.image && (
                      <Image source={{ uri: order.items[0].image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="text-neutral-800 dark:text-white font-semibold text-base" numberOfLines={1}>
                      {order.restaurantName}
                    </Text>
                    <View className="flex-row items-center gap-3 mt-1">
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="wallet-outline" size={14} color="#FFB01D" />
                        <Text className="text-neutral-500 dark:text-neutral-300 text-xs">
                          ${order.total.toFixed(2)}
                        </Text>
                      </View>
                      <View className="flex-row items-center gap-1">
                        <Feather name="calendar" size={14} color="#FF7B2C" />
                        <Text className="text-neutral-500 dark:text-neutral-300 text-xs">
                          {formatDate(order.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <Feather name="chevron-right" size={20} color="#a3a3a3" />
              </TouchableOpacity>
            </PopInView>
          ))
        )}
      </ScrollView>

      {/* Order Detail Modal */}
      <Modal visible={!!selectedOrder} transparent animationType="slide">
        <View className="flex-1 justify-end">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setSelectedOrder(null)}
            className="flex-1 bg-black/50"
          />
          <View className="bg-white dark:bg-neutral-800 rounded-t-3xl p-6 max-h-[70%]">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-xl font-bold dark:text-white">Order Details</Text>
                {selectedOrder && (
                  <Text className="text-neutral-500 dark:text-neutral-300 text-sm mt-1">
                    {selectedOrder.restaurantName} · {formatDate(selectedOrder.createdAt)}
                  </Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => setSelectedOrder(null)}
                className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 items-center justify-center"
              >
                <Ionicons name="close" size={24} color={colorScheme === "dark" ? "white" : "#333"} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={selectedOrder?.items || []}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <View className="flex-row items-center justify-between p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-700/50 mb-2">
                  <View className="flex-row items-center gap-3 flex-1">
                    <View className="w-12 h-12 rounded-full overflow-hidden">
                      <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                    </View>
                    <View>
                      <Text className="font-bold dark:text-white">{item.name}</Text>
                      <Text className="text-sm text-neutral-500 dark:text-neutral-300">
                        {item.qty} x ${item.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-bold text-orange-500">${(item.qty * item.price).toFixed(2)}</Text>
                </View>
              )}
            />

            {selectedOrder && (
              <View className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-700 flex-row justify-between">
                <Text className="font-bold text-lg dark:text-white">Total</Text>
                <Text className="font-bold text-lg text-orange-500">${selectedOrder.total.toFixed(2)}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default OrderHistory;
