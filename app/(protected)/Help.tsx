import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import AppLayout from "../../components/layout/AppLayout";
import { FadeInView, PopInView, ScaleOnPressView } from "../../components/animations/reanimated";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, measure, useAnimatedRef } from "react-native-reanimated";

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
    icon: <Ionicons name="bulb-outline" size={28} color="#eab308" />,
    title: "The Idea",
    text: "EatEasy started with a simple question: why is ordering food still so complicated? We set out to build something effortless.",
  },
  {
    icon: <Ionicons name="sparkles-outline" size={28} color="#9333ea" />,
    title: "Smart by Design",
    text: "We wove AI into every corner — from personalised recommendations to a smart assistant that learns your taste over time.",
  },
  {
    icon: <Ionicons name="heart-outline" size={28} color="#f97316" />,
    title: "Built with Love",
    text: "Every pixel, animation, and interaction is crafted to make your dining experience delightful, whether you're ordering for one or a party of ten.",
  },
];

/* ─── Quick Links ─── */
const quickLinks = [
  {
    icon: <Ionicons name="restaurant-outline" size={22} color="#9333ea" />,
    label: "Browse Menu",
    desc: "Explore all dishes and cuisines",
    route: "/(protected)/Restaurants",
  },
  {
    icon: <Feather name="shopping-bag" size={22} color="#f97316" />,
    label: "Order Status",
    desc: "Track your active orders",
    route: "/(protected)/OrderStatus",
  },
  {
    icon: <MaterialIcons name="delivery-dining" size={22} color="#eab308" />,
    label: "Rewards",
    desc: "View and claim your rewards",
    route: "/(protected)/Rewards",
  },
  {
    icon: <Ionicons name="shield-checkmark-outline" size={22} color="#22c55e" />,
    label: "Smart Assistant",
    desc: "Get AI-powered meal suggestions",
    route: "/(protected)/(virtual_assistant)/ChooseVirtualAssistant",
  },
];

/* ─── Accordion Item ─── */
const AccordionItem: React.FC<{
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ question, answer, isOpen, onToggle }) => {
  const animatedHeight = useSharedValue(0);
  const animatedRotation = useSharedValue(0);
  const contentRef = useAnimatedRef<Animated.View>();

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const measured = measure(contentRef);
        const height = measured ? measured.height : 100;
        animatedHeight.value = withTiming(height, { duration: 300, easing: Easing.out(Easing.exp) });
        animatedRotation.value = withTiming(180, { duration: 300 });
      }, 0);
    } else {
      animatedHeight.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
      animatedRotation.value = withTiming(0, { duration: 300 });
    }
  }, [isOpen]);

  const bodyStyle = useAnimatedStyle(() => ({
    height: animatedHeight.value,
    opacity: animatedHeight.value > 0 ? 1 : 0,
    overflow: 'hidden',
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${animatedRotation.value}deg` }],
  }));

  return (
    <View className="bg-white dark:bg-neutral-700 rounded-2xl shadow-sm mb-3 overflow-hidden">
      <TouchableOpacity
        onPress={onToggle}
        activeOpacity={0.7}
        className="flex-row items-center justify-between px-5 py-4"
      >
        <Text className="font-semibold text-[15px] text-neutral-800 dark:text-white flex-1 pr-4">
          {question}
        </Text>
        <Animated.View style={iconStyle}>
          <Feather name="chevron-down" size={20} color="#9ca3af" />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={bodyStyle}>
        <Animated.View ref={contentRef} className="absolute top-0 w-full px-5 pb-4">
          <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-300 leading-relaxed">
            {answer}
          </Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
};

/* ─── Help Page ─── */
const Help: React.FC = () => {
  const router = useRouter();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleSupportEmail = () => {
    Linking.openURL("mailto:support@eateasy.com");
  };

  return (
    <AppLayout title="Help & FAQ" showMenuButton={true} locationIcon={false} backButton={false}>
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* ── Hero Banner ── */}
        <PopInView className="mb-10">
          <LinearGradient
            colors={["#9333ea", "#7e22ce"]}
            className="rounded-3xl p-8 overflow-hidden relative"
          >
            {/* Decorative circles */}
            <View className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10" />
            <View className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/10" />

            <View className="relative z-10">
              <View className="flex-row items-center gap-2 mb-3">
                <Ionicons name="chatbubbles-outline" size={24} color="rgba(255,255,255,0.8)" />
                <Text className="text-white/80 text-sm font-semibold uppercase tracking-wider">
                  Help Centre
                </Text>
              </View>
              <Text className="text-white font-bold text-[32px] leading-tight font-mullish mb-3">
                How can we{"\n"}help you today?
              </Text>
              <Text className="text-white/80 text-base font-medium max-w-[250px]">
                Browse our FAQ below or reach out — we're always happy to help.
              </Text>
            </View>
          </LinearGradient>
        </PopInView>

        {/* ── Our Story ── */}
        <View className="mb-10">
          <FadeInView delay={100}>
            <Text className="font-bold text-xl text-neutral-800 dark:text-white mb-2 font-mullish">
              Our Story
            </Text>
            <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
              EatEasy was born from a passion for great food and great technology. Here's the journey in a nutshell.
            </Text>
          </FadeInView>

          <View className="space-y-4">
            {storyHighlights.map((item, i) => (
              <FadeInView delay={200 + i * 100} key={i}>
                <View className="bg-white dark:bg-neutral-700 rounded-2xl p-6 shadow-sm flex-row gap-4 items-start mb-4">
                  <View className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-600 flex items-center justify-center shrink-0">
                    {item.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="font-bold text-base text-neutral-800 dark:text-white mb-1">
                      {item.title}
                    </Text>
                    <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-300 leading-relaxed">
                      {item.text}
                    </Text>
                  </View>
                </View>
              </FadeInView>
            ))}
          </View>
        </View>

        {/* ── FAQ Section ── */}
        <View className="mb-10">
          <FadeInView delay={300}>
            <Text className="font-bold text-xl text-neutral-800 dark:text-white mb-2 font-mullish">
              Frequently Asked Questions
            </Text>
            <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
              Quick answers to common questions.
            </Text>
          </FadeInView>

          <View>
            {faqs.map((faq, i) => (
              <FadeInView delay={400 + i * 50} key={i}>
                <AccordionItem
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              </FadeInView>
            ))}
          </View>
        </View>

        {/* ── Quick Links ── */}
        <View className="mb-10">
          <FadeInView delay={500}>
            <Text className="font-bold text-xl text-neutral-800 dark:text-white mb-2 font-mullish">
              Quick Links
            </Text>
            <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
              Jump to key areas of the app.
            </Text>
          </FadeInView>

          <View className="flex-row flex-wrap justify-between">
            {quickLinks.map((link, i) => (
              <FadeInView delay={600 + i * 50} key={i} className="w-[48%] mb-4">
                <ScaleOnPressView onPress={() => router.push(link.route as any)} className="bg-white dark:bg-neutral-700 rounded-2xl p-4 shadow-sm h-full">
                  <View className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-600 flex items-center justify-center shrink-0 mb-3">
                    {link.icon}
                  </View>
                  <Text className="font-semibold text-sm text-neutral-800 dark:text-white mb-1">
                    {link.label}
                  </Text>
                  <Text className="text-xs font-medium text-neutral-500 dark:text-neutral-400 leading-snug">
                    {link.desc}
                  </Text>
                </ScaleOnPressView>
              </FadeInView>
            ))}
          </View>
        </View>

        {/* ── Contact / Support CTA ── */}
        <FadeInView delay={700}>
          <View className="bg-white dark:bg-neutral-700 rounded-3xl p-8 shadow-sm flex-col items-center gap-4 mb-8">
            <View className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Feather name="mail" size={32} color="#9333ea" />
            </View>
            <View className="text-center items-center">
              <Text className="font-bold text-lg text-neutral-800 dark:text-white font-mullish text-center">
                Still need help?
              </Text>
              <Text className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mt-2 text-center max-w-[280px]">
                Our support team is just an email away. We usually reply within a few hours.
              </Text>
            </View>
            <ScaleOnPressView onPress={handleSupportEmail} className="px-8 py-4 rounded-2xl bg-purple-600 w-full mt-4 items-center">
              <Text className="text-white font-bold text-sm">
                Contact Support
              </Text>
            </ScaleOnPressView>
          </View>
        </FadeInView>

        {/* ── Footer ── */}
        <FadeInView delay={800}>
          <View className="items-center py-4 opacity-70">
            <Text className="text-sm font-semibold text-neutral-400 dark:text-neutral-500 mb-1">
              <Text className="font-medium text-neutral-800 dark:text-neutral-100">Eat</Text>
              <Text className="font-bold text-orange-500">Easy</Text>{" "}
              &middot; Making meals effortless
            </Text>
            <Text className="text-xs font-medium text-neutral-400 dark:text-neutral-500">
              &copy; {new Date().getFullYear()} EatEasy. All rights reserved.
            </Text>
          </View>
        </FadeInView>

      </ScrollView>
    </AppLayout>
  );
};

export default Help;
