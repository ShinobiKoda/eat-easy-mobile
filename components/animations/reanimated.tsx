import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import Animated, { 
  FadeIn, 
  FadeInDown, 
  FadeInUp, 
  FadeInLeft,
  FadeInRight,
  ZoomIn 
} from 'react-native-reanimated';

interface AnimationProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string; 
  style?: StyleProp<ViewStyle>;
}

export const FadeInView = ({ children, delay = 0, duration = 500, className, style }: AnimationProps) => (
  <Animated.View 
    entering={FadeIn.delay(delay).duration(duration)} 
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const SlideInUpView = ({ children, delay = 0, duration = 600, className, style }: AnimationProps) => (
  <Animated.View 
    entering={FadeInUp.delay(delay).duration(duration).springify().damping(12)} 
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const SlideInLeftView = ({ children, delay = 0, duration = 600, className, style }: AnimationProps) => (
  <Animated.View 
    entering={FadeInLeft.delay(delay).duration(duration).springify().damping(12)} 
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const SlideInRightView = ({ children, delay = 0, duration = 600, className, style }: AnimationProps) => (
  <Animated.View 
    entering={FadeInRight.delay(delay).duration(duration).springify().damping(12)} 
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);

export const PopInView = ({ children, delay = 0, duration = 500, className, style }: AnimationProps) => (
  <Animated.View 
    entering={ZoomIn.delay(delay).duration(duration).springify()} 
    className={className}
    style={style}
  >
    {children}
  </Animated.View>
);