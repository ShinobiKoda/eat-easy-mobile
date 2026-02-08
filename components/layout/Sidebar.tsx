import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const menuItems = [
    { icon: "person-outline", label: "Profile" },
    { icon: "cart-outline", label: "Orders" },
    { icon: "card-outline", label: "Payment Methods" },
    { icon: "settings-outline", label: "Settings" },
    { icon: "help-circle-outline", label: "Help & Support" },
  ];

  return (
    <LinearGradient
      // start={{ x: 0, y: 0.5 }}
      // end={{ x: 1, y: 0.5 }}
      colors={["#32324D", "#32324D", "#2C2C45", "#32324D"]}
      locations={[0, 0.1, 0.52, 0.9]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </Pressable>
        </View>

        <View style={styles.menuList}>
          {menuItems.map((item, index) => (
            <Pressable key={index} style={styles.menuItem}>
              <Ionicons name={item.icon as any} size={24} color="#fff" />
              <Text style={styles.menuText}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </LinearGradient>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    height: "100%",
  },
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Mulish-Bold", // Ensure this font exists or use system font
  },
  closeButton: {
    padding: 8,
  },
  menuList: {
    flex: 1,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    paddingVertical: 8,
  },
  menuText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 16,
    fontFamily: "Mulish-Medium", // Ensure this font exists or use system font
  },
});
