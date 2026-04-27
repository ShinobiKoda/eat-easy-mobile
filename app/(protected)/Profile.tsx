import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import * as Linking from "expo-linking";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/Supabase";
import AppLayout from "../../components/layout/AppLayout";
import { FadeInView, PopInView, SlideInUpView, ScaleOnPressView } from "../../components/animations/reanimated";
import Animated, { SlideInUp, SlideOutUp, BounceInDown } from "react-native-reanimated";
import { orderService } from "../../services/orderService";
import { couponService } from "../../services/couponService";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileField {
  label: string;
  key: string;
  value: string;
  icon: React.ReactNode;
  editable: boolean;
  placeholder: string;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent: "yellow" | "purple" | "orange";
}) => {
  const bg =
    accent === "yellow"
      ? "bg-yellow-100 dark:bg-yellow-900/30"
      : accent === "purple"
        ? "bg-purple-100 dark:bg-purple-900/30"
        : "bg-orange-100 dark:bg-orange-900/30";

  return (
    <View className="w-[130px] bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm flex flex-col gap-3 mr-3">
      <View className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
        {icon}
      </View>
      <View>
        <Text className="text-xl font-bold text-neutral-800 dark:text-white font-mullish">
          {value}
        </Text>
        <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1">
          {label}
        </Text>
      </View>
    </View>
  );
};

// ─── Editable Field ───────────────────────────────────────────────────────────

const EditableField = ({
  field,
  onSave,
  saving,
}: {
  field: ProfileField;
  onSave: (key: string, value: string) => Promise<void>;
  saving: string | null;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(field.value);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    setDraft(field.value);
  }, [field.value]);

  useEffect(() => {
    if (editing) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [editing]);

  const handleSave = async () => {
    if (draft.trim() === field.value) {
      setEditing(false);
      return;
    }
    await onSave(field.key, draft.trim());
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(field.value);
    setEditing(false);
  };

  return (
    <View className="flex-row items-center gap-4 bg-white dark:bg-neutral-700 rounded-2xl px-5 py-4 shadow-sm">
      {/* Icon */}
      <View className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-600 flex items-center justify-center shrink-0">
        {field.icon}
      </View>

      {/* Content */}
      <View className="flex-1 min-w-0 justify-center">
        <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-1">
          {field.label}
        </Text>
        {editing ? (
          <TextInput
            ref={inputRef}
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleSave}
            returnKeyType="done"
            placeholder={field.placeholder}
            placeholderTextColor="#9ca3af"
            className="w-full text-sm font-semibold text-neutral-800 dark:text-white border-b border-purple-500 pb-1 p-0 m-0"
          />
        ) : (
          <Text className={`font-semibold text-sm ${field.value ? "text-neutral-800 dark:text-white" : "text-neutral-400 italic"}`} numberOfLines={1}>
            {field.value || field.placeholder}
          </Text>
        )}
      </View>

      {/* Actions */}
      {field.editable && (
        <View className="flex-row items-center gap-2 shrink-0">
          {editing ? (
            <View className="flex-row gap-2">
              <TouchableOpacity
                onPress={handleSave}
                disabled={saving === field.key}
                className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center disabled:opacity-60"
              >
                {saving === field.key ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons name="checkmark" size={18} color="white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCancel}
                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-600 flex items-center justify-center"
              >
                <Ionicons name="close" size={18} color="#6b7280" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-600 flex items-center justify-center"
            >
              <Feather name="edit-2" size={16} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Avatar: gradient colours cycling through app palette
const avatarGradients = [
  ["#615793", "#ff7b2c"],
  ["#32324d", "#615793"],
  ["#ffb01d", "#ff7b2c"],
  ["#615793", "#ffb01d"],
];

function pickGradient(name: string) {
  let code = 0;
  for (let i = 0; i < name.length; i++) code += name.charCodeAt(i);
  return avatarGradients[code % avatarGradients.length];
}

// ─── Main Profile Component ───────────────────────────────────────────────────

const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [saving, setSaving] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [passwordResetStatus, setPasswordResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [passwordResetMessage, setPasswordResetMessage] = useState<string | null>(null);

  // ─── Live stats ─────────────────────────────────────────────────────────
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalCoupons, setTotalCoupons] = useState<number | null>(null);
  const [aiAssists, setAiAssists] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [orders, coupons] = await Promise.all([
          orderService.getUserOrders(),
          couponService.getUserCoupons(),
        ]);
        setTotalOrders(orders.length);
        setTotalCoupons(coupons.length);

        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const { count } = await supabase
            .from("recommendations")
            .select("id", { count: "exact", head: true })
            .eq("user_id", authUser.id);
          setAiAssists(count ?? 0);
        }
      } catch (err) {
        console.error("Failed to fetch profile stats:", err);
      }
    }
    fetchStats();
  }, []);

  const meta = (user?.user_metadata as any) || {};
  const provider = user?.app_metadata?.provider || "email";

  const displayName = meta?.full_name || meta?.username || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const phone = meta?.phone || "";
  const username = meta?.username || user?.email?.split("@")[0] || "";
  const avatarUrl = meta?.avatar_url || null;
  const initials = getInitials(displayName);
  const avatarGradient = pickGradient(displayName);
  const joinedDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "—";

  const fields: ProfileField[] = [
    {
      label: "Username",
      key: "username",
      value: username,
      icon: <Feather name="user" size={18} color="#6b7280" />,
      editable: true,
      placeholder: "Enter username",
    },
    {
      label: "Email Address",
      key: "email",
      value: email,
      icon: <Feather name="mail" size={18} color="#6b7280" />,
      editable: false,
      placeholder: "—",
    },
    {
      label: "Phone Number",
      key: "phone",
      value: phone,
      icon: <Feather name="phone" size={18} color="#6b7280" />,
      editable: true,
      placeholder: "Add phone number",
    },
    {
      label: "Full Name",
      key: "full_name",
      value: meta?.full_name || "",
      icon: <Ionicons name="shield-checkmark-outline" size={18} color="#6b7280" />,
      editable: provider === "email",
      placeholder: "Enter full name",
    },
    {
      label: "Member Since",
      key: "joined",
      value: joinedDate,
      icon: <Feather name="calendar" size={18} color="#6b7280" />,
      editable: false,
      placeholder: "—",
    },
  ];

  const handleSaveField = async (key: string, value: string) => {
    setSaving(key);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { [key]: value },
      });
      if (error) throw error;
      await refreshUser();
      setSaveSuccess(key);
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(null);
    }
  };

  const handleAvatarPress = async () => {
    if (provider !== "email") return;

    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert("Permission Denied", "We need access to your photos to update your avatar.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets[0] && user) {
        setAvatarLoading(true);
        const asset = result.assets[0];
        
        // Convert URI to blob
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        
        const ext = asset.uri.split(".").pop() || "jpg";
        const path = `avatars/${user.id}.${ext}`;
        
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(path, blob, { upsert: true });
          
        if (uploadError) throw uploadError;
        
        const { data } = supabase.storage.from("avatars").getPublicUrl(path);
        await supabase.auth.updateUser({
          data: { avatar_url: data.publicUrl },
        });
        await refreshUser();
      }
    } catch (err) {
      console.error("Avatar upload failed:", err);
      Alert.alert("Error", "Failed to upload avatar.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!email) return;
    setPasswordResetStatus("loading");
    try {
      // Create a deep link to return to the app's reset password screen
      const redirectUrl = Linking.createURL("/reset-password");
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      
      if (error) throw error;
      setPasswordResetStatus("success");
      setTimeout(() => setPasswordResetStatus("idle"), 5000);
    } catch (err: any) {
      console.error("Password reset error:", err);
      setPasswordResetStatus("error");
      setPasswordResetMessage(err?.message || "Failed to send reset email.");
      setTimeout(() => setPasswordResetStatus("idle"), 5000);
    }
  };

  return (
    <View className="flex-1">
      <AppLayout title="Account" showMenuButton={true} locationIcon={false} backButton={false}>
        <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          
          {/* ── Hero banner + avatar ───────────────────────────────── */}
          <SlideInUpView className="mb-8">
            <View className="rounded-3xl overflow-hidden shadow-sm">
              {/* Banner gradient */}
              <LinearGradient
                colors={["#615793", "#32324d", "#ff7b2c"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-full h-[120px]"
              />
              
              {/* Avatar + name row */}
              <View className="bg-white dark:bg-neutral-700 px-5 pb-5">
                <View className="flex-row items-end gap-4">
                  {/* Avatar */}
                  <TouchableOpacity
                    activeOpacity={provider === "email" ? 0.8 : 1}
                    onPress={handleAvatarPress}
                    className="relative -mt-10"
                  >
                    {avatarUrl ? (
                      <Animated.Image
                        source={{ uri: avatarUrl }}
                        className="w-[88px] h-[88px] rounded-full border-4 border-white dark:border-neutral-700"
                      />
                    ) : (
                      <LinearGradient
                        colors={avatarGradient as [string, string]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        className="w-[88px] h-[88px] rounded-full border-4 border-white dark:border-neutral-700 flex items-center justify-center"
                      >
                        <Text className="text-white font-bold text-3xl font-mullish">
                          {initials}
                        </Text>
                      </LinearGradient>
                    )}

                    {/* Camera overlay */}
                    {provider === "email" && (
                      <View className="absolute bottom-0 right-0 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-700">
                        {avatarLoading ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <Ionicons name="camera" size={14} color="white" />
                        )}
                      </View>
                    )}
                  </TouchableOpacity>

                  {/* Name & badge */}
                  <View className="flex-1 pb-1">
                    <Text className="font-bold text-xl text-neutral-800 dark:text-white font-mullish mb-1">
                      {displayName}
                    </Text>
                    <View className="flex-row items-center gap-2 flex-wrap">
                      <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        {email}
                      </Text>
                      <View className={`px-2 py-0.5 rounded-full ${
                        provider === "google"
                          ? "bg-blue-50 dark:bg-blue-900/30"
                          : "bg-purple-100 dark:bg-purple-900/30"
                      }`}>
                        <Text className={`text-[10px] font-semibold ${
                          provider === "google" ? "text-blue-600 dark:text-blue-400" : "text-purple-600 dark:text-purple-400"
                        }`}>
                          {provider === "google" ? "Google" : "Email"}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </SlideInUpView>

          {/* Stats row */}
          <PopInView delay={100} className="mb-8">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
              <StatCard
                icon={<MaterialIcons name="history" size={22} color="#9333ea" />}
                label="Total Orders"
                value={totalOrders ?? "—"}
                accent="purple"
              />
              <StatCard
                icon={<Feather name="gift" size={20} color="#eab308" />}
                label="Coupons"
                value={totalCoupons ?? "—"}
                accent="yellow"
              />
              <StatCard
                icon={<Ionicons name="sparkles" size={20} color="#f97316" />}
                label="AI Assists"
                value={aiAssists ?? "—"}
                accent="orange"
              />
            </ScrollView>
          </PopInView>

          {/* Account info */}
          <FadeInView delay={200} className="mb-8">
            <Text className="font-bold text-base text-neutral-800 dark:text-white font-mullish mb-4 px-1">
              Account Information
            </Text>
            <View className="flex flex-col gap-3">
              {fields.map((field) => (
                <EditableField
                  key={field.key}
                  field={field}
                  onSave={handleSaveField}
                  saving={saving}
                />
              ))}
            </View>
          </FadeInView>

          {/* Account security */}
          <FadeInView delay={300} className="mb-8">
            <Text className="font-bold text-base text-neutral-800 dark:text-white font-mullish mb-4 px-1">
              Security
            </Text>
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm space-y-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <Ionicons name="shield-checkmark" size={20} color="#9333ea" />
                </View>
                <View>
                  <Text className="font-semibold text-sm text-neutral-800 dark:text-white mb-0.5">
                    Account Security
                  </Text>
                  <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    {provider === "google"
                      ? "Secured by Google OAuth"
                      : "Password authentication"}
                  </Text>
                </View>
              </View>

              {provider === "email" && (
                <ScaleOnPressView
                  onPress={handleChangePassword}
                  disabled={passwordResetStatus === "loading"}
                  className="w-full py-3 rounded-xl border border-neutral-200 dark:border-neutral-600 flex-row items-center justify-center gap-2 disabled:opacity-60"
                >
                  {passwordResetStatus === "loading" ? (
                    <>
                      <ActivityIndicator color="#6b7280" size="small" />
                      <Text className="text-sm font-semibold text-neutral-700 dark:text-white">Sending...</Text>
                    </>
                  ) : (
                    <Text className="text-sm font-semibold text-neutral-700 dark:text-white">Change Password</Text>
                  )}
                </ScaleOnPressView>
              )}

              <View className="flex-row items-center gap-3 p-3 rounded-xl bg-yellow-50 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900/30">
                <Text className="text-lg">🔒</Text>
                <Text className="text-xs font-medium text-neutral-600 dark:text-neutral-300 flex-1">
                  Your data is encrypted and never shared with third parties.
                </Text>
              </View>
            </View>
          </FadeInView>
        </ScrollView>
      </AppLayout>

      {/* ── Toasts ──────── */}
      {saveSuccess && (
        <Animated.View 
          entering={BounceInDown.springify()} 
          exiting={SlideOutUp.springify()}
          className="absolute top-16 left-5 right-5 z-50 flex-row items-center gap-4 px-5 py-4 rounded-2xl bg-white shadow-xl shadow-emerald-500/20 border border-emerald-100"
        >
          <View className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Ionicons name="checkmark" size={20} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-sm text-emerald-600">Profile Updated</Text>
            <Text className="text-xs text-neutral-500 mt-0.5">Your changes have been saved successfully.</Text>
          </View>
        </Animated.View>
      )}

      {passwordResetStatus === "success" && (
        <Animated.View 
          entering={BounceInDown.springify()} 
          exiting={SlideOutUp.springify()}
          className="absolute top-16 left-5 right-5 z-50 flex-row items-center gap-4 px-5 py-4 rounded-2xl bg-white shadow-xl shadow-emerald-500/20 border border-emerald-100"
        >
          <View className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <Ionicons name="mail" size={20} color="#10b981" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-sm text-emerald-600">Reset Email Sent! ✉️</Text>
            <Text className="text-xs text-neutral-500 mt-0.5">Check your inbox for the password reset link.</Text>
          </View>
        </Animated.View>
      )}

      {passwordResetStatus === "error" && (
        <Animated.View 
          entering={BounceInDown.springify()} 
          exiting={SlideOutUp.springify()}
          className="absolute top-16 left-5 right-5 z-50 flex-row items-center gap-4 px-5 py-4 rounded-2xl bg-white shadow-xl shadow-red-500/20 border border-red-100"
        >
          <View className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Ionicons name="close" size={20} color="#ef4444" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-sm text-red-600">Reset Failed</Text>
            <Text className="text-xs text-neutral-500 mt-0.5">{passwordResetMessage || "Failed to send reset email."}</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

export default Profile;
