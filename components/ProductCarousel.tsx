import React, { useState, useRef, useEffect } from "react";
import { View, Text, FlatList, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import { Image } from "expo-image";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

const { width } = Dimensions.get("window");

const Product = [
  {
    id: 1,
    name: "Avocado Chicken Salad",
    price: "$10.00",
    image: require("../assets/images/virtual-assistant-empty.png"), // Placeholder
    description: "Product of the day",
  },
  {
    id: 2,
    name: "Grilled Salmon Bowl",
    price: "$12.50",
    image: require("../assets/images/virtual-assistant-empty.png"),
    description: "Chef's special",
  },
  {
    id: 3,
    name: "Vegan Buddha Bowl",
    price: "$9.80",
    image: require("../assets/images/virtual-assistant-empty.png"),
    description: "Healthy pick",
  },
  {
    id: 4,
    name: "Quinoa Power Salad",
    price: "$11.20",
    image: require("../assets/images/virtual-assistant-empty.png"),
    description: "Energizer",
  },
];

const ProductCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isAutoScrolling = useRef(true);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isAutoScrolling.current) {
      intervalRef.current = setInterval(() => {
        let nextIndex = activeIndex + 1;
        if (nextIndex >= Product.length) nextIndex = 0;
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
        setActiveIndex(nextIndex);
      }, 4000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeIndex]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  const onScrollBeginDrag = () => {
    isAutoScrolling.current = false;
  };

  const onScrollEndDrag = () => {
    setTimeout(() => {
      isAutoScrolling.current = true;
    }, 8000);
  };

  return (
    <View className="py-4">
      <FlatList
        ref={flatListRef}
        data={Product}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={onScrollBeginDrag}
        onScrollEndDrag={onScrollEndDrag}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingHorizontal: width * 0.05 }}
        snapToAlignment="center"
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View
            style={{ width: width * 0.9, height: 160, marginRight: width * 0.05 }}
            className="rounded-2xl bg-neutral-900 dark:bg-neutral-150 flex-row overflow-hidden items-center justify-between"
          >
            <View className="flex-1 p-4">
              <Text className="text-sm text-neutral-400 dark:text-neutral-500 mb-2">
                {item.description}
              </Text>
              <Text className="text-white dark:text-neutral-900 font-semibold text-lg md:text-xl mb-1">
                {item.name}
              </Text>
              <Text className="text-yellow-400 font-bold text-2xl">
                {item.price}
              </Text>
            </View>
            <View className="w-[140px] h-full">
              <Image
                source={item.image}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ProductCarousel;
