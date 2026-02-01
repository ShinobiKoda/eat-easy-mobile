import KeyboardAvoidingViewWrapper from "@/components/KeyboardAvoidingViewWrapper";
import PrimaryButton from "@/components/PrimaryButton";
import { SafeAreaViewWrapper } from "@/components/SafeAreaViewWrapper";
import { accountSchema } from "@/schemas/accountSchema";
import React, { useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import PhoneInput, { ICountry } from "react-native-international-phone-number";

const CreateAccount = () => {
  const phoneInputRef = useRef(null);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<ICountry | null>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const inputClassName =
    "border border-neutral-150 font-mulish-semibold text-neutral-500 text-sm rounded-2xl bg-white px-4 py-4 w-full";

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
              <TextInput
                className={inputClassName}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                placeholderTextColor="#9CA3AF"
              />
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
            <PrimaryButton text="Next" bgClass="bg-primary-btn" />
          </View>
        </ScrollView>
      </KeyboardAvoidingViewWrapper>
    </SafeAreaViewWrapper>
  );
};

export default CreateAccount;
