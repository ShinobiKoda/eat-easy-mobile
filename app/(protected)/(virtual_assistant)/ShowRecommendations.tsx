import AppLayout from "@/components/layout/AppLayout";
import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const tabs = ["Eat", "Drink", "Dessert"];

const ShowRecommendations = () => {
  const [selectedTab, setSelectedTab] = useState("Eat");

  return (
    <AppLayout title="Gbam Bistro">
      <View className="flex-1 mt-3">
        <Text className="font-dm-medium text-neutral-800 text-[22px]">
          We think you might enjoy these specially selected dishes
        </Text>
        <View className="w-full flex flex-row gap-2 justify-between mt-5">
          {tabs.map((tab, index) => (
            <Pressable
              onPress={()=> setSelectedTab(tab)}
              className={`px-[14px] py-3 rounded-2xl ${selectedTab === tab ? "bg-yellow-1": ""} `}
              key={index}
            >
              <Text className={`${selectedTab === tab ? "text-white" : ""} font-mulish-bold text-base text-neutral-600` }>{tab}</Text>
            </Pressable>
          ))}
          <View className="w-[44px] h-[44px] rounded-xl bg-white flex items-center justify-items-center"></View>
        </View>
      </View>
    </AppLayout>
  );
};

export default ShowRecommendations;

const styles = StyleSheet.create({});
