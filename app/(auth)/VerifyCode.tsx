import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/Supabase";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const Cursor = () => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 500 }),
        withTiming(0, { duration: 500 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="absolute bottom-3 w-[2px] h-6 bg-purple-2 dark:bg-neutral-200"
    />
  );
};

const VerifyCode = () => {
  const { theme } = useTheme();
  const { email } = useLocalSearchParams<{ email: string }>();
  const router = useRouter();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const maxLength = 4;

  // Auto-focus the keyboard on mount
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 500);
  }, []);

  // Update logic to trigger verify automatically
  useEffect(() => {
    if (code.length === maxLength) {
      handleVerifyOTP();
    }
  }, [code]);

  const handlePress = () => {
    inputRef.current?.focus();
  };

  const handleVerifyOTP = async () => {
    // Prevent double submission if already loading
    if (isLoading) return;

    if (code.length < 4) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("otp_verifications")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .gt("expires_at", new Date().toISOString())
        .single();

      if (error || !data) {
        Alert.alert("Error", "Invalid or expired code. Please try again.", [
          {
            text: "OK",
            onPress: () => {
              setCode("");
              setIsLoading(false);
            },
          },
        ]);
        return;
      }

      // SUCCESS! Code verified - Delete the used OTP
      await supabase
        .from("otp_verifications")
        .delete()
        .eq("email", email)
        .eq("code", code);

      // Update user metadata to mark as verified (optional)
      await supabase.auth.updateUser({
        data: { email_verified: true },
      });

      // Navigate to Welcome screen
      Alert.alert("Success", "Your account has been verified!", [
        {
          text: "Continue",
          onPress: () => router.replace("/Welcome"),
        },
      ]);
    } catch (err) {
      console.error("Verification error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) return;

    setIsLoading(true);
    try {
      // Generate new OTP
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      // Delete old OTPs for this email
      await supabase.from("otp_verifications").delete().eq("email", email);

      // Store new OTP with expiration (10 minutes)
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10);

      const { error: otpError } = await supabase
        .from("otp_verifications")
        .insert([
          {
            email,
            code: otpCode,
            expires_at: expiresAt.toISOString(),
          },
        ]);

      if (otpError) {
        Alert.alert("Error", "Failed to generate new code. Please try again.");
        setIsLoading(false);
        return;
      }

      // Send OTP via API
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

      try {
        const response = await fetch(`${apiUrl}/api/send-otp`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, code: otpCode }),
        });

        if (!response.ok) {
          console.log("⚠️ API call failed. New OTP code for testing:", otpCode);
          Alert.alert(
            "Note",
            `Email service unavailable. For testing, your code is: ${otpCode}`,
          );
        } else {
          Alert.alert("Success", "A new code has been sent to your email.");
        }
      } catch {
        console.log("⚠️ Email send failed. New OTP code for testing:", otpCode);
        Alert.alert(
          "Note",
          `Email service unavailable. For testing, your code is: ${otpCode}`,
        );
      }

      setCode("");
    } catch (err) {
      console.error("Resend error:", err);
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderInputs = () => {
    const codeDigits = code.split("");
    return Array(maxLength)
      .fill(0)
      .map((_, i) => {
        const digit = codeDigits[i] || "";
        const isFocused = i === code.length;

        return (
          <View
            key={i}
            className={`w-[54px] h-[54px] border rounded-2xl items-center justify-center bg-white dark:bg-neutral-600 ${
              isFocused
                ? "border-purple-2 dark:border-purple-5"
                : "border-neutral-150 dark:border-neutral-600"
            }`}
          >
            <Text className="text-2xl font-mulish-regular text-neutral-800 dark:text-white">
              {digit}
            </Text>
            {isFocused && <Cursor />}
          </View>
        );
      });
  };

  return (
    <SafeAreaViewWrapper className="flex-1 px-6">
      <SlideInUpView delay={100}>
        <View className="mt-[15px] w-[44px] h-[46px] bg-white dark:bg-neutral-700 shadow-md rounded-2xl flex items-center justify-center">
          <Ionicons
            name="arrow-back-outline"
            size={20}
            color={theme === "dark" ? "#FFFFFF" : "#666687"}
            onPress={() => router.back()}
          />
        </View>
      </SlideInUpView>

      <SlideInUpView delay={200} className="items-center mt-3">
        <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white mb-[14px]">
          Verify Code ⚡️
        </Text>
        <Text className="font-mulish-medium text-neutral-600 text-base text-center dark:text-neutral-150">
          We just sent a 4-digit verification code to{" "}
          <Text className="text-neutral-700 font-mulish-bold text-base dark:text-neutral-150">
            {email || "your email"}
          </Text>
          . Enter the code in the box below to continue.{"\n"}
        </Text>
      </SlideInUpView>

      <SlideInUpView delay={300}>
        <Pressable
          onPress={handlePress}
          className="relative flex-row justify-between w-full mb-3"
        >
          {renderInputs()}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(text) => text.length <= maxLength && setCode(text)}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoFocus={true}
            className="absolute inset-0 w-full h-full opacity-0"
          />
        </Pressable>
      </SlideInUpView>

      <FadeInView delay={600}>
        <Pressable
          className="p-[10px]"
          onPress={handleResendCode}
          disabled={isLoading}
        >
          <Text className="text-center text-base font-mulish-semibold text-neutral-500 dark:text-white">
            Didn&apos;t receive a code?{" "}
            <Text className="text-neutral-800 font-mulish-bold text-base text-yellow-1">
              Resend Code
            </Text>
          </Text>
        </Pressable>
      </FadeInView>
    </SafeAreaViewWrapper>
  );
};

export default VerifyCode;
