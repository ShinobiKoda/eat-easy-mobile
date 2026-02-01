import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { supabase } from "@/lib/Supabase";
import { accountSchema } from "@/schemas/accountSchema";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";

const CreateAccount = () => {
  const phoneInputRef = useRef(null);
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  function handleSelectedCountry(country: ICountry) {
    setSelectedCountry(country);
  }

  function handleChangePhoneText(inputText: string) {
    setPhoneNumber(inputText);
  }

  const validateForm = () => {
    const result = accountSchema.safeParse({
      username,
      email,
      password,
      phoneNumber,
    });

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

  const handleNext = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // 1. Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            phone: phoneNumber,
          },
        },
      });

      if (authError) {
        Alert.alert("Error", authError.message);
        setIsLoading(false);
        return;
      }

      // 2. Generate 4-digit OTP
      const otpCode = Math.floor(1000 + Math.random() * 9000).toString();

      // 3. Store OTP in database with expiration (10 minutes)
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
        console.error("OTP storage error:", otpError);
        Alert.alert("Error", "Failed to generate verification code.");
        setIsLoading(false);
        return;
      }

      // 4. Send OTP via Supabase Edge Function
      const { error: sendError } = await supabase.functions.invoke("send-otp", {
        body: { email },
      });

      if (sendError) {
        // Log the code for testing if edge function fails
        console.log("⚠️ Edge function failed. OTP code for testing:", otpCode);
        Alert.alert(
          "Note",
          `Email service unavailable. For testing, your code is: ${otpCode}`,
          [
            {
              text: "Continue",
              onPress: () => {
                router.push({
                  pathname: "/VerifyCode",
                  params: { email },
                });
              },
            },
          ],
        );
        setIsLoading(false);
        return;
      }

      // 5. Navigate to verification screen
      setIsLoading(false);
      router.push({
        pathname: "/VerifyCode",
        params: { email },
      });

      // Clear form
      setUsername("");
      setEmail("");
      setPassword("");
      setPhoneNumber("");
      setSelectedCountry(null);
      setIsPasswordVisible(false);
      setErrors({});
    } catch (error) {
      console.error("Account creation error:", error);
      Alert.alert("Error", "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  const inputClassName =
    "border border-neutral-150 font-mulish-semibold text-neutral-500 text-sm rounded-2xl bg-white px-4 py-4 w-full";

  const isFormFilled = username && email && password && phoneNumber;

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
          <View className="flex flex-col items-center justify-center px-6 mb-[40px] gap-[14px]">
            <Text className="font-dm-medium text-[22px] text-neutral-800">
              Getting Started! ✌️
            </Text>
            <Text className="font-mulish-medium text-base text-neutral-600 text-center">
              Looks like you&apos;re new to us! Create an account for a complete
              experience.
            </Text>
          </View>

          <View className="px-6 w-full gap-[20px]">
            <View className="w-full">
              <TextInput
                className={inputClassName}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor="#9CA3AF"
              />
              {errors.username && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.username}
                </Text>
              )}
            </View>
            {/* Email Input */}
            <View className="w-full">
              <TextInput
                className={inputClassName}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#9CA3AF"
              />
              {errors.email && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.email}
                </Text>
              )}
            </View>
            {/* Password Input */}
            <View className="w-full">
              <View className="relative">
                <TextInput
                  className={inputClassName}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? "eye-off" : "eye"}
                    size={20}
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.password}
                </Text>
              )}
            </View>
            {/* Phone Number Input */}
            <View className="w-full">
              <PhoneInput
                ref={phoneInputRef}
                value={phoneNumber}
                onChangeText={handleChangePhoneText}
                selectedCountry={selectedCountry}
                onChangeSelectedCountry={handleSelectedCountry}
                placeholder="Enter phone number"
                phoneInputStyles={{
                  container: {
                    width: "100%",
                    borderWidth: 1,
                    borderColor: errors.phoneNumber ? "#ef4444" : "#e5e7eb",
                    borderRadius: 16,
                    backgroundColor: "white",
                    height: 56,
                  },
                  flagContainer: {
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    width: 90,
                    borderRightWidth: 1,
                    borderRightColor: "#e5e7eb",
                    paddingHorizontal: 8,
                    overflow: "hidden",
                  },
                  divider: {
                    width: 0,
                    display: "none",
                  },
                  caret: {
                    display: "none",
                    width: 0,
                  },
                  flag: {
                    fontSize: 18,
                  },
                  callingCode: {
                    fontSize: 14,
                    fontFamily: "Mulish-Semibold",
                    color: "#6b7280",
                    marginLeft: 4,
                  },
                  input: {
                    fontFamily: "Mulish-Semibold",
                    color: "#6b7280",
                    fontSize: 14,
                    flex: 1,
                    paddingLeft: 12,
                  },
                }}
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.phoneNumber}
                </Text>
              )}
            </View>
          </View>

          <View className="w-full px-6 mt-[124px]">
            <TouchableOpacity
              className={`w-full py-4 rounded-2xl flex-row items-center justify-center ${
                isLoading || !isFormFilled ? "bg-neutral-400" : "bg-primary-btn"
              }`}
              onPress={handleNext}
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
                    Creating account...
                  </Text>
                </>
              ) : (
                <Text className="text-white font-mulish-semibold text-base">
                  Next
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaViewWrapper>
  );
};

export default CreateAccount;
