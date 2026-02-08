import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export interface HeaderProps {
  title?: string;
  description?: string;
  locationIcon?: string;
  backButton?: boolean;
  goBack?: () => Promise<void>;
  showSideBar: boolean;
  showMenuButton?: boolean;
  openSideBar?: () => void;
}

const Header = ({
  title,
  locationIcon,
  backButton,
  goBack,
  showMenuButton,
  openSideBar,
}: HeaderProps) => {
  return (
    <View className="w-full flex flex-row items-center justify-between">
      <View className="w-full flex flex-row items-center">
        {backButton && (
          <Pressable onPress={goBack}>
            <View className="w-[44px] h-[44px] rounded-xl flex items-center justify-center">
              {locationIcon && (
                <Ionicons name="arrow-back" size={24} color="black" />
              )}
            </View>
          </Pressable>
        )}
        <View className="flex items-center gap-3">
          <Ionicons name="location" size={24} color="black" />
          <Text>{title}</Text>
        </View>
      </View>
      {showMenuButton && (
        <Pressable onPress={openSideBar}>
          <Ionicons name="menu" size={24} color="black" />
        </Pressable>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
