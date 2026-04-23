import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
} from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../../components/layout/Header";
import { useOrder } from "../../hooks/useOrder";
import { useRestaurant } from "../../contexts/RestaurantContext";
import { orderService } from "../../services/orderService";
import { couponService, type Coupon } from "../../services/couponService";
import Success from "../../components/Checkout/Success";
import ProcessingPayment from "../../components/Checkout/ProcessingPayment";
import { FadeInView, ScaleOnPressView } from "../../components/animations/reanimated";
import type { PropType } from "../../types";

const OrderCheckout: React.FC = () => {
  const { selectedRestaurant, getStorageKey } = useRestaurant();
  const restaurantName = selectedRestaurant?.name || "Gram Bistro";
  const { orderItems: cartItems, setOrderItems } = useOrder();

  const [toggleOrderList, setToggleOrderList] = useState(false);
  const [tip, setTip] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [orderFromState, setOrderFromState] = useState<any>(null);

  useEffect(() => {
    AsyncStorage.getItem("eat-easy-current-checkout-order").then((raw) => {
      if (raw) setOrderFromState(JSON.parse(raw));
    }).catch(() => {});
  }, []);

  const groupedItems = useMemo<{ item: PropType; qty: number }[]>(() => {
    if (orderFromState?.items) {
      return orderFromState.items.map((i: any) => ({ item: i as PropType, qty: i.qty || 1 }));
    }
    const groups: Record<number, { item: PropType; qty: number }> = {};
    cartItems.forEach((item) => {
      if (groups[item.id]) groups[item.id].qty += 1;
      else groups[item.id] = { item, qty: (item as any).qty || 1 };
    });
    return Object.values(groups);
  }, [cartItems, orderFromState]);

  const orderTotal = useMemo(() => {
    if (orderFromState?.total) return orderFromState.total;
    return cartItems.reduce((s, i) => s + (i.price || 0), 0);
  }, [cartItems, orderFromState]);

  const tax = orderTotal * 0.11;
  const discountAmount = appliedCoupon
    ? appliedCoupon.isFreeItem ? 5.0 : (orderTotal * appliedCoupon.discountPercent) / 100
    : 0;
  const total = Math.max(0, orderTotal + tax - discountAmount + tip);
  const totalRef = useRef(total);
  const orderTotalRef = useRef(orderTotal);
  useEffect(() => { totalRef.current = total; orderTotalRef.current = orderTotal; }, [total, orderTotal]);

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsApplyingCoupon(true); setCouponError(null);
    try {
      const c = await couponService.validateCouponCode(couponCode);
      setAppliedCoupon(c); setCouponCode("");
    } catch (e: any) { setCouponError(e.message || "Invalid coupon"); setAppliedCoupon(null); }
    finally { setIsApplyingCoupon(false); }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 3000));
    try {
      await orderService.saveOrder({
        restaurantName, items: groupedItems.map(({ item, qty }) => ({ id: item.id, name: item.name, image: item.image, price: item.price, qty })),
        subtotal: orderTotalRef.current, tax: orderTotalRef.current * 0.11, tip, total: totalRef.current,
      });
      if (appliedCoupon) await couponService.redeemCoupon(appliedCoupon.id);
      await couponService.evaluatePostOrderRewards();
    } catch (e) { console.error("Payment error:", e); }
    finally { setIsProcessing(false); }
    try {
      await AsyncStorage.removeItem(getStorageKey("eat-easy-cart"));
      await AsyncStorage.removeItem("eat-easy-current-checkout-order");
      setOrderItems([]);
    } catch {}
    setShowSuccessModal(true);
  };

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Checkout" backButton showSideBar={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <FadeInView>
          <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm mb-4">
            <TouchableOpacity onPress={() => setToggleOrderList(!toggleOrderList)} className="flex-row justify-between items-center mb-4">
              <Text className="text-neutral-800 dark:text-white font-bold text-lg">Order list</Text>
              <Feather name={toggleOrderList ? "chevron-up" : "chevron-down"} size={20} color="#FFB01D" />
            </TouchableOpacity>
            {!toggleOrderList && groupedItems.map(({ item, qty }) => (
              <View key={item.id} className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 rounded-full overflow-hidden">
                    <Image source={{ uri: item.image }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
                  </View>
                  <Text className="text-[15px] font-semibold dark:text-white flex-1" numberOfLines={1}>{item.name}</Text>
                </View>
                <Text className="text-[15px] dark:text-white"><Text className="text-neutral-400">{qty}x </Text><Text className="font-bold">${item.price.toFixed(2)}</Text></Text>
              </View>
            ))}
            <View className="gap-3 border-t border-neutral-100 dark:border-neutral-600 pt-4">
              <View className="flex-row justify-between"><Text className="text-neutral-400">Subtotal</Text><Text className="font-bold dark:text-white">${orderTotal.toFixed(2)}</Text></View>
              <View className="flex-row justify-between"><Text className="text-neutral-400">Tax</Text><Text className="font-bold dark:text-white">${tax.toFixed(2)}</Text></View>
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={100}>
          <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm mb-4">
            <Text className="text-neutral-800 dark:text-white font-bold text-lg mb-4">Discount & Tips</Text>
            <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-3 mb-3">
              <Feather name="percent" size={16} color="#8E8EA9" />
              <TextInput value={couponCode} onChangeText={setCouponCode} placeholder="Discount code" placeholderTextColor="#8E8EA9" className="flex-1 ml-3 text-[15px] dark:text-white" />
              <TouchableOpacity onPress={handleApplyCoupon} disabled={!couponCode || isApplyingCoupon} className="bg-purple-600 px-4 py-2 rounded-xl" style={{ opacity: !couponCode ? 0.5 : 1 }}>
                <Text className="text-white text-sm font-semibold">{isApplyingCoupon ? "..." : "Apply"}</Text>
              </TouchableOpacity>
            </View>
            {couponError && <Text className="text-red-500 text-sm mb-2 ml-2">{couponError}</Text>}
            {appliedCoupon && (
              <View className="flex-row items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl mb-3">
                <Text className="font-semibold text-sm text-green-600">✓ {appliedCoupon.code}</Text>
                <TouchableOpacity onPress={() => setAppliedCoupon(null)}><Text className="text-xs underline text-green-600">Remove</Text></TouchableOpacity>
              </View>
            )}
            <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl px-4 py-3">
              <Ionicons name="wallet-outline" size={16} color="#8E8EA9" />
              <TextInput placeholder="Add tips" placeholderTextColor="#8E8EA9" value={tip > 0 ? `$ ${tip.toFixed(2)}` : ""} onChangeText={(t) => { const r = t.replace(/\D/g, ""); setTip(r ? parseInt(r, 10) / 100 : 0); }} keyboardType="numeric" className="flex-1 ml-3 text-[15px] dark:text-white" />
            </View>
          </View>
        </FadeInView>

        <FadeInView delay={200}>
          <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm">
            {appliedCoupon && (
              <View className="flex-row justify-between mb-3">
                <Text className="font-bold text-green-600">Discount</Text>
                <Text className="font-bold text-green-600">-${discountAmount.toFixed(2)}</Text>
              </View>
            )}
            <View className="flex-row justify-between items-center">
              <Text className="text-neutral-800 dark:text-white font-bold text-xl">Total</Text>
              <Text className="text-orange-500 font-extrabold text-2xl">${total.toFixed(2)}</Text>
            </View>
          </View>
        </FadeInView>
      </ScrollView>

      <View className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700 px-5 py-4 flex-row items-center justify-between">
        <Text className="text-neutral-400 font-semibold flex-1">Ready to pay</Text>
        <ScaleOnPressView onPress={handlePay} disabled={groupedItems.length === 0} className="bg-purple-600 rounded-2xl px-8 py-4 flex-row items-center gap-2" style={{ opacity: groupedItems.length === 0 ? 0.5 : 1 }}>
          <Text className="text-white font-bold text-base">Pay ${total.toFixed(2)}</Text>
        </ScaleOnPressView>
      </View>

      <Success isOpen={showSuccessModal} />
      <ProcessingPayment isOpen={isProcessing} />
    </View>
  );
};

export default OrderCheckout;
