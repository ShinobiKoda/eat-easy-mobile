import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  ZoomIn,
} from "react-native-reanimated";

interface ScaleOnPressProps extends AnimationProps {
  scaleTo?: number;
  onPress?: () => void;
}

export const ScaleOnPressView = ({
  children,
  scaleTo = 0.98,
  className,
  style,
  onPress,
  ...rest
}: ScaleOnPressProps) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        scale.value = withSpring(scaleTo, { damping: 15 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15 });
      }}
      onPress={onPress}
      {...rest}
    >
      <Animated.View style={[animatedStyle, style]} className={className}>
        {children}
      </Animated.View>
    </Pressable>
  );
};

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

export const FadeInView = ({
  children,
  delay = 0,
  duration = 500,
  className,
  style,
}: AnimationProps) => (
  <Animated.View
    entering={FadeIn.delay(delay).duration(duration)}
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const SlideInUpView = ({
  children,
  delay = 0,
  duration = 600,
  className,
  style,
}: AnimationProps) => (
  <Animated.View
    entering={FadeInUp.delay(delay).duration(duration).springify().damping(12)}
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const SlideInLeftView = ({
  children,
  delay = 0,
  duration = 600,
  className,
  style,
}: AnimationProps) => (
  <Animated.View
    entering={FadeInLeft.delay(delay)
      .duration(duration)
      .springify()
      .damping(12)}
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const SlideInRightView = ({
  children,
  delay = 0,
  duration = 600,
  className,
  style,
}: AnimationProps) => (
  <Animated.View
    entering={FadeInRight.delay(delay)
      .duration(duration)
      .springify()
      .damping(12)}
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const PopInView = ({
  children,
  delay = 0,
  duration = 500,
  className,
  style,
}: AnimationProps) => (
  <Animated.View
    entering={ZoomIn.delay(delay).duration(duration).springify()}
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);
