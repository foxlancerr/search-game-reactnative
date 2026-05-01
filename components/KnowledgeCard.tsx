import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  visible: boolean;
  word: string;
  emoji: string;
  card: string;
  color: string;
  iqGained: number;
  onClose: () => void;
};

export function KnowledgeCard({
  visible,
  word,
  emoji,
  card,
  color,
  iqGained,
  onClose,
}: Props) {
  const translateY = useSharedValue(400);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      translateY.value = withSpring(0, { damping: 14, stiffness: 100 });
      opacity.value = withTiming(1, { duration: 250 });
      scale.value = withSpring(1, { damping: 12, stiffness: 120 });
      
      glowScale.value = withRepeat(
        withTiming(1.2, { duration: 1000 }),
        -1,
        true
      );
    } else {
      translateY.value = withTiming(400, { duration: 250 });
      opacity.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(0.8, { duration: 200 });
    }
  }, [visible]);

  const animatedBackdrop = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const animatedCard = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const animatedGlow = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.backdrop, animatedBackdrop]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Animated.View style={[styles.card, animatedCard]}>
          <LinearGradient
            colors={[color, color + "88"]}
            style={styles.headerPanel}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.emojiWrap}>
              <Text style={styles.emoji}>{emoji}</Text>
            </View>
          </LinearGradient>

          <View style={styles.content}>
            <View style={styles.iqContainer}>
              <Animated.View
                style={[
                  styles.iqGlow,
                  { backgroundColor: color },
                  animatedGlow,
                ]}
              />
              <View style={[styles.iqBadge, { borderColor: color, backgroundColor: "rgba(30, 41, 59, 0.8)" }]}>
                <Ionicons name="flash" size={14} color={color} />
                <Text style={[styles.iqText, { color }]}>+{iqGained} IQ</Text>
              </View>
            </View>

            <Text style={[styles.word, { color }]}>{word}</Text>
            
            <View style={[styles.divider, { backgroundColor: color + "33" }]} />

            <Text style={styles.cardText}>{card}</Text>

            <Pressable onPress={onClose} style={({ pressed }) => [{ width: "100%", opacity: pressed ? 0.8 : 1 }]}>
              <LinearGradient
                colors={[color, color + "dd"]}
                style={styles.gotItBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.gotItText}>Got it!</Text>
                <Ionicons name="star" size={18} color="#ffffff" />
              </LinearGradient>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#1e1040", // dark theme card
    borderRadius: 24,
    width: "100%",
    maxWidth: 400,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 15 },
    elevation: 20,
  },
  headerPanel: {
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emojiWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  emoji: {
    fontSize: 50,
  },
  content: {
    padding: 24,
    alignItems: "center",
  },
  iqContainer: {
    marginTop: -40,
    marginBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iqGlow: {
    position: "absolute",
    width: 120,
    height: 40,
    borderRadius: 20,
    opacity: 0.4,
    filter: [{ blur: 10 }],
  },
  iqBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 2,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  iqText: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  word: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 42,
    letterSpacing: 2,
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    width: "80%",
    height: 2,
    marginBottom: 20,
    borderRadius: 1,
  },
  cardText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    fontSize: 18,
    color: "#e2e8f0",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 30,
  },
  gotItBtn: {
    flexDirection: "row",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  gotItText: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 20,
    color: "#ffffff",
    letterSpacing: 1,
  },
});
