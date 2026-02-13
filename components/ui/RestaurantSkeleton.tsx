import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { useColorScheme, View } from "react-native";

const RestaurantSkeleton = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex flex-row items-center justify-between p-5 bg-white shadow-md dark:bg-neutral-700 rounded-xl mb-4">
      <View className="flex-1 mr-4">
        <ContentLoader
          speed={2}
          width={250}
          height={60}
          viewBox="0 0 250 60"
          backgroundColor={isDark ? "#555570" : "#f3f3f3"}
          foregroundColor={isDark ? "#6a6a85" : "#ecebeb"}
        >
          {/* Title */}
          <Rect x="0" y="0" rx="4" ry="4" width="200" height="20" />
          {/* Subtitle */}
          <Rect x="0" y="35" rx="4" ry="3" width="150" height="15" />
        </ContentLoader>
      </View>
      <View className="w-5 h-5 rounded-full border border-neutral-300 dark:border-neutral-500 bg-white dark:bg-neutral-600 items-center justify-center" />
    </View>
  );
};

export default RestaurantSkeleton;
