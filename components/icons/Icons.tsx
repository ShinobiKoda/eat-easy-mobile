import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";

type IconProps = {
  size?: number;
  color?: string;
  onPress?: () => void;
};

export const ArrowBackIcon = ({
  size = 24,
  color = "black",
  onPress,
}: IconProps) => (
  <Ionicons name="arrow-back" size={size} color={color} onPress={onPress} />
);

export const ArrowForwardIcon = ({
  size = 24,
  color = "black",
  onPress,
}: IconProps) => (
  <Ionicons name="arrow-forward" size={size} color={color} onPress={onPress} />
);

export const ArrowBackOutlineIcon = ({
  size = 24,
  color = "black",
  onPress,
}: IconProps) => (
  <Ionicons
    name="arrow-back-outline"
    size={size}
    color={color}
    onPress={onPress}
  />
);

export const MenuIcon = ({ size = 24, color = "black" }: IconProps) => (
  <Ionicons name="menu" size={size} color={color} />
);

export const LocationIcon = ({ size = 24, color = "black" }: IconProps) => (
  <Ionicons name="location" size={size} color={color} />
);

export const CheckmarkCircleIcon = ({
  size = 24,
  color = "#10B981",
}: IconProps) => <Ionicons name="checkmark-circle" size={size} color={color} />;

export const EllipseOutlineIcon = ({
  size = 24,
  color = "#9CA3AF",
}: IconProps) => <Ionicons name="ellipse-outline" size={size} color={color} />;

export const EyeIcon = ({ size = 24, color = "#6b7280" }: IconProps) => (
  <Ionicons name="eye" size={size} color={color} />
);

export const EyeOffIcon = ({ size = 24, color = "#6b7280" }: IconProps) => (
  <Ionicons name="eye-off" size={size} color={color} />
);

export const SunIcon = ({ size = 24, color = "#FFD700" }: IconProps) => (
  <Ionicons name="sunny-outline" size={size} color={color} />
);

export const ReceiptIcon = ({ size = 24, color = "black" }: IconProps) => (
  <Ionicons name="receipt-outline" size={size} color={color} />
);

export const LocationOutlineIcon = ({
  size = 24,
  color = "black",
}: IconProps) => <Ionicons name="location-outline" size={size} color={color} />;

export const MoonIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="moon-outline" size={size} color={color} />
);

export const BookIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="book-outline" size={size} color={color} />
);

export const MedalIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="medal-outline" size={size} color={color} />
);

export const HelpIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="information-circle-outline" size={size} color={color} />
);

export const LogOutIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="log-out-outline" size={size} color={color} />
);

export const CalenderIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="calendar-outline" size={size} color={color} />
);

export const HomeOutlineIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="home-outline" size={size} color={color} />
);

export const SparklesOutlineIcon = ({
  size = 24,
  color = "#222",
}: IconProps) => <Ionicons name="sparkles-outline" size={size} color={color} />;

export const RestaurantOutlineIcon = ({
  size = 24,
  color = "#222",
}: IconProps) => (
  <Ionicons name="restaurant-outline" size={size} color={color} />
);

export const CartOutlineIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="cart-outline" size={size} color={color} />
);

export const BagOutlineIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="bag-outline" size={size} color={color} />
);

export const ShieldCheckIcon = ({ size = 24, color = "#222" }: IconProps) => (
  <Ionicons name="shield-checkmark-outline" size={size} color={color} />
);

export const ChevronForwardIcon = ({
  size = 24,
  color = "#222",
}: IconProps) => (
  <Ionicons name="chevron-forward" size={size} color={color} />
);
