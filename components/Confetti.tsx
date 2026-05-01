import React, { useEffect, useMemo, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const EMOJIS = ["🎉", "⭐", "✨", "🎊", "💫", "🌟", "🏆", "🎈"];
const COLORS = ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#06b6d4"];

type Particle = {
  type: "emoji" | "shape";
  content?: string;
  shape?: "circle" | "rect";
  color?: string;
  startX: number;
  endX: number;
  delay: number;
  duration: number;
  rotateDir: number;
  size: number;
  anim: Animated.Value;
};

type Props = {
  active: boolean;
  count?: number;
};

export function Confetti({ active, count = 60 }: Props) {
  const { width, height } = Dimensions.get("window");

  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }).map(() => {
      const isEmoji = Math.random() > 0.6;
      return {
        type: isEmoji ? "emoji" : "shape",
        content: isEmoji ? EMOJIS[Math.floor(Math.random() * EMOJIS.length)] : undefined,
        shape: Math.random() > 0.5 ? "circle" : "rect",
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        startX: Math.random() * width,
        endX: Math.random() * width,
        delay: Math.random() * 800,
        duration: 2000 + Math.random() * 2000,
        rotateDir: Math.random() > 0.5 ? 1 : -1,
        size: 15 + Math.floor(Math.random() * 20),
        anim: new Animated.Value(0),
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, active, width]);

  const startedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      startedRef.current = false;
      particles.forEach((p) => p.anim.setValue(0));
      return;
    }
    if (startedRef.current) return;
    startedRef.current = true;
    particles.forEach((p) => {
      Animated.timing(p.anim, {
        toValue: 1,
        duration: p.duration,
        delay: p.delay,
        useNativeDriver: true,
      }).start();
    });
  }, [active, particles]);

  if (!active) return null;

  return (
    <View style={[StyleSheet.absoluteFill, styles.layer, { pointerEvents: 'none' }]}>
      {particles.map((p, i) => {
        const translateY = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [-60, height + 60],
        });
        const translateX = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: [p.startX, p.endX],
        });
        const rotate = p.anim.interpolate({
          inputRange: [0, 1],
          outputRange: ["0deg", `${p.rotateDir * 720}deg`],
        });
        const opacity = p.anim.interpolate({
          inputRange: [0, 0.1, 0.8, 1],
          outputRange: [0, 1, 1, 0],
        });

        const animatedStyle = {
          position: "absolute" as const,
          top: 0,
          left: 0,
          opacity,
          transform: [{ translateX }, { translateY }, { rotate }],
        };

        if (p.type === "emoji") {
          return (
            <Animated.Text
              key={i}
              style={[animatedStyle, { fontSize: p.size }]}
            >
              {p.content}
            </Animated.Text>
          );
        }

        return (
          <Animated.View
            key={i}
            style={[
              animatedStyle,
              {
                width: p.size,
                height: p.shape === "rect" ? p.size * 1.5 : p.size,
                backgroundColor: p.color,
                borderRadius: p.shape === "circle" ? p.size : 4,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  layer: { zIndex: 9999 },
});
