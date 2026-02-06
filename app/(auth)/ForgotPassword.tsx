import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/Supabase";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const result = forgotPasswordSchema.safeParse({ email });

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0];
        if (path) {
          newErrors[path.toString()] = issue.message;
        }
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "exposupabase://auth/callback", 
      });

      if (error) {
        Alert.alert("Error", error.message);
        setIsLoading(false);
        return;
      }

      Alert.alert(
        "Check your email",
        "We have sent you a password reset link.",
        [{ text: "OK", onPress: () => router.push("/SignIn") }],
      );
      setIsLoading(false);
    } catch (error) {
      console.error("Reset password error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const inputClassName =
    "border border-neutral-150 font-mulish-semibold text-neutral-500 text-sm rounded-2xl bg-white px-4 py-4 w-full dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200";

  const isFormFilled = !!email;

  return (
    <SafeAreaViewWrapper>
      <KeyboardAvoidingViewWrapper>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingBottom: 20,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SlideInUpView
            delay={100}
            className="flex flex-col items-center justify-center px-6 mb-[40px] gap-[14px]"
          >
            <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white">
              Forgot Password? 🔒
            </Text>
            <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150 text-center">
              Please enter your email address to recover your password.
            </Text>
          </SlideInUpView>

          <View className="px-6 w-full gap-[20px]">
            <FadeInView delay={200} className="w-full">
              <TextInput
                className={inputClassName}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={isDark ? "#e5e5e5" : "#9CA3AF"}
              />
              {errors.email && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.email}
                </Text>
              )}
            </FadeInView>
          </View>

          <FadeInView delay={300} className="w-full px-6 mt-[40px]">
            <TouchableOpacity
              className={`w-full py-4 rounded-2xl flex-row items-center justify-center ${
                isLoading || !isFormFilled ? "bg-neutral-400" : "bg-primary-btn"
              }`}
              onPress={handleResetPassword}
              disabled={isLoading || !isFormFilled}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator
                    size="small"
                    color="white"
                    className="mr-2"
                  />
                  <Text className="text-white font-mulish-semibold text-base ml-2">
                    Sending Link...
                  </Text>
                </>
              ) : (
                <Text className="text-white font-mulish-semibold text-base">
                  Send Reset Link
                </Text>
              )}
            </TouchableOpacity>
          </FadeInView>

          <FadeInView
            delay={400}
            className="w-full px-6 flex-row justify-center items-center mt-4 gap-1"
          >
            <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
              Remember your password?
            </Text>
            <TouchableOpacity onPress={() => router.push("/SignIn")}>
              <Text className="font-mulish-bold text-base text-yellow-1">
                Sign in
              </Text>
            </TouchableOpacity>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaViewWrapper>
  );
};

export default ForgotPassword;
