import { useRef, useCallback } from "react";
import { Animated } from "react-native";

export function useBouncyPress(scale = 0.95) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: scale,
      useNativeDriver: true,
      speed: 50,
      bounciness: 4,
    }).start();
  }, [scaleAnim, scale]);

  const onPressOut = useCallback(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 12,
    }).start();
  }, [scaleAnim]);

  return { scaleAnim, onPressIn, onPressOut };
}
