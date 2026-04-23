import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";
import {
  FadeInView,
  PopInView,
  SlideInUpView,
  ScaleOnPressView,
} from "../../components/animations/reanimated";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeIn,
  Layout,
} from "react-native-reanimated";
import Header from "../../components/layout/Header";

/* ─── FAQ Data ─── */
const faqs = [
  {
    question: "How do I place an order?",
    answer:
      "Browse the Full Menu, tap any dish to view details, then add it to your cart. When you're ready, open your cart from the sidebar and hit 'Send Order'. Your order will be prepared and you can track its status in real time.",
  },
  {
    question: "Can I customise my order?",
    answer:
      "Absolutely! When viewing a dish you can select toppings, adjust quantity, and leave special instructions before adding it to your cart.",
  },
  {
    question: "How does the Smart Assistant work?",
    answer:
      "Our AI-powered Smart Assistant asks about your budget, party size, and food preferences, then generates a personalised meal recommendation tailored just for you. It's like having a personal food concierge!",
  },
  {
    question: "What payment methods are accepted?",
    answer:
      "We accept all major credit and debit cards, mobile payments (Apple Pay, Google Pay), and EatEasy credit points earned through our rewards programme.",
  },
  {
    question: "How do rewards and points work?",
    answer:
      "Every order earns you credit points. Accumulate points to unlock discounts, free dishes, and exclusive offers. Visit the My Rewards page to track your balance and claim rewards.",
  },
  {
    question: "Can I cancel or modify my order?",
    answer:
      "You can modify your order before it's confirmed. Once the restaurant starts preparing it, changes aren't possible — but you can always contact support for help.",
  },
  {
    question: "Is my data safe?",
    answer:
      "Yes. We use industry-standard encryption and never share your personal data with third parties. Your privacy is our priority.",
  },
  {
    question: "How do I change my delivery location?",
    answer:
      "Tap the location icon in the header to update your address. You can use GPS auto-detect or enter a custom address manually.",
  },
];

/* ─── Story Highlights ─── */
const storyHighlights = [
  {
    icon: "lightbulb-outline" as const,
    iconFamily: "MaterialCommunityIcons" as const,
    color: "#FFB01D",
    title: "The Idea",
    text: "EatEasy started with a simple question: why is ordering food still so complicated? We set out to build something effortless.",
  },
  {
    icon: "sparkles" as const,
    iconFamily: "Ionicons" as const,
    color: "#615793",
    title: "Smart by Design",
    text: "We wove AI into every corner — from personalised recommendations to a smart assistant that learns your taste over time.",
  },
  {
    icon: "heart-outline" as const,
    iconFamily: "Ionicons" as const,
    color: "#FF7B2C",
    title: "Built with Love",
    text: "Every pixel, animation, and interaction is crafted to make your dining experience delightful, whether you're ordering for one or a party of ten.",
  },
];

/* ─── Quick Links ─── */
const quickLinks = [
  {
    icon: "restaurant-outline" as const,
    label: "Browse Menu",
    desc: "Explore all dishes and cuisines",
    route: "/(protected)/FullMenu" as const,
  },
  {
    icon: "bag-handle-outline" as const,
    label: "Order Status",
    desc: "Track your active orders",
    route: "/(protected)/OrderStatus" as const,
  },
  {
    icon: "gift-outline" as const,
    label: "Rewards",
    desc: "View and claim your rewards",
    route: "/(protected)/Rewards" as const,
  },
  {
    icon: "shield-checkmark-outline" as const,
    label: "Smart Assistant",
    desc: "Get AI-powered meal suggestions",
    route: "/(protected)/(virtual_assistant)/ChooseVirtualAssistant" as const,
  },
];

/* ─── Accordion Item ─── */
const AccordionItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  const rotation = useSharedValue(0);

  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 250 });
  }, [isOpen]);

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View className="bg-white dark:bg-neutral-700 rounded-2xl mb-3 overflow-hidden shadow-sm">
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-5 py-4"
      >
        <Text className="font-semibold text-[15px] text-neutral-800 dark:text-white flex-1 pr-4">
          {question}
        </Text>
        <Animated.View style={chevronStyle}>
          <Feather name="chevron-down" size={20} color="#a3a3a3" />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View entering={FadeIn.duration(200)}>
          <View className="px-5 pb-4">
            <Text className="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed">
              {answer}
            </Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

/* ─── Help Page ─── */
const Help: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <View className="flex-1 bg-neutral-50 dark:bg-neutral-900">
      <Header
        title="Help & FAQ"
        backButton={true}
        showSideBar={false}
      />

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="px-5 pt-4">
          {/* ── Hero Banner ── */}
          <PopInView>
            <View className="relative overflow-hidden rounded-3xl bg-purple-700 p-6 mb-6">
              {/* Decorative circles */}
              <View className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/5" />
              <View className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/5" />

              <View className="relative z-10">
                <View className="flex-row items-center gap-2 mb-2">
                  <Ionicons name="chatbubble-ellipses-outline" size={20} color="rgba(255,255,255,0.8)" />
                  <Text className="text-white/70 text-xs font-semibold uppercase tracking-wider">
                    Help Centre
                  </Text>
                </View>
                <Text className="text-white font-bold text-[24px] leading-tight mb-2">
                  How can we{"\n"}help you today?
                </Text>
                <Text className="text-white/70 text-sm">
                  Browse our FAQ below or reach out — we're always happy to help.
                </Text>
              </View>
            </View>
          </PopInView>

          {/* ── Our Story ── */}
          <FadeInView>
            <Text className="font-bold text-lg text-neutral-800 dark:text-white mb-1">
              Our Story
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              EatEasy was born from a passion for great food and great technology.
            </Text>
          </FadeInView>

          <View className="mb-6">
            {storyHighlights.map((item, i) => (
              <FadeInView key={i} delay={i * 100}>
                <View className="bg-white dark:bg-neutral-700 rounded-2xl p-5 shadow-sm mb-3 gap-3">
                  <View
                    className="w-12 h-12 rounded-xl items-center justify-center"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    {item.iconFamily === "Ionicons" ? (
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
                    ) : (
                      <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                    )}
                  </View>
                  <Text className="font-bold text-base text-neutral-800 dark:text-white">
                    {item.title}
                  </Text>
                  <Text className="text-sm text-neutral-500 dark:text-neutral-300 leading-relaxed">
                    {item.text}
                  </Text>
                </View>
              </FadeInView>
            ))}
          </View>

          {/* ── FAQ Section ── */}
          <FadeInView>
            <Text className="font-bold text-lg text-neutral-800 dark:text-white mb-1">
              Frequently Asked Questions
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Quick answers to common questions.
            </Text>
          </FadeInView>

          <View className="mb-6">
            {faqs.map((faq, i) => (
              <AccordionItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </View>

          {/* ── Quick Links ── */}
          <FadeInView>
            <Text className="font-bold text-lg text-neutral-800 dark:text-white mb-1">
              Quick Links
            </Text>
            <Text className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">
              Jump to key areas of the app.
            </Text>
          </FadeInView>

          <View className="mb-6">
            {quickLinks.map((link, i) => (
              <FadeInView key={i} delay={i * 80}>
                <ScaleOnPressView
                  onPress={() => router.push(link.route as any)}
                  className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm flex-row items-center gap-4 mb-3"
                >
                  <View className="w-11 h-11 rounded-xl bg-neutral-100 dark:bg-neutral-600 items-center justify-center">
                    <Ionicons
                      name={link.icon as any}
                      size={22}
                      color={colorScheme === "dark" ? "#d4d4d8" : "#615793"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-[15px] text-neutral-800 dark:text-white">
                      {link.label}
                    </Text>
                    <Text className="text-xs text-neutral-500 dark:text-neutral-400">
                      {link.desc}
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={18} color="#a3a3a3" />
                </ScaleOnPressView>
              </FadeInView>
            ))}
          </View>

          {/* ── Contact CTA ── */}
          <FadeInView>
            <View className="bg-white dark:bg-neutral-700 rounded-3xl p-6 shadow-sm items-center gap-4 mb-6">
              <View className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 items-center justify-center">
                <Ionicons name="mail-outline" size={32} color="#615793" />
              </View>
              <Text className="font-bold text-lg text-neutral-800 dark:text-white text-center">
                Still need help?
              </Text>
              <Text className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
                Our support team is just an email away. We usually reply within a few hours.
              </Text>
              <ScaleOnPressView
                onPress={() => Linking.openURL("mailto:support@eateasy.com")}
                className="bg-purple-600 rounded-2xl px-8 py-3.5"
              >
                <Text className="text-white font-semibold text-sm">
                  Contact Support
                </Text>
              </ScaleOnPressView>
            </View>
          </FadeInView>

          {/* ── Footer ── */}
          <FadeInView>
            <View className="items-center py-4">
              <Text className="text-sm text-neutral-400 dark:text-neutral-500">
                <Text className="text-neutral-800 dark:text-neutral-100">Eat</Text>
                <Text className="font-bold text-orange-500">Easy</Text>
                {" · Making meals effortless"}
              </Text>
              <Text className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
                © {new Date().getFullYear()} EatEasy. All rights reserved.
              </Text>
            </View>
          </FadeInView>
        </View>
      </ScrollView>
    </View>
  );
};

export default Help;
