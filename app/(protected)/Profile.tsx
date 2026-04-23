import React, { useState, useEffect, useRef } from "react";
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import Header from "../../components/layout/Header";
import { supabase } from "../../lib/Supabase";
import { orderService } from "../../services/orderService";
import { couponService } from "../../services/couponService";
import { FadeInView, PopInView, SlideInUpView } from "../../components/animations/reanimated";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

/* ─── Helpers ─── */
function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const gradients = ["#615793", "#ff7b2c", "#32324d", "#ffb01d"];
function pickColor(name: string) {
  let c = 0;
  for (let i = 0; i < name.length; i++) c += name.charCodeAt(i);
  return gradients[c % gradients.length];
}

/* ─── Stat Card ─── */
const StatCard = ({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) => (
  <View className="flex-1 bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm gap-3 min-w-[100px]">
    <View className="w-10 h-10 rounded-xl items-center justify-center" style={{ backgroundColor: `${color}18` }}>
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <Text className="text-xl font-bold text-neutral-800 dark:text-white">{value}</Text>
    <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{label}</Text>
  </View>
);

/* ─── Editable Field ─── */
const EditableField = ({ label, value, icon, editable, placeholder, fieldKey, onSave, saving }: {
  label: string; value: string; icon: string; editable: boolean; placeholder: string;
  fieldKey: string; onSave: (key: string, val: string) => Promise<void>; saving: string | null;
}) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const colorScheme = useColorScheme();

  useEffect(() => { setDraft(value); }, [value]);

  const handleSave = async () => {
    if (draft.trim() === value) { setEditing(false); return; }
    await onSave(fieldKey, draft.trim());
    setEditing(false);
  };

  return (
    <View className="flex-row items-center gap-4 bg-white dark:bg-neutral-700 rounded-2xl px-5 py-4 shadow-sm">
      <View className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-600 items-center justify-center">
        <Feather name={icon as any} size={18} color={colorScheme === "dark" ? "#a3a3a3" : "#737373"} />
      </View>
      <View className="flex-1">
        <Text className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-0.5">{label}</Text>
        {editing ? (
          <TextInput
            autoFocus
            value={draft}
            onChangeText={setDraft}
            onSubmitEditing={handleSave}
            placeholder={placeholder}
            placeholderTextColor="#a3a3a3"
            className="font-semibold text-sm text-neutral-800 dark:text-white border-b border-purple-400 pb-0.5"
          />
        ) : (
          <Text className="font-semibold text-sm text-neutral-800 dark:text-white" numberOfLines={1}>
            {value || <Text className="text-neutral-400 italic">{placeholder}</Text>}
          </Text>
        )}
      </View>
      {editable && (
        <View className="flex-row gap-1.5">
          {editing ? (
            <>
              <TouchableOpacity onPress={handleSave} disabled={saving === fieldKey}
                className="w-8 h-8 rounded-lg bg-purple-600 items-center justify-center">
                {saving === fieldKey ? <ActivityIndicator size="small" color="white" />
                  : <Ionicons name="checkmark" size={16} color="white" />}
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setDraft(value); setEditing(false); }}
                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-600 items-center justify-center">
                <Ionicons name="close" size={16} color="#737373" />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity onPress={() => setEditing(true)}
              className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-600 items-center justify-center">
              <Feather name="edit-2" size={14} color="#737373" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

/* ─── Profile Page ─── */
const Profile: React.FC = () => {
  const colorScheme = useColorScheme();
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [totalOrders, setTotalOrders] = useState<number | null>(null);
  const [totalCoupons, setTotalCoupons] = useState<number | null>(null);
  const [aiAssists, setAiAssists] = useState<number | null>(null);
  const [pwStatus, setPwStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [orders, coupons] = await Promise.all([
          orderService.getUserOrders(), couponService.getUserCoupons(),
        ]);
        setTotalOrders(orders.length);
        setTotalCoupons(coupons.length);

        const { data: { user: u } } = await supabase.auth.getUser();
        if (u) {
          const { count } = await supabase.from("recommendations")
            .select("id", { count: "exact", head: true }).eq("user_id", u.id);
          setAiAssists(count ?? 0);
        }
      } catch (e) { console.error("Stats fetch error:", e); }
    })();
  }, []);

  const refreshUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  };

  if (!user) return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900 items-center justify-center">
      <ActivityIndicator size="large" color="#615793" />
    </View>
  );

  const meta = (user.user_metadata as any) || {};
  const provider = user.app_metadata?.provider || "email";
  const displayName = meta.full_name || meta.username || user.email?.split("@")[0] || "User";
  const email = user.email || "";
  const username = meta.username || user.email?.split("@")[0] || "";
  const phone = meta.phone || "";
  const initials = getInitials(displayName);
  const avatarColor = pickColor(displayName);
  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  const handleSaveField = async (key: string, value: string) => {
    setSaving(key);
    try {
      const { error } = await supabase.auth.updateUser({ data: { [key]: value } });
      if (error) throw error;
      await refreshUser();
    } catch (e) { console.error("Update error:", e); }
    finally { setSaving(null); }
  };

  const handleChangePassword = async () => {
    if (!email) return;
    setPwStatus("loading");
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setPwStatus("success");
      Alert.alert("Email Sent", "Check your inbox for the password reset link.");
      setTimeout(() => setPwStatus("idle"), 5000);
    } catch (e: any) {
      setPwStatus("error");
      Alert.alert("Error", e?.message || "Failed to send reset email.");
      setTimeout(() => setPwStatus("idle"), 5000);
    }
  };

  const fields = [
    { label: "Username", key: "username", value: username, icon: "user", editable: true, placeholder: "Enter username" },
    { label: "Email", key: "email", value: email, icon: "mail", editable: false, placeholder: "—" },
    { label: "Phone", key: "phone", value: phone, icon: "phone", editable: true, placeholder: "Add phone" },
    { label: "Full Name", key: "full_name", value: meta.full_name || "", icon: "shield", editable: provider === "email", placeholder: "Enter name" },
    { label: "Member Since", key: "joined", value: joinedDate, icon: "calendar", editable: false, placeholder: "—" },
  ];

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header title="Profile" backButton showSideBar={false} />
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Banner + Avatar */}
        <SlideInUpView>
          <View className="rounded-3xl overflow-hidden mx-5 mt-3 mb-6 shadow-sm">
            <View className="h-28" style={{ backgroundColor: "#615793" }}>
              <View className="absolute inset-0 opacity-20" />
            </View>
            <View className="bg-white dark:bg-neutral-700 px-5 pb-5">
              <View className="flex-row items-end gap-4">
                <View className="w-20 h-20 rounded-full -mt-10 border-4 border-white dark:border-neutral-700 items-center justify-center" style={{ backgroundColor: avatarColor }}>
                  <Text className="text-white font-bold text-2xl">{initials}</Text>
                </View>
                <View className="flex-1 pb-1">
                  <Text className="font-bold text-lg text-neutral-800 dark:text-white" numberOfLines={1}>{displayName}</Text>
                  <View className="flex-row items-center gap-2 mt-0.5">
                    <Text className="text-sm text-neutral-500 dark:text-neutral-400" numberOfLines={1}>{email}</Text>
                    <View className="bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                      <Text className="text-[10px] font-semibold text-purple-600 dark:text-purple-400">
                        {provider === "google" ? "Google" : "Email"}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </SlideInUpView>

        <View className="px-5">
          {/* Stats */}
          <PopInView>
            <View className="flex-row gap-3 mb-6">
              <StatCard icon="time-outline" label="Orders" value={totalOrders ?? "—"} color="#615793" />
              <StatCard icon="ticket-outline" label="Coupons" value={totalCoupons ?? "—"} color="#FFB01D" />
              <StatCard icon="sparkles" label="AI Assists" value={aiAssists ?? "—"} color="#FF7B2C" />
            </View>
          </PopInView>

          {/* Fields */}
          <FadeInView>
            <Text className="font-semibold text-base text-neutral-800 dark:text-white mb-3 px-1">
              Account Information
            </Text>
            <View className="gap-2.5 mb-6">
              {fields.map((f) => (
                <EditableField key={f.key} {...f} fieldKey={f.key} onSave={handleSaveField} saving={saving} />
              ))}
            </View>
          </FadeInView>

          {/* Security */}
          <FadeInView delay={100}>
            <Text className="font-semibold text-base text-neutral-800 dark:text-white mb-3 px-1">Security</Text>
            <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm gap-4">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
                  <Ionicons name="shield-checkmark-outline" size={20} color="#615793" />
                </View>
                <View>
                  <Text className="font-semibold text-sm text-neutral-800 dark:text-white">Account Security</Text>
                  <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                    {provider === "google" ? "Secured by Google OAuth" : "Password authentication"}
                  </Text>
                </View>
              </View>

              {provider === "email" && (
                <TouchableOpacity onPress={handleChangePassword} disabled={pwStatus === "loading"}
                  className="border border-neutral-200 dark:border-neutral-600 rounded-xl py-3 items-center"
                  style={{ opacity: pwStatus === "loading" ? 0.6 : 1 }}>
                  {pwStatus === "loading" ? (
                    <ActivityIndicator size="small" color="#615793" />
                  ) : (
                    <Text className="text-sm font-semibold text-neutral-700 dark:text-white">Change Password</Text>
                  )}
                </TouchableOpacity>
              )}

              <View className="flex-row items-center gap-2 p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800/30">
                <Text className="text-base">🔒</Text>
                <Text className="text-xs text-neutral-600 dark:text-neutral-300 flex-1">
                  Your data is encrypted and never shared with third parties.
                </Text>
              </View>
            </View>
          </FadeInView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
