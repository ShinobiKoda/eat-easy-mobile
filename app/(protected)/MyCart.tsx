import React, { useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AppLayout from "../../components/layout/AppLayout";
import { useOrderContext } from "../../contexts/OrderContext";
import { FadeInView, PopInView } from "../../components/animations/reanimated";

const MyCart: React.FC = () => {
  const { orderItems, setOrderItems, handleSend } = useOrderContext();
  const router = useRouter();

  const { subtotal, tax, total, totalQty } = useMemo(() => {
    const items = orderItems as any[];
    const sub = items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);
    const t = sub * 0.1; // Example 10% tax
    const tot = sub + t;
    const qty = items.reduce((acc, item) => acc + (item.qty || 1), 0);
    return { subtotal: sub, tax: t, total: tot, totalQty: qty };
  }, [orderItems]);

  const updateQty = (id: number | string, delta: number) => {
    setOrderItems((prev) => {
      const next = prev.map((p) => {
        const item = p as any;
        if (item.id === id) {
          const newQty = Math.max(0, (item.qty || 1) + delta);
          return { ...item, qty: newQty };
        }
        return item;
      });
      return next.filter((item: any) => item.qty! > 0) as any[];
    });
  };

  const onCheckout = async () => {
    if (orderItems.length === 0) return;
    
    const orderSnapshot = {
      items: orderItems,
      subtotal,
      tax,
      total,
      qty: totalQty,
    };
    
    await handleSend(orderSnapshot);
  };

  return (
    <AppLayout title="My Cart" showMenuButton={true} locationIcon={false} backButton={false}>
      <ScrollView 
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* <FadeInView>
          <View className="mb-6">
            <Text className="text-2xl font-bold dark:text-white mb-2">Your Order</Text>
            <Text className="text-neutral-500 dark:text-neutral-400">
              {orderItems.length} {orderItems.length === 1 ? "item" : "items"} in cart
            </Text>
          </View>
        </FadeInView> */}

        {orderItems.length === 0 ? (
          <FadeInView delay={100}>
            <View className="items-center justify-center py-20">
              <Feather name="shopping-bag" size={64} color="#D4D4D8" />
              <Text className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mt-6 mb-2">
                Your cart is empty
              </Text>
              <Text className="text-neutral-400 text-center max-w-[250px] mb-8">
                Looks like you haven't added anything to your order yet.
              </Text>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => router.push("/(protected)/FullMenu")}
                className="bg-orange-500 px-8 py-3 rounded-2xl"
              >
                <Text className="text-white font-bold text-base">Browse Menu</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
        ) : (
          <View className="gap-4 mb-8">
            {(orderItems as any[]).map((item, idx) => (
              <PopInView key={`${item.id}-${idx}`} delay={idx * 50}>
                <View className="bg-white dark:bg-neutral-800 rounded-2xl p-4 shadow-sm flex-row items-center justify-between">
                  <View className="flex-row items-center gap-4 flex-1">
                    <View className="w-16 h-16 rounded-full overflow-hidden bg-neutral-100 dark:bg-neutral-700">
                      <Image 
                        source={{ uri: item.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" }} 
                        style={{ width: "100%", height: "100%" }} 
                        contentFit="cover" 
                      />
                    </View>
                    <View className="flex-1">
                      <Text className="text-base font-bold text-neutral-900 dark:text-white mb-1" numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text className="text-orange-500 font-bold">
                        ${(item.price || 0).toFixed(2)}
                      </Text>
                    </View>
                  </View>
                  
                  {/* Qty Controls */}
                  <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-700 rounded-full px-3 py-1.5 ml-2">
                    <TouchableOpacity 
                      className="w-6 h-6 items-center justify-center"
                      onPress={() => updateQty(item.id, -1)}
                    >
                      <Feather name="minus" size={14} color="#a3a3a3" />
                    </TouchableOpacity>
                    <Text className="mx-3 font-bold dark:text-white min-w-[14px] text-center">
                      {item.qty}
                    </Text>
                    <TouchableOpacity 
                      className="w-6 h-6 items-center justify-center bg-white dark:bg-neutral-600 rounded-full shadow-sm"
                      onPress={() => updateQty(item.id, 1)}
                    >
                      <Feather name="plus" size={14} color="#FF7B2C" />
                    </TouchableOpacity>
                  </View>
                </View>
              </PopInView>
            ))}
          </View>
        )}

        {/* Order Summary */}
        {orderItems.length > 0 && (
          <FadeInView delay={200}>
            <View className="bg-white dark:bg-neutral-800 rounded-3xl p-6 shadow-sm">
              <Text className="text-lg font-bold dark:text-white mb-4">Order Summary</Text>
              
              <View className="space-y-3 mb-4 border-b border-neutral-100 dark:border-neutral-700 pb-4">
                <View className="flex-row justify-between items-center">
                  <Text className="text-neutral-500 dark:text-neutral-400">Subtotal</Text>
                  <Text className="font-semibold dark:text-neutral-200">${subtotal.toFixed(2)}</Text>
                </View>
                <View className="flex-row justify-between items-center mt-3">
                  <Text className="text-neutral-500 dark:text-neutral-400">Tax & Fees (10%)</Text>
                  <Text className="font-semibold dark:text-neutral-200">${tax.toFixed(2)}</Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold dark:text-white">Total</Text>
                <Text className="text-xl font-bold text-orange-500">${total.toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCheckout}
                className="bg-orange-500 w-full py-4 rounded-2xl flex-row items-center justify-center gap-2"
              >
                <Feather name="shopping-cart" size={18} color="white" />
                <Text className="text-white font-bold text-lg">Send to Kitchen</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
        )}
      </ScrollView>
    </AppLayout>
  );
};

export default MyCart;
