import Ionicons from "@expo/vector-icons/Ionicons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
} from "react-native-reanimated";

import { useColors } from "@/hooks/useColors";

type FoundEntry = { word: string; color: string };

type Props = {
  words: string[];
  found: FoundEntry[];
  hintWord?: string | null;
};

function reveal(word: string, hintLevel: number): string {
  if (word.length <= 2) return word.split("").join(" ");
  if (hintLevel <= 0) {
    const chars = word.split("").map((c, i) => {
      if (i === 0 || i === word.length - 1) return c;
      return "_";
    });
    return chars.join(" ");
  }
  return word.split("").join(" ");
}

export function WordCardList({ words, found, hintWord }: Props) {
  const colors = useColors();
  const foundMap = new Map(found.map((f) => [f.word, f.color]));

  return (
    <View style={styles.grid}>
      {words.map((word) => {
        const color = foundMap.get(word);
        const isFound = !!color;
        const isHint = hintWord === word;
        return (
          <WordCardItem
            key={word}
            word={word}
            isFound={isFound}
            color={color}
            isHint={isHint}
            colors={colors}
          />
        );
      })}
    </View>
  );
}

function WordCardItem({
  word,
  isFound,
  color,
  isHint,
  colors,
}: {
  word: string;
  isFound: boolean;
  color?: string;
  isHint: boolean;
  colors: any;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isFound) {
      scale.value = withSequence(
        withTiming(1.1, { duration: 150 }),
        withSpring(1, { damping: 5, stiffness: 200 })
      );
    }
  }, [isFound]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const display = isFound ? word.split("").join(" ") : reveal(word, isHint ? 1 : 0);

  return (
    <Animated.View style={[styles.cardContainer, animatedStyle]}>
      {isFound ? (
        <LinearGradient
          colors={[color || colors.primary, color ? color + "aa" : colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.card, { borderColor: color, shadowColor: color, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 }]}
        >
          <View style={[styles.badge, { backgroundColor: "rgba(255,255,255,0.3)" }]}>
            <Ionicons name="checkmark" size={14} color="#ffffff" />
          </View>
          <Text style={[styles.word, { color: "#ffffff", letterSpacing: 1.5 }]}>
            {display}
          </Text>
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.card,
            {
              backgroundColor: "rgba(30, 41, 59, 0.7)", // dark frosted glass
              borderColor: isHint ? colors.accent : "rgba(255,255,255,0.1)",
              borderWidth: isHint ? 2 : 1.5,
            },
          ]}
        >
          <View style={[styles.badge, { backgroundColor: isHint ? colors.accent + "55" : "rgba(255,255,255,0.1)" }]}>
            <Text style={[styles.badgeQ, { color: isHint ? colors.accent : "rgba(255,255,255,0.4)" }]}>
              ?
            </Text>
          </View>
          <Text style={[styles.word, { color: isHint ? "#ffffff" : "rgba(255,255,255,0.5)", letterSpacing: 2 }]}>
            {display}
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  cardContainer: {
    flexBasis: "48%",
    flexGrow: 1,
    minHeight: 48,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    flex: 1,
  },
  badge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeQ: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 13,
  },
  word: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 15,
  },
});
