import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useColors } from "@/hooks/useColors";

type Props = {
  words: string[];
  found: Set<string>;
};

export function WordList({ words, found }: Props) {
  const colors = useColors();
  return (
    <View style={styles.container}>
      {words.map((word) => {
        const isFound = found.has(word);
        return (
          <View
            key={word}
            style={[
              styles.chip,
              {
                backgroundColor: isFound ? colors.success : colors.muted,
                borderColor: isFound ? colors.success : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isFound ? colors.successForeground : colors.foreground,
                  textDecorationLine: isFound ? "line-through" : "none",
                },
              ]}
            >
              {word}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    justifyContent: "center",
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  text: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 14,
    letterSpacing: 1,
  },
});
