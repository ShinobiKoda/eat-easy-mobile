import React from "react";
import ContentLoader, { Rect } from "react-content-loader/native";
import { View } from "react-native";

const RestaurantSkeleton = () => {
  return (
    <View className="flex flex-row items-center justify-between p-5 bg-white shadow-md rounded-xl mb-4">
      <View className="flex-1 mr-4">
        <ContentLoader
          speed={2}
          width={250}
          height={60}
          viewBox="0 0 250 60"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb"
        >
          {/* Title */}
          <Rect x="0" y="0" rx="4" ry="4" width="200" height="20" />
          {/* Subtitle */}
          <Rect x="0" y="35" rx="4" ry="3" width="150" height="15" />
        </ContentLoader>
      </View>
      <View className="w-5 h-5 rounded-full border border-neutral-300 bg-white items-center justify-center">
        {/* Placeholder for radio circle, static since it's just a skeleton container lookalike */}
      </View>
    </View>
  );
};

export default RestaurantSkeleton;
