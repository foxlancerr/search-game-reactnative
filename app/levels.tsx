import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useMemo, useEffect, useRef } from "react";
import {
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { StarsRow } from "@/components/StarsRow";
import { useProgressStore } from "@/src/store/useProgressStore";
import { useBouncyPress } from "@/src/hooks/useBouncyPress";
import { useColors } from "@/hooks/useColors";
import { MISSIONS, CHAPTER_COLORS, type Mission } from "@/utils/missions";

type Chapter = {
  chapterNum: number;
  chapterName: string;
  chapterIcon: string;
  missions: Mission[];
};

function groupByChapter(missions: Mission[]): Chapter[] {
  const map = new Map<number, Chapter>();
  for (const m of missions) {
    if (!map.has(m.chapter)) {
      map.set(m.chapter, {
        chapterNum: m.chapter,
        chapterName: m.chapterName,
        chapterIcon: m.chapterIcon,
        missions: [],
      });
    }
    map.get(m.chapter)!.missions.push(m);
  }
  return Array.from(map.values()).sort((a, b) => a.chapterNum - b.chapterNum);
}

function MissionCard({ mission, index }: { mission: Mission; index: number }) {
  const router = useRouter();
  const { progress, isUnlocked } = useProgressStore();
  const { scaleAnim, onPressIn, onPressOut } = useBouncyPress(0.96);

  const unlocked = isUnlocked(mission.id);
  const p = progress[mission.id];

  const entranceAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 300,
        delay: index * 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: entranceAnim, transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] }}>
      <Pressable
        disabled={!unlocked}
        onPress={() => router.push(`/game?levelId=${mission.id}`)}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={styles.cardWrap}
      >
        <LinearGradient
          colors={unlocked ? [mission.color, mission.colorEnd] : ["#1e293b", "#334155"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.card}
        >
          <View style={[styles.accentBar, { backgroundColor: unlocked ? mission.color : "transparent" }]} />
          
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: unlocked ? "#ffffff22" : "#334155", borderColor: unlocked ? mission.color : "transparent", borderWidth: unlocked ? 2 : 0 },
            ]}
          >
            {unlocked ? (
              <Ionicons
                name={mission.icon as keyof typeof Ionicons.glyphMap}
                size={26}
                color="#ffffff"
              />
            ) : (
              <Ionicons name="lock-closed" size={22} color="#64748b" />
            )}
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.cardTop}>
              <Text style={styles.cardMission}>
                MISSION {String(mission.id).padStart(2, "0")}
              </Text>
              {p?.iqEarned ? (
                <View style={styles.iqChip}>
                  <Ionicons name="flash" size={9} color="#00f2ff" />
                  <Text style={styles.iqChipText}>+{p.iqEarned} IQ</Text>
                </View>
              ) : (
                <View style={styles.cardSize}>
                  <Ionicons name="grid" size={10} color="#ffffffcc" />
                  <Text style={styles.cardSizeText}>
                    {mission.size}×{mission.size}
                  </Text>
                </View>
              )}
            </View>
            <Text style={styles.cardTitle}>{mission.name}</Text>
            <Text style={styles.cardMeta}>
              {mission.wordCards.length} words · {mission.theme}
            </Text>
            <View style={styles.cardFooter}>
              <StarsRow count={p?.stars ?? 0} size={16} />
              {p?.wordsMastered ? (
                <Text style={styles.masteredText}>{p.wordsMastered} mastered</Text>
              ) : null}
            </View>
          </View>

          <View
            style={[
              styles.chevronCircle,
              { backgroundColor: unlocked ? "#ffffff" : "#1e293b" },
            ]}
          >
            <Ionicons
              name={unlocked ? "play" : "lock-closed"}
              size={16}
              color={unlocked ? mission.color : "#64748b"}
            />
          </View>
        </LinearGradient>
        {!unlocked && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#00000055', borderRadius: 18 }]} />}
      </Pressable>
    </Animated.View>
  );
}

function ChapterHeader({ chapter }: { chapter: Chapter }) {
  const [color] = CHAPTER_COLORS[chapter.chapterNum] ?? ["#6366f1", "#818cf8"];
  return (
    <View style={styles.chapterHeader}>
      <View style={[styles.chapterIconBadge, { backgroundColor: color + "22", borderColor: color + "44" }]}>
        <Ionicons
          name={chapter.chapterIcon as keyof typeof Ionicons.glyphMap}
          size={20}
          color={color}
        />
      </View>
      <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: color + "44", paddingBottom: 12, marginBottom: -8, }}>
        <Text style={[styles.chapterNum, { color }]}>
          CHAPTER {chapter.chapterNum}
        </Text>
        <Text style={styles.chapterName}>{chapter.chapterName}</Text>
      </View>
    </View>
  );
}

export default function LevelsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { progress, totalStars, totalIQ } = useProgressStore();
  const { scaleAnim, onPressIn, onPressOut } = useBouncyPress(0.96);

  const chapters = useMemo(() => groupByChapter(MISSIONS), []);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const totalDone = Object.values(progress).filter((p) => p?.completed).length;
  const totalMastered = Object.values(progress).reduce(
    (s, p) => s + (p?.wordsMastered ?? 0),
    0
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid]}
        style={[styles.header, { paddingTop: topPad + 12 }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Pressable
            onPress={() => router.back()}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            style={[styles.backBtn, { backgroundColor: "#1e293b", borderColor: "#334155" }]}
            hitSlop={8}
          >
            <Ionicons name="chevron-back" size={22} color="#e2e8f0" />
          </Pressable>
        </Animated.View>

        <View style={styles.headerCenter}>
          <Text style={styles.title}>Mission Map</Text>
          <View style={styles.glowChapterCount}>
            <Text style={styles.subtitle}>
              {MISSIONS.length} missions · 10 chapters
            </Text>
          </View>
        </View>

        <View style={styles.iqBadge}>
          <Ionicons name="flash" size={13} color="#00f2ff" />
          <Text style={styles.iqText}>{totalIQ} IQ</Text>
        </View>
      </LinearGradient>

      <View style={[styles.statsBar, { borderColor: "#334155", backgroundColor: colors.card }]}>
        <View style={styles.statsBarItem}>
          <Ionicons name="star" size={16} color="#fbbf24" />
          <Text style={styles.statsBarValue}>{totalStars}</Text>
          <Text style={styles.statsBarLabel}>Stars</Text>
        </View>
        <View style={[styles.statsBarDivider, { backgroundColor: "#334155" }]} />
        <View style={styles.statsBarItem}>
          <Ionicons name="trophy" size={16} color="#6366f1" />
          <Text style={styles.statsBarValue}>{totalDone}</Text>
          <Text style={styles.statsBarLabel}>Done</Text>
        </View>
        <View style={[styles.statsBarDivider, { backgroundColor: "#334155" }]} />
        <View style={styles.statsBarItem}>
          <Ionicons name="book" size={16} color="#10b981" />
          <Text style={styles.statsBarValue}>{totalMastered}</Text>
          <Text style={styles.statsBarLabel}>Mastered</Text>
        </View>
        <View style={[styles.statsBarDivider, { backgroundColor: "#334155" }]} />
        <View style={styles.statsBarItem}>
          <Ionicons name="layers" size={16} color="#06b6d4" />
          <Text style={styles.statsBarValue}>{MISSIONS.length}</Text>
          <Text style={styles.statsBarLabel}>Missions</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {chapters.map((chapter) => (
          <View key={chapter.chapterNum} style={styles.chapterSection}>
            <ChapterHeader chapter={chapter} />
            {chapter.missions.map((mission, index) => (
              <MissionCard key={mission.id} mission={mission} index={index} />
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 12,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  headerCenter: { flex: 1 },
  title: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 28,
    letterSpacing: -0.5,
    color: "#ffffff",
  },
  glowChapterCount: {
    marginTop: 2,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    fontSize: 13,
    color: "#00f2ff",
  },
  iqBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#1e293b",
    borderColor: "#334155",
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  iqText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 13,
    color: "#00f2ff",
  },
  statsBar: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingVertical: 16,
  },
  statsBarItem: {
    flex: 1,
    alignItems: "center",
    gap: 3,
  },
  statsBarDivider: {
    width: 1,
    height: 28,
  },
  statsBarValue: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 20,
    color: "#e2e8f0",
  },
  statsBarLabel: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    fontSize: 10,
    color: "#8892a4",
    letterSpacing: 0.5,
  },
  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 0,
  },
  chapterSection: {
    marginBottom: 24,
    gap: 12,
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  chapterIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  chapterNum: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  chapterName: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 18,
    color: "#e2e8f0",
    letterSpacing: -0.2,
    marginTop: 2,
  },
  cardWrap: {
    shadowColor: "#000000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    borderRadius: 18,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 18,
    gap: 16,
    overflow: "hidden",
    borderRadius: 18,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 4,
    height: '100%',
    borderRadius: 4,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cardMission: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 10,
    color: "#ffffffbb",
    letterSpacing: 1.5,
  },
  cardSize: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#ffffff22",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  cardSizeText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 10,
    color: "#ffffff",
  },
  iqChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#ffffff22",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
  iqChipText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 10,
    color: "#00f2ff",
  },
  cardTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 20,
    color: "#ffffff",
    letterSpacing: -0.3,
  },
  cardMeta: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    fontSize: 13,
    color: "#ffffffcc",
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  masteredText: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 11,
    color: "#00f2ff",
  },
  chevronCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
});
