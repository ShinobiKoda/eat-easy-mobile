import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { supabase } from "@/lib/Supabase";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import {
  BookIcon,
  HelpIcon,
  LocationOutlineIcon,
  LogOutIcon,
  MedalIcon,
  ReceiptIcon,
} from "../icons/Icons";

const MenuButton = ({
  icon: Icon,
  label,
  isActive,
  onPress,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    className="py-[6px] flex-row gap-[10px] items-center"
  >
    {({ pressed }) => (
      <>
        <View
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
            isActive || pressed ? "bg-yellow-1" : "bg-[rgba(255,255,255,0.15)]"
          }`}
        >
          <Icon size={24} color="white" />
        </View>
        <Text
          className={`font-mulish-bold text-base ${
            isActive || pressed
              ? "text-yellow-1"
              : "text-white font-mulish-medium"
          }`}
        >
          {label}
        </Text>
      </>
    )}
  </Pressable>
);

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();
  const [activeItem, setActiveItem] = useState("Food Menu");
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [displayName, setDisplayName] = useState("User");

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata;
        const name = meta?.username || meta?.full_name || meta?.name || "User";
        setDisplayName(name);
      }
    };
    fetchUser();
  }, []);

  const handleLogoutClick = () => {
    setActiveItem("Logout");
    setLogoutModalVisible(true);
  };

  const cancelLogout = () => {
    setLogoutModalVisible(false);
  };

  const confirmLogout = async () => {
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setLogoutModalVisible(false);
      setIsLoggingOut(false);

      if (onClose) onClose();
      router.replace("/(auth)/SignIn");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
      setLogoutModalVisible(false);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={["#32324D", "#32324D", "#2C2C45", "#32324D"]}
      locations={[0, 0.1, 0.52, 0.9]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.title}>
            <Text className="font-mulish-medium text-2xl text-neutral-100">
              Eat
            </Text>
            <Text className="font-mulish-bold text-2xl text-orange-1">
              Easy
            </Text>
          </View>
        </View>

        <View style={styles.profileContainer}>
          <Image
            source={require("../../assets/images/profile-image.png")}
            style={{ width: 68, height: 68 }}
          />
          <View>
            <Text className="font-mulish-semibold text-base text-white">
              {displayName}
            </Text>
            <Pressable>
              <Text className="font-mulish-medium text-sm text-white underline">
                View Profile
              </Text>
            </Pressable>
          </View>
        </View>

        <View className="mt-[50px] px-[30px]">
          <Text className="font-mulish-semibold text-[13px] text-neutral-150">
            MENU
          </Text>
          <View className="gap-4 mt-4">
            <MenuButton
              icon={BookIcon}
              label="Food Menu"
              isActive={activeItem === "Food Menu"}
              onPress={() => setActiveItem("Food Menu")}
            />
            <MenuButton
              icon={ReceiptIcon}
              label="Order History"
              isActive={activeItem === "Order History"}
              onPress={() => setActiveItem("Order History")}
            />
            <MenuButton
              icon={LocationOutlineIcon}
              label="Locations"
              isActive={activeItem === "Locations"}
              onPress={() => setActiveItem("Locations")}
            />
          </View>
        </View>

        <View className="h-px bg-white/20 my-9 mx-[30px]"></View>

        <View className="px-[30px]">
          <Text className="font-mulish-semibold text-[13px] text-neutral-150">
            GENERAL
          </Text>
          <View className="gap-4 mt-4">
            <MenuButton
              icon={MedalIcon}
              label="Rewards"
              isActive={activeItem === "Rewards"}
              onPress={() => setActiveItem("Rewards")}
            />
            <MenuButton
              icon={HelpIcon}
              label="Help"
              isActive={activeItem === "Help"}
              onPress={() => setActiveItem("Help")}
            />
          </View>
        </View>

        <View className="px-[30px] mt-[40px]">
          <MenuButton
            icon={LogOutIcon}
            label="Logout"
            isActive={activeItem === "Logout"}
            onPress={handleLogoutClick}
          />
        </View>

        <ConfirmationModal
          isVisible={isLogoutModalVisible}
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
          title="Log Out"
          message="Are you sure you want to log out?"
          confirmText="Log Out"
          cancelText="Cancel"
          isLoading={isLoggingOut}
          loadingText="Logging out..."
        />
      </View>
    </LinearGradient>
  );
};

export default Sidebar;

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    height: "100%",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
  },
  container: {
    flex: 1,
  },
  header: {},
  title: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "black",
  },
  closeButton: {
    padding: 8,
  },
  profileContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
    paddingHorizontal: 30,
    marginTop: 20,
  },
});
