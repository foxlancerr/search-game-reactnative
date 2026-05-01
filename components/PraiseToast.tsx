import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
} from "react-native-reanimated";

type Props = {
  message: { id: number; text: string; emoji: string; color: string } | null;
};

export function PraiseToast({ message }: Props) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    if (!message) return;
    
    // Reset
    scale.value = 0.4;
    opacity.value = 0;
    translateY.value = 50;

    // Enter
    scale.value = withSpring(1, { damping: 10, stiffness: 150 });
    opacity.value = withTiming(1, { duration: 200 });
    translateY.value = withSpring(0, { damping: 12, stiffness: 120 });

    // Exit
    opacity.value = withDelay(1200, withTiming(0, { duration: 400 }));
    translateY.value = withDelay(1200, withTiming(-60, { duration: 500 }));
  }, [message, scale, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }, { translateY: translateY.value }],
    };
  });

  if (!message) return null;

  return (
    <View style={[styles.wrap, { pointerEvents: 'none' }]}>
      <Animated.View
        style={[
          styles.bubble,
          {
            backgroundColor: message.color,
            shadowColor: message.color,
          },
          animatedStyle,
        ]}
      >
        <View style={styles.glow} />
        <Text style={styles.emoji}>{message.emoji}</Text>
        <Text style={styles.text}>{message.text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: "35%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 100,
  },
  bubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 999,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 15,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    overflow: "hidden",
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    opacity: 0.15,
  },
  emoji: { fontSize: 32 },
  text: {
    color: "#ffffff",
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 28,
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});
