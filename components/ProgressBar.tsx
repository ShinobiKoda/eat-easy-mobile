import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  Easing,
  withDelay
} from 'react-native-reanimated';

export const ProgressBar = () => {
  const progress = useSharedValue(0);

  useEffect(() => {
    // This starts automatically when the component mounts
    progress.value = withDelay(100, withTiming(100, {
      duration: 3900,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    }));

    // Cleanup reset
    return () => { progress.value = 0; };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="w-full flex-row justify-center px-6">
      <View 
        className="w-full h-1.5 bg-neutral-150 dark:bg-neutral-800 max-w-[140px] rounded-2xl overflow-hidden flex-row"
      >
        <View className="w-1/3 h-full">
          <Animated.View 
            className="h-full bg-[#FFB01D] rounded-2xl"
            style={animatedStyle}
          />
        </View>
        {/* Fillers to maintain layout structure */}
        <View className="flex-1" />
        <View className="flex-1" />
      </View>
    </View>
  );
};