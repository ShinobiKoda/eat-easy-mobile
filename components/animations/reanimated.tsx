import React from "react";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInLeft,
  FadeInRight,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from "react-native-reanimated";

interface ScaleOnPressProps extends AnimationProps {
  scaleTo?: number;
  onPress?: () => void;
  disabled?: boolean;
}

export const ScaleOnPressView = ({
  children,
  scaleTo = 0.98,
  className,
  style,
  onPress,
  disabled,
  ...rest
}: ScaleOnPressProps) => {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPressIn={() => {
        if (!disabled) {
          scale.value = withTiming(scaleTo, { duration: 100 });
        }
      }}
      onPressOut={() => {
        if (!disabled) {
          scale.value = withTiming(1, { duration: 100 });
        }
      }}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
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
    entering={FadeInUp.delay(delay)
      .duration(duration)
      .easing(Easing.out(Easing.quad))}
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
      .easing(Easing.out(Easing.quad))}
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
      .easing(Easing.out(Easing.quad))}
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
    entering={ZoomIn.delay(delay)
      .duration(duration)
      .easing(Easing.out(Easing.quad))}
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const AnimatedProgressBar = ({
  initialProgress = 0,
  targetProgress,
  className,
  style,
}: {
  initialProgress?: number;
  targetProgress: number;
  className?: string;
  style?: StyleProp<ViewStyle>;
}) => {
  const width = useSharedValue(initialProgress);

  React.useEffect(() => {
    width.value = withTiming(targetProgress, {
      duration: 1000,
      easing: Easing.out(Easing.quad),
    });
  }, [targetProgress]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return <Animated.View style={[style, animatedStyle]} className={className} />;
};
