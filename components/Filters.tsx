import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

export type FiltersProps = {
  onClose: () => void;
  onApply?: (filters: {
    productTypes: string[];
    ratings: number[];
    priceRange: [number, number];
  }) => void;
  initialFilters?: {
    productTypes: string[];
    ratings: number[];
    priceRange: [number, number];
  };
  mainCategory: "Eat" | "Drink" | "Dessert";
};

const FilterOptions: Record<string, { id: number; name: string }[]> = {
  Eat: [
    { id: 1, name: "Pizza" },
    { id: 2, name: "Burger" },
    { id: 3, name: "Salad" },
    { id: 4, name: "Soup" },
    { id: 5, name: "Chicken" },
    { id: 6, name: "Grill" },
    { id: 7, name: "Breakfast" },
    { id: 8, name: "Lunch" },
    { id: 9, name: "Dinner" },
  ],
  Drink: [
    { id: 10, name: "Coffee" },
    { id: 11, name: "Tea" },
    { id: 12, name: "Milk Drinks" },
    { id: 13, name: "Chocolate" },
    { id: 14, name: "Energy" },
    { id: 15, name: "Smoothie" },
    { id: 16, name: "Juice" },
  ],
  Dessert: [],
};

const Ratings = [
  { id: 1, name: "1" },
  { id: 2, name: "2" },
  { id: 3, name: "3" },
  { id: 4, name: "4" },
  { id: 5, name: "5" },
];

const Filters: React.FC<FiltersProps> = ({
  onClose,
  onApply,
  initialFilters,
  mainCategory,
}) => {
  const [pendingProductTypes, setPendingProductTypes] = useState<string[]>(
    initialFilters?.productTypes || []
  );
  const [pendingRatings, setPendingRatings] = useState<number[]>(
    initialFilters?.ratings || []
  );
  const [pendingPriceRange, setPendingPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [0, 30]
  );

  const toggleProductType = (name: string) => {
    setPendingProductTypes((prev) =>
      prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]
    );
  };

  const toggleRating = (rating: number) => {
    setPendingRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating]
    );
  };

  const handleApply = () => {
    onApply?.({
      productTypes: pendingProductTypes,
      ratings: pendingRatings,
      priceRange: pendingPriceRange,
    });
    onClose();
  };

  return (
    <View
      style={styles.container}
      className="bg-[#f7f7f7] dark:bg-[#32324D]"
      onStartShouldSetResponder={() => true}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <View className="flex-row justify-between items-center px-6 py-5 border-b border-neutral-200 dark:border-neutral-600">
        <Text className="text-xl font-bold dark:text-white">Filters</Text>
        <TouchableOpacity onPress={onClose} className="p-1">
          <Feather name="x" size={24} color="#a3a3a3" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 py-4 flex-1">
        {/* Product Type */}
        <View className="mb-6">
          <Text className="text-neutral-500 dark:text-neutral-200 font-semibold mb-3">
            Select Product Type
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {FilterOptions[mainCategory]?.map((type) => {
              const isSelected = pendingProductTypes.includes(type.name);
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => toggleProductType(type.name)}
                  className={`px-4 py-2 rounded-2xl border ${
                    isSelected
                      ? "bg-amber-500 border-amber-500"
                      : "bg-white dark:bg-[#4A4A6A] border-neutral-300 dark:border-neutral-500"
                  }`}
                >
                  <Text
                    className={
                      isSelected ? "text-white font-medium" : "text-neutral-600 dark:text-neutral-200 font-medium"
                    }
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rating */}
        <View className="mb-6">
          <Text className="text-neutral-500 dark:text-neutral-200 font-semibold mb-3">
            Rating
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {Ratings.map((rating) => {
              const val = parseInt(rating.name);
              const isSelected = pendingRatings.includes(val);
              return (
                <TouchableOpacity
                  key={rating.id}
                  onPress={() => toggleRating(val)}
                  className={`px-4 py-2 rounded-2xl border flex-row items-center gap-1 ${
                    isSelected
                      ? "bg-amber-500 border-amber-500"
                      : "bg-white dark:bg-[#4A4A6A] border-neutral-300 dark:border-neutral-500"
                  }`}
                >
                  <Ionicons name="star" size={16} color={isSelected ? "white" : "#F59E0B"} />
                  <Text
                    className={
                      isSelected ? "text-white font-medium" : "text-neutral-600 dark:text-neutral-200 font-medium"
                    }
                  >
                    {rating.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Dummy Price range for now */}
        <View className="mb-6">
          <Text className="text-neutral-500 dark:text-neutral-200 font-semibold mb-3">
            Maximum Price: ${pendingPriceRange[1]}
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {[1, 8, 15, 22, 30].map((val) => {
              const isSelected = pendingPriceRange[1] === val;
              return (
                <TouchableOpacity
                  key={val}
                  onPress={() => setPendingPriceRange([0, val])}
                  className={`px-4 py-2 rounded-2xl border ${
                    isSelected
                      ? "bg-amber-500 border-amber-500"
                      : "bg-white dark:bg-[#4A4A6A] border-neutral-300 dark:border-neutral-500"
                  }`}
                >
                  <Text
                    className={
                      isSelected ? "text-white font-medium" : "text-neutral-600 dark:text-neutral-200 font-medium"
                    }
                  >
                    ${val}{val === 30 ? "+" : ""}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View className="px-6 py-4 border-t border-neutral-200 dark:border-neutral-600">
        <TouchableOpacity
          onPress={handleApply}
          className="bg-[#32324D] dark:bg-purple-600 py-4 rounded-2xl items-center"
        >
          <Text className="text-white font-bold text-base">Apply Filters</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.75,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: "absolute",
    bottom: 0,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
});

export default Filters;
