import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  TextInput,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons, FontAwesome5 } from "@expo/vector-icons";
import type { PropType } from "../../types";

export type ViewDishProps = {
  item: PropType | null;
  onClose: () => void;
  onAddToOrder?: (order: any) => void;
};

const ViewDish: React.FC<ViewDishProps> = ({ item, onClose, onAddToOrder }) => {
  if (!item) return null;

  const [selectedToppings, setSelectedToppings] = useState<Set<number>>(
    new Set()
  );
  const [toppingCounts, setToppingCounts] = useState<Record<number, number>>({});
  const [count, setCount] = useState(1);
  const [requestText, setRequestText] = useState("");

  const toggleCheck = (id: number) => {
    setSelectedToppings((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setToppingCounts((prevCounts) => {
          const nextCounts = { ...prevCounts };
          delete nextCounts[id];
          return nextCounts;
        });
      } else {
        next.add(id);
        setToppingCounts((prevCounts) => ({
          ...prevCounts,
          [id]: 1,
        }));
      }
      return next;
    });
  };

  const incrementTopping = (id: number) => {
    setToppingCounts((prev) => {
      const current = prev[id] || 0;
      if (current >= 2) return prev;
      return { ...prev, [id]: current + 1 };
    });
  };

  const decrementTopping = (id: number) => {
    setToppingCounts((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        return prev;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const Increment = () => setCount((c) => c + 1);
  const Decrement = () => setCount((c) => Math.max(1, c - 1));

  const toppingsTotal = item.toppings?.length
    ? item.toppings.reduce((sum, t) => {
        const qty = toppingCounts[t.id] || 0;
        if (!selectedToppings.has(t.id)) return sum;
        return sum + t.price * qty;
      }, 0)
    : 0;

  const formatPrice = (n: number) => `$${n.toFixed(2)}`;

  const handleAddToOrder = () => {
    try {
      const selected = Array.from(selectedToppings).map((id) => {
        const t = (item.toppings ?? []).find((tt) => tt.id === id)!;
        const qty = toppingCounts[id] || 0;
        return {
          id: t.id,
          name: t.name,
          price: t.price,
          qty,
          total: t.price * qty,
        };
      });

      const order = {
        id: item.id,
        name: item.name,
        image: item.image,
        rating: item.rating,
        reviews: item.reviews,
        basePrice: item.price,
        toppings: selected,
        qty: count,
        request: requestText,
        price: (item.price + toppingsTotal) * count,
      };

      onAddToOrder?.(order);
      
      // Provide visual feedback
      Alert.alert(
        "Added to Cart", 
        `${count}x ${item.name} has been added to your cart.`,
        [{ text: "OK", onPress: () => onClose() }]
      );
    } catch (e) {
      console.error("Error adding to order:", e);
      Alert.alert("Error", "Could not add item to order.");
      onClose();
    }
  };

  return (
    <View
      style={styles.container}
      className="bg-[#f7f7f7] dark:bg-[#32324D]"
    >
      <View className="items-center pt-2 pb-4 border-b border-neutral-200 dark:border-neutral-600 relative">
        <View className="w-16 h-1.5 bg-neutral-300 dark:bg-neutral-500 rounded-full mb-4" />
        <TouchableOpacity
          onPress={onClose}
          className="absolute right-6 top-4"
        >
          <Feather name="x" size={24} color="#a3a3a3" />
        </TouchableOpacity>
        
        {/* Dish Image */}
        <View className="w-32 h-32 rounded-full overflow-hidden mb-2">
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
            contentFit="cover"
          />
        </View>

        <View className="flex-row items-center bg-white dark:bg-neutral-700 px-2 py-1 rounded-lg shadow-sm">
          {item.rating < 4.5 ? (
            <Ionicons name="star-half" size={14} color="#F59E0B" />
          ) : (
            <Ionicons name="star" size={14} color="#F59E0B" />
          )}
          <Text className="text-sm font-semibold ml-1 dark:text-white">
            {item.rating.toFixed(1)}
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 24 }}>
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-xl font-bold dark:text-white flex-1 mr-4">
            {item.name}
          </Text>
          <Text className="text-xl font-extrabold text-orange-500">
            {formatPrice(item.price)}
          </Text>
        </View>
        <Text className="text-base text-neutral-500 dark:text-neutral-300 mb-6">
          {item.text}
        </Text>

        {/* Nutrients */}
        {item.nutrients && item.nutrients.length > 0 && (
          <View className="flex-row justify-between bg-white dark:bg-[#4A4A6A] p-4 rounded-2xl mb-6 shadow-sm">
            {item.nutrients.map((nut: any, idx: number) => (
              <View key={idx} className="items-center">
                <Text className="text-base font-bold text-purple-600 dark:text-white">
                  {nut.amount}
                </Text>
                <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-300">
                  {nut.unit}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Ingredients */}
        {item.ingredients && item.ingredients.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold dark:text-white mb-3">
              Ingredients
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {item.ingredients.map((ing: any, idx: number) => (
                <View
                  key={idx}
                  className="bg-white dark:bg-[#4A4A6A] rounded-2xl p-3 mr-3 items-center w-20 shadow-sm"
                >
                  <View className="w-10 h-10 mb-2">
                    <Image
                      source={{ uri: ing.ingimage }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </View>
                  <Text className="text-xs font-medium text-center text-neutral-600 dark:text-neutral-200" numberOfLines={1}>
                    {ing.ingname}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Toppings */}
        {item.toppings && item.toppings.length > 0 && (
          <View className="mb-6">
            <Text className="text-lg font-semibold dark:text-white mb-3">
              Add toppings
            </Text>
            {item.toppings.map((top: any) => {
              const isSelected = selectedToppings.has(top.id);
              const topCount = toppingCounts[top.id] || 1;
              return (
                <View
                  key={top.id}
                  className="flex-row items-center bg-white dark:bg-[#4A4A6A] rounded-2xl shadow-sm mb-3 overflow-hidden"
                >
                  <TouchableOpacity
                    onPress={() => toggleCheck(top.id)}
                    className="flex-1 flex-row items-center p-4"
                  >
                    <View
                      className={`w-5 h-5 border rounded flex items-center justify-center mr-3 ${
                        isSelected
                          ? "bg-yellow-400 border-yellow-400"
                          : "border-neutral-300 dark:border-neutral-500"
                      }`}
                    >
                      {isSelected && <FontAwesome5 name="check" size={10} color="white" />}
                    </View>
                    <Text className="text-base text-neutral-600 dark:text-neutral-200 flex-1">
                      {top.name}
                    </Text>
                    <Text className="text-base font-semibold text-orange-500">
                      {formatPrice(top.price * (isSelected ? topCount : 1))}
                    </Text>
                  </TouchableOpacity>

                  {isSelected && (
                    <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 px-3 py-4">
                      <TouchableOpacity
                        onPress={() => decrementTopping(top.id)}
                        disabled={topCount <= 1}
                      >
                        <Feather
                          name="minus"
                          size={18}
                          color={topCount <= 1 ? "#d4d4d8" : "#71717a"}
                        />
                      </TouchableOpacity>
                      <Text className="mx-3 text-base font-semibold dark:text-white">
                        {topCount}
                      </Text>
                      <TouchableOpacity 
                        onPress={() => incrementTopping(top.id)}
                        disabled={topCount >= 2}
                      >
                        <Feather 
                          name="plus" 
                          size={18} 
                          color={topCount >= 2 ? "#d4d4d8" : "#71717a"} 
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Special Request */}
        <View className="mb-6">
          <Text className="text-lg font-semibold dark:text-white mb-3">
            Add a request
          </Text>
          <TextInput
            multiline
            numberOfLines={3}
            placeholder="Ex: Don't add onion"
            placeholderTextColor="#a1a1aa"
            value={requestText}
            onChangeText={setRequestText}
            style={{ textAlignVertical: "top" }}
            className="bg-white dark:bg-[#4A4A6A] border border-neutral-200 dark:border-neutral-600 rounded-2xl p-4 text-base text-neutral-700 dark:text-neutral-200"
          />
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="px-6 py-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex-row items-center justify-between">
        <View className="flex-row items-center bg-neutral-100 dark:bg-neutral-800 rounded-2xl p-1 mr-4">
          <TouchableOpacity
            onPress={Decrement}
            disabled={count <= 1}
            className="p-3"
          >
            <Feather
              name="minus"
              size={20}
              color={count <= 1 ? "#d4d4d8" : "#71717a"}
            />
          </TouchableOpacity>
          <Text className="mx-2 text-base font-bold dark:text-white w-6 text-center">
            {count}
          </Text>
          <TouchableOpacity onPress={Increment} className="p-3">
            <Feather name="plus" size={20} color="#71717a" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleAddToOrder}
          className="flex-1 bg-purple-600 rounded-2xl p-4 flex-row justify-center items-center"
        >
          <Text className="text-white font-bold text-base mr-2">
            Add to order
          </Text>
          <Text className="text-white font-extrabold text-base">
            {formatPrice((item.price + toppingsTotal) * count)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    width: width,
    height: height * 0.9,
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

export default ViewDish;
