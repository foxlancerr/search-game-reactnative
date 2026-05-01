import { Ionicons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

type Props = {
  count: number;
  total?: number;
  size?: number;
};

export function StarsRow({ count, total = 3, size = 18 }: Props) {
  const colors = useColors();

  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <StarItem
          key={i}
          index={i}
          filled={i < count}
          size={size}
          colors={colors}
        />
      ))}
    </View>
  );
}

function StarItem({
  index,
  filled,
  size,
  colors,
}: {
  index: number;
  filled: boolean;
  size: number;
  colors: any;
}) {
  const scale = useSharedValue(size >= 30 ? 0 : 1);
  const opacity = useSharedValue(size >= 30 ? 0 : 1);

  useEffect(() => {
    if (size >= 30) {
      if (filled) {
        scale.value = withDelay(
          index * 300,
          withSequence(
            withTiming(1.5, { duration: 200 }),
            withSpring(1, { damping: 5, stiffness: 100 })
          )
        );
        opacity.value = withDelay(index * 300, withTiming(1, { duration: 200 }));
      } else {
        scale.value = withDelay(index * 300, withSpring(1));
        opacity.value = withDelay(index * 300, withTiming(1));
      }
    }
  }, [filled, index, size]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.starContainer, { width: size, height: size }]}>
      {filled && (
        <View
          style={[
            styles.glow,
            {
              width: size * 1.5,
              height: size * 1.5,
              backgroundColor: colors.secondary,
              borderRadius: size,
            },
          ]}
        />
      )}
      <Animated.View style={animatedStyle}>
        <Ionicons
          name={filled ? "star" : "star-outline"}
          size={size}
          color={filled ? colors.secondary : colors.mutedForeground}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  starContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  glow: {
    position: "absolute",
    opacity: 0.3,
    shadowColor: "#f59e0b",
    shadowOpacity: 0.8,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
});
