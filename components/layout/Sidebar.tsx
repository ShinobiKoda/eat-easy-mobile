import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/Supabase";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  BagOutlineIcon,
  BookIcon,
  CartOutlineIcon,
  ChevronForwardIcon,
  HelpIcon,
  HomeOutlineIcon,
  LocationOutlineIcon,
  LogOutIcon,
  MedalIcon,
  MoonIcon,
  RestaurantOutlineIcon,
  ShieldCheckIcon,
  SparklesOutlineIcon,
  SunIcon,
} from "../icons/Icons";

// ── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const avatarGradients: [string, string][] = [
  ["#615793", "#ff7b2c"],
  ["#32324d", "#615793"],
  ["#ffb01d", "#ff7b2c"],
  ["#615793", "#ffb01d"],
];

function pickGradient(name: string): [string, string] {
  let code = 0;
  for (let i = 0; i < name.length; i++) code += name.charCodeAt(i);
  return avatarGradients[code % avatarGradients.length];
}

// ── Menu item type ───────────────────────────────────────────────────────────

interface MenuItem {
  id: string;
  icon: React.FC<{ size?: number; color?: string }>;
  label: string;
  route?: string;
  onPress?: () => void;
}

// ── MenuButton ───────────────────────────────────────────────────────────────

const MenuButton = ({
  icon: Icon,
  label,
  isActive,
  onPress,
  badge,
}: {
  icon: React.FC<{ size?: number; color?: string }>;
  label: string;
  isActive: boolean;
  onPress: () => void;
  badge?: number;
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
          {badge != null && badge > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          )}
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

// ── Cart dropdown sub-item ───────────────────────────────────────────────────

const SubMenuButton = ({
  icon: Icon,
  label,
  isActive,
  onPress,
  badge,
}: {
  icon: React.FC<{ size?: number; color?: string }>;
  label: string;
  isActive: boolean;
  onPress: () => void;
  badge?: number;
}) => (
  <Pressable
    onPress={onPress}
    className="py-[5px] flex-row gap-[10px] items-center ml-4"
  >
    {({ pressed }) => (
      <>
        <View
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isActive || pressed
              ? "bg-[rgba(255,176,29,0.3)]"
              : "bg-[rgba(255,255,255,0.10)]"
          }`}
        >
          <Icon size={20} color={isActive ? "#FFB01D" : "white"} />
          {badge != null && badge > 0 && (
            <View style={[styles.badge, { width: 14, height: 14 }]}>
              <Text style={[styles.badgeText, { fontSize: 8 }]}>{badge}</Text>
            </View>
          )}
        </View>
        <Text
          className={`text-sm ${
            isActive || pressed
              ? "text-yellow-1 font-mulish-semibold"
              : "text-white/80 font-mulish-medium"
          }`}
        >
          {label}
        </Text>
      </>
    )}
  </Pressable>
);

// ── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar = ({ onClose }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // ── User state ──
  const [username, setUsername] = useState("User");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState("?");
  const [gradient, setGradient] = useState<[string, string]>(
    avatarGradients[0],
  );

  // ── UI state ──
  const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ── Determine active item from current route ──
  const activeItem = useMemo(() => {
    if (pathname.includes("Homepage")) return "home";
    if (pathname.includes("smart-assistant") || pathname.includes("VirtualAssistant") || pathname.includes("ChooseVirtualAssistant")) return "smart-assistant";
    if (pathname.includes("FullMenu") || pathname.includes("Menu")) return "full-menu";
    if (pathname.includes("history")) return "history";
    if (pathname.includes("location") || pathname.includes("SetLocation")) return "locations";
    if (pathname.includes("Restaurant") || pathname.includes("restaurant")) return "set-restaurant";
    if (pathname.includes("rewards")) return "rewards";
    if (pathname.includes("admin")) return "admin";
    if (pathname.includes("help")) return "help";
    if (pathname.includes("OrderStatus") || pathname.includes("orderStatus")) return "order-status";
    if (pathname.includes("cart")) return "cart";
    return "home";
  }, [pathname]);

  // ── Fetch user info ──
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const meta = session.user.user_metadata as any;
        const uname =
          meta?.full_name ||
          meta?.username ||
          meta?.name ||
          session.user.email?.split("@")[0] ||
          "User";
        setUsername(uname);
        setAvatarUrl(meta?.avatar_url || null);
        setInitials(getInitials(uname));
        setGradient(pickGradient(uname));
      }
    };
    fetchUser();
  }, []);

  // ── Navigation helper ──
  const navigateTo = (route: string) => {
    onClose?.();
    router.push(route as any);
  };

  // ── Logout ──
  const handleLogoutClick = () => setLogoutModalVisible(true);
  const cancelLogout = () => setLogoutModalVisible(false);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setLogoutModalVisible(false);
      setIsLoggingOut(false);
      onClose?.();
      router.replace("/(auth)/SignIn");
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
      setLogoutModalVisible(false);
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  // ── Menu definitions ──
  const menuItems: MenuItem[] = [
    {
      id: "home",
      icon: HomeOutlineIcon,
      label: "Home",
      route: "/(protected)/Homepage",
    },
    {
      id: "smart-assistant",
      icon: SparklesOutlineIcon,
      label: "Smart Assistant",
      route: "/(protected)/(virtual_assistant)/ChooseVirtualAssistant",
    },
    {
      id: "full-menu",
      icon: BookIcon,
      label: "Full Menu",
      route: "/(protected)/Restaurants",
    },
    {
      id: "history",
      icon: ({ size, color }) => (
        <View>
          <BookIcon size={size} color={color} />
        </View>
      ),
      label: "Order History",
      route: "/(protected)/OrderHistory",
    },
    {
      id: "locations",
      icon: LocationOutlineIcon,
      label: "Locations",
      route: "/(protected)/SetLocation",
    },
    {
      id: "set-restaurant",
      icon: RestaurantOutlineIcon,
      label: "Set Restaurant",
      route: "/(protected)/Restaurants",
    },
    {
      id: "cart",
      icon: CartOutlineIcon,
      label: "My Cart",
      route: "/(protected)/MyCart",
    },
    {
      id: "order-status",
      icon: BagOutlineIcon,
      label: "Order Status",
      route: "/(protected)/OrderStatus",
    },
  ];

  const generalItems: MenuItem[] = [
    {
      id: "rewards",
      icon: MedalIcon,
      label: "My Rewards",
      route: "/(protected)/Rewards",
    },
    {
      id: "help",
      icon: HelpIcon,
      label: "Help",
    },
  ];

  return (
    <LinearGradient
      colors={["#32324D", "#32324D", "#2C2C45", "#32324D"]}
      locations={[0, 0.1, 0.52, 0.9]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        {/* ── Logo ── */}
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

        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Profile section ── */}
          <View style={styles.profileContainer}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                contentFit="cover"
              />
            ) : (
              <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarGradient}
              >
                <Text style={styles.initialsText}>{initials}</Text>
              </LinearGradient>
            )}
            <View className="flex-1 gap-1.5">
              <Text
                className="font-mulish-semibold text-base text-white"
                numberOfLines={1}
              >
                {username}
              </Text>
              <Pressable onPress={() => navigateTo("/(protected)/Homepage")}>
                <Text className="font-mulish-medium text-sm text-white underline">
                  View Profile
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ── MENU section ── */}
          <View className="mt-10 pt-[18px]">
            <Text className="font-mulish-semibold text-[13px] text-neutral-150">
              MENU
            </Text>
            <View className="gap-4 mt-4">
              {menuItems.map((item) => (
                <MenuButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.id}
                  onPress={() => {
                    if (item.route) navigateTo(item.route);
                    else item.onPress?.();
                  }}
                />
              ))}
            </View>
          </View>

          {/* ── Divider ── */}
          <View className="h-px bg-white/20 my-6" />

          {/* ── GENERAL section ── */}
          <View>
            <Text className="font-mulish-semibold text-[13px] text-neutral-150">
              GENERAL
            </Text>
            <View className="gap-4 mt-4">
              {generalItems.map((item) => (
                <MenuButton
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  isActive={activeItem === item.id}
                  onPress={() => {
                    if (item.route) navigateTo(item.route);
                    else item.onPress?.();
                  }}
                />
              ))}

              {/* ── Theme toggle ── */}
              <Pressable
                onPress={toggleTheme}
                className="py-[6px] flex-row gap-[10px] items-center"
              >
                <View className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[rgba(255,255,255,0.15)]">
                  {theme === "dark" ? (
                    <SunIcon size={24} color="white" />
                  ) : (
                    <MoonIcon size={24} color="white" />
                  )}
                </View>
                <Text className="font-mulish-medium text-base text-white">
                  {theme === "dark" ? "Dark" : "Light"}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ── Logout ── */}
          <View className="mt-10">
            <MenuButton
              icon={LogOutIcon}
              label="Logout"
              isActive={false}
              onPress={handleLogoutClick}
            />
          </View>
        </ScrollView>

        {/* ── Logout modal ── */}
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

// ── Styles ───────────────────────────────────────────────────────────────────

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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 20,
    paddingBottom: 40,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 22,
  },
  avatarImage: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
  },
  avatarGradient: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  initialsText: {
    color: "white",
    fontWeight: "700",
    fontSize: 20,
    letterSpacing: 1,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#FF7B2C",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "white",
    fontSize: 9,
    fontWeight: "700",
  },
});
