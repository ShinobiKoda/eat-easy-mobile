import { FadeInView, SlideInUpView } from "@/components/animations/reanimated";
import {
  CheckmarkCircleIcon,
  EllipseOutlineIcon,
  EyeIcon,
  EyeOffIcon,
} from "@/components/icons/Icons";
import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { useTheme } from "@/contexts/ThemeContext";
import { supabase } from "@/lib/Supabase";
import { accountSchema } from "@/schemas/accountSchema";
import { getLocales } from "expo-localization";
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

interface PasswordRequirementProps {
  label: string;
  isMet: boolean;
  isDark: boolean;
}

const PasswordRequirement = ({
  label,
  isMet,
  isDark,
}: PasswordRequirementProps) => (
  <View className="flex-row items-center gap-2 mt-1">
    {isMet ? (
      <CheckmarkCircleIcon size={16} color="#10B981" />
    ) : (
      <EllipseOutlineIcon size={16} color={isDark ? "#666687" : "#9CA3AF"} />
    )}
    <Text
      className={`text-xs font-mulish-medium ${
        isMet
          ? "text-emerald-500"
          : isDark
            ? "text-neutral-400"
            : "text-neutral-500"
      }`}
    >
      {label}
    </Text>
  </View>
);

const CreateAccount = () => {
  const phoneInputRef = useRef(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // Auto-detect user region
  React.useEffect(() => {
    const locales = getLocales();
    const regionCode = locales[0]?.regionCode;
    // We let the PhoneInput handle matching the region code via defaultCountry if we could,
    // but since we need to pass selectedCountry object if we want to control it fully,
    // passing defaultCountry prop is the standard way with this library to set initial flag.
  }, []);

  const passwordRequirements = [
    { label: "At least 8 characters", isMet: password.length >= 8 },
    { label: "At least 1 lowercase letter", isMet: /[a-z]/.test(password) },
    { label: "At least 1 uppercase letter", isMet: /[A-Z]/.test(password) },
    { label: "At least 1 number", isMet: /[0-9]/.test(password) },
    {
      label: "At least 1 special character",
      isMet: /[^A-Za-z0-9]/.test(password),
    },
  ];

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
      // 1. Check if email is already registered via profile table (avoids triggering Supabase emails)
      const { data: existingProfile } = await supabase
        .from("eat_easy_profile")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (existingProfile) {
        Alert.alert(
          "Account Exists",
          "This email has already been used to sign up. Please sign in instead.",
          [
            {
              text: "Go to Sign In",
              onPress: () => router.push("/SignIn"),
            },
            { text: "Cancel", style: "cancel" },
          ],
        );
        setIsLoading(false);
        return;
      }

     

      // 2. Send verification code via server-side API
      // The API route handles OTP generation, DB storage, and email sending
      const apiUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000";

      const navigateToVerify = () => {
        router.push({
          pathname: "/VerifyCode",
          params: { email, password, username, phone: phoneNumber },
        });
      };

      try {
        const response = await fetch(`${apiUrl}/api/send-code`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.log("⚠️ API call failed:", errorData);
          Alert.alert(
            "Note",
            "Email service unavailable. Please try again later.",
            [{ text: "Continue", onPress: navigateToVerify }],
          );
          setIsLoading(false);
          return;
        }
      } catch {
        console.log("⚠️ Email send failed — network error");
        Alert.alert(
          "Note",
          "Email service unavailable. Please try again later.",
          [{ text: "Continue", onPress: navigateToVerify }],
        );
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      navigateToVerify();

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
    "border border-neutral-150 font-mulish-semibold text-neutral-500 text-sm rounded-2xl bg-white px-4 py-4 w-full dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200";

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
          <SlideInUpView
            delay={100}
            className="flex flex-col items-center justify-center px-6 mb-[40px] gap-[14px]"
          >
            <Text className="font-dm-medium text-[22px] text-neutral-800 dark:text-white">
              Getting Started! ✌️
            </Text>
            <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150 text-center">
              Looks like you&apos;re new to us! Create an account for a complete
              experience.
            </Text>
          </SlideInUpView>

          <View className="px-6 w-full gap-[20px]">
            <FadeInView delay={200} className="w-full">
              <TextInput
                className={inputClassName}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                placeholderTextColor={isDark ? "#e5e5e5" : "#9CA3AF"}
              />
              {errors.username && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.username}
                </Text>
              )}
            </FadeInView>
            {/* Email Input */}
            <FadeInView delay={300} className="w-full">
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
            {/* Password Input */}
            <FadeInView delay={400} className="w-full">
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
                  {isPasswordVisible ? (
                    <EyeOffIcon
                      size={20}
                      color={isDark ? "#e5e5e5" : "#6b7280"}
                    />
                  ) : (
                    <EyeIcon size={20} color={isDark ? "#e5e5e5" : "#6b7280"} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Password Checklist & Errors */}
              {password.length > 0 && (
                <View className="mt-2 ml-1">
                  {passwordRequirements.map((req, index) => (
                    <PasswordRequirement
                      key={index}
                      label={req.label}
                      isMet={req.isMet}
                      isDark={isDark}
                    />
                  ))}
                </View>
              )}
              {errors.password && password.length === 0 && (
                <Text className="text-red-500 font-mulish-medium text-xs mt-1 px-1">
                  {errors.password}
                </Text>
              )}
            </FadeInView>
            {/* Phone Number Input */}
            <FadeInView delay={500} className="w-full">
              <PhoneInput
                ref={phoneInputRef}
                value={phoneNumber}
                onChangeText={handleChangePhoneText}
                selectedCountry={selectedCountry}
                onChangeSelectedCountry={handleSelectedCountry}
                defaultCountry={getLocales()[0]?.regionCode as any}
                placeholder="Enter phone number"
                phoneInputStyles={{
                  container: {
                    width: "100%",
                    borderWidth: 1,
                    borderColor: errors.phoneNumber
                      ? "#ef4444"
                      : isDark
                        ? "#666687"
                        : "#e5e7eb",
                    borderRadius: 16,
                    backgroundColor: isDark ? "#4A4A6A" : "white",
                    height: 56,
                  },
                  flagContainer: {
                    backgroundColor: "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    width: 90,
                    borderRightWidth: 1,
                    borderRightColor: isDark ? "#666687" : "#e5e7eb",
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
                    color: isDark ? "#DCDCE4" : "#6b7280",
                    marginLeft: 4,
                  },
                  input: {
                    fontFamily: "Mulish-Semibold",
                    color: isDark ? "#DCDCE4" : "#6b7280",
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
            </FadeInView>
          </View>

          <FadeInView delay={600} className="w-full px-6 mt-[124px]">
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
          </FadeInView>

          <FadeInView
            delay={800}
            className="w-full px-6 flex-row justify-center items-center mt-4 gap-1"
          >
            <Text className="font-mulish-medium text-base text-neutral-600 dark:text-neutral-150">
              Already have an account?
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

export default CreateAccount;
