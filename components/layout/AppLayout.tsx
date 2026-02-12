import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInLeft,
  SlideOutLeft,
} from "react-native-reanimated";
import { SafeAreaViewWrapper } from "../SafeAreaViewWrapper";
import Header, { HeaderProps } from "./Header";
import Sidebar from "./Sidebar";

interface AppLayoutProps extends Omit<
  HeaderProps,
  "showSideBar" | "openSideBar"
> {
  children: React.ReactNode;
}

const AppLayout = ({
  children,
  title = "Eat Easy",
  showMenuButton = true,
  ...headerProps
}: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <SafeAreaViewWrapper>
      <View style={styles.container}>
        <Header
          title={title}
          showMenuButton={showMenuButton}
          openSideBar={toggleSidebar}
          showSideBar={isSidebarOpen}
          {...headerProps}
        />
        <View style={styles.content}>{children}</View>

        {isSidebarOpen && (
          <View style={[StyleSheet.absoluteFill, { zIndex: 100 }]}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={StyleSheet.absoluteFill}
            >
              <Pressable style={StyleSheet.absoluteFill} onPress={closeSidebar}>
                <BlurView
                  intensity={50}
                  tint="dark"
                  style={StyleSheet.absoluteFill}
                />
              </Pressable>
            </Animated.View>
            <Animated.View
              entering={SlideInLeft}
              exiting={SlideOutLeft}
              style={styles.sidebarContainer}
            >
              <Sidebar onClose={closeSidebar} />
            </Animated.View>
          </View>
        )}
      </View>
    </SafeAreaViewWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sidebarContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: 260, // Adjust width as needed
    maxWidth: 300,
    zIndex: 100,
  },
});

export default AppLayout;
