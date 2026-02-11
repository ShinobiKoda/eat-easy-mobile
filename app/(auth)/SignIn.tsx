import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/Supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
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

const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const SignIn = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const result = signInSchema.safeParse({ email, password });

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

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      router.replace("/(protected)/Welcome");
    } catch (error) {
      console.error("Sign in error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const inputClassName =
    "border border-neutral-150 font-mulish-semibold text-neutral-500 text-sm rounded-2xl bg-white px-4 py-4 w-full dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200";

  const handleGoogleSignIn = async () => {
    try {
      const redirectUrl = Linking.createURL("/auth/callback");

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No authentication URL returned");

      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
      );

      if (result.type === "success" && result.url) {
        const extract = (url: string, key: string) => {
          const regex = new RegExp(`${key}=([^&]*)`);
          const match = url.match(regex);
          return match ? match[1] : null;
        };

        const access_token = extract(result.url, "access_token");
        const refresh_token = extract(result.url, "refresh_token");

        if (access_token && refresh_token) {
          const { error: sessionError } = await supabase.auth.setSession({
            access_token,
            refresh_token,
          });

          if (sessionError) {
            Alert.alert("Session Error", sessionError.message);
            return;
          }

          router.replace("/(protected)/Welcome");
          return;
        }

        Alert.alert("Login Error", "Tokens missing from URL.");
      }
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  const isFormFilled = email && password;

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
              Hello Again! 👋
            </Text>
            <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150 text-center">
              Welcome back you&apos;ve been missed!
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
            <FadeInView delay={300} className="w-full">
              <View className="relative">
                <TextInput
                  className={inputClassName}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  placeholderTextColor={isDark ? "#e5e5e5" : "#9CA3AF"}
                />
                <TouchableOpacity
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color={isDark ? "#e5e5e5" : "#6b7280"}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.password}
                </Text>
              )}

              <TouchableOpacity
                className="self-end mt-2"
                onPress={() => router.push("/ForgotPassword")}
              >
                <Text className="font-mulish-medium text-xs text-yellow-1">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </FadeInView>
          </View>

          <FadeInView delay={400} className="w-full px-6 mt-[40px]">
            <TouchableOpacity
              className={`w-full py-4 rounded-2xl flex-row items-center justify-center ${
                isLoading || !isFormFilled ? "bg-neutral-400" : "bg-primary-btn"
              }`}
              onPress={handleSignIn}
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
                    Signing in...
                  </Text>
                </>
              ) : (
                <Text className="text-white font-mulish-semibold text-base">
                  Sign In
                </Text>
              )}
            </TouchableOpacity>
          </FadeInView>

          <FadeInView delay={450} className="w-full px-6 mt-6">
            <View className="w-full flex flex-row items-center justify-between mb-4">
              <View className="h-px bg-neutral-200 dark:bg-neutral-600 w-[30%]" />
              <Text className="font-mulish-regular text-sm text-neutral-500 dark:text-neutral-300">
                Or sign in with
              </Text>
              <View className="h-px bg-neutral-200 dark:bg-neutral-600 w-[30%]" />
            </View>
            <PrimaryButton
              text="Continue with Google"
              textClass="text-purple-2 dark:text-purple-5"
              bgClass="bg-white dark:bg-neutral-800 dark:border dark:border-purple-3"
              imageSource={require("@/assets/images/gmail-icon.png")}
              onPress={handleGoogleSignIn}
            />
          </FadeInView>
          <FadeInView
            delay={500}
            className="w-full px-6 flex-row justify-center items-center mt-4 gap-1"
          >
            <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
              Don&apos;t have an account?
            </Text>
            <TouchableOpacity onPress={() => router.push("/CreateAccount")}>
              <Text className="font-mulish-bold text-base text-yellow-1">
                Sign up
              </Text>
            </TouchableOpacity>
          </FadeInView>
        </ScrollView>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaViewWrapper>
  );
};

export default SignIn;
