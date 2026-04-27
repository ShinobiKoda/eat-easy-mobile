import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Feather } from "@expo/vector-icons";
import type { Coupon } from "../../services/couponService";
import { SlideInUpView } from "../animations/reanimated";

interface CouponDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
}

const CouponDetailModal: React.FC<CouponDetailModalProps> = ({
  isOpen,
  onClose,
  coupon,
}) => {
  const [copied, setCopied] = useState(false);

  if (!coupon) return null;

  const handleCopy = async () => {
    await Clipboard.setStringAsync(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired = new Date(coupon.expiresAt) < new Date();

  return (
    <Modal
      visible={isOpen}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-center items-center px-5">
        <SlideInUpView className="w-full max-w-[420px] bg-white dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-2xl">
          {/* Header section */}
          <View className="bg-neutral-50 dark:bg-neutral-700 p-8 flex flex-col items-center justify-center border-b border-neutral-150 dark:border-neutral-600">
            <View className="w-24 h-24 rounded-full bg-[#50506F] flex items-center justify-center mb-4 shadow-lg overflow-hidden">
              <Feather name="gift" size={40} color="white" />
            </View>

            <Text className="text-xl font-bold font-mullish text-neutral-900 dark:text-white text-center">
              {coupon.description}
            </Text>

            <View className="mt-3">
              {coupon.isUsed ? (
                <View className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                  <Text className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Redeemed</Text>
                </View>
              ) : isExpired ? (
                <View className="px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                  <Text className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase tracking-wider">Expired</Text>
                </View>
              ) : (
                <View className="px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <Text className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase tracking-wider">Active</Text>
                </View>
              )}
            </View>
          </View>

          {/* Body */}
          <View className="p-8">
            {/* Code Box */}
            <View className="mb-6">
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 font-medium text-center mb-2">
                Your unique promo code
              </Text>
              <TouchableOpacity
                onPress={handleCopy}
                activeOpacity={0.7}
                className="flex-row items-center justify-between bg-orange-50 dark:bg-orange-900/10 border-2 border-dashed border-orange-500/50 rounded-2xl p-4"
              >
                <Text className="text-2xl font-bold text-orange-500 tracking-wider">
                  {coupon.code}
                </Text>
                <Feather name={copied ? "check" : "copy"} size={20} color="#f97316" />
              </TouchableOpacity>
              {copied && (
                <Text className="text-xs text-center text-orange-500 font-semibold mt-1">
                  Copied to clipboard!
                </Text>
              )}
            </View>

            <View className="w-full h-px bg-neutral-150 dark:bg-neutral-700 mb-6" />

            {/* Info */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <View className="flex-row items-center">
                  <Feather name="calendar" size={16} color="#71717a" />
                  <Text className="text-neutral-600 dark:text-neutral-300 text-sm font-medium ml-2">Valid until</Text>
                </View>
                <Text className="text-neutral-900 dark:text-white font-bold text-sm">
                  {new Date(coupon.expiresAt).toLocaleDateString()}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">
                  Discount Type
                </Text>
                <Text className="text-neutral-900 dark:text-white font-bold text-sm">
                  {coupon.isFreeItem
                    ? "Free Item"
                    : `${coupon.discountPercent}% OFF`}
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.8}
              className="w-full py-4 rounded-xl bg-neutral-150 dark:bg-neutral-700 items-center"
            >
              <Text className="text-neutral-800 dark:text-white font-bold text-sm">Close</Text>
            </TouchableOpacity>
          </View>
        </SlideInUpView>
      </View>
    </Modal>
  );
};

export default CouponDetailModal;
