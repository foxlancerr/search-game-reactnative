import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Confetti } from "@/components/Confetti";
import { KnowledgeCard } from "@/components/KnowledgeCard";
import { PraiseToast } from "@/components/PraiseToast";
import { StarsRow } from "@/components/StarsRow";
import { WordCardList } from "@/components/WordCardList";
import { WordGrid } from "@/components/WordGrid";
import { useProgressStore } from "@/src/store/useProgressStore";
import { useColors } from "@/hooks/useColors";
import {
  generateGrid,
  sameCells,
  type Cell,
  type GeneratedGrid,
} from "@/utils/grid";
import {
  MISSIONS,
  colorForIndex,
  missionWords,
  type WordCard,
} from "@/utils/missions";
import { isMuted, playSound, setMuted } from "@/utils/sounds";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function calcStars(timeUsed: number, hintsUsed: number, target: number) {
  if (timeUsed <= target && hintsUsed === 0) return 3;
  if (timeUsed <= target * 1.6 && hintsUsed <= 1) return 2;
  return 1;
}

type FoundEntry = { word: string; cells: Cell[]; color: string };

export default function GameScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { levelId } = useLocalSearchParams<{ levelId: string }>();
  const { recordResult } = useProgressStore();

  const mission = useMemo(
    () => MISSIONS.find((m) => m.id === Number(levelId)) ?? MISSIONS[0],
    [levelId],
  );

  const words = useMemo(() => missionWords(mission), [mission]);

  const [grid, setGrid] = useState<GeneratedGrid>(() =>
    generateGrid(words, mission.size),
  );
  const [found, setFound] = useState<FoundEntry[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintCells, setHintCells] = useState<Cell[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [done, setDone] = useState(false);
  const [muted, setMutedState] = useState(isMuted());
  const [feedback, setFeedback] = useState<{
    text: string;
    kind: "good" | "bad";
  } | null>(null);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [praise, setPraise] = useState<{
    id: number;
    text: string;
    emoji: string;
    color: string;
  } | null>(null);
  const [hintWord, setHintWord] = useState<string | null>(null);
  const [wordsMastered, setWordsMastered] = useState(0);

  // Knowledge Card modal state
  const [knowledgeCard, setKnowledgeCard] = useState<{
    visible: boolean;
    wordCard: WordCard | null;
    color: string;
    iqGained: number;
  }>({ visible: false, wordCard: null, color: "#6366f1", iqGained: 0 });

  const foundWordSet = useMemo(
    () => new Set(found.map((f) => f.word)),
    [found],
  );

  const cellColorMap = useMemo(() => {
    const map: Record<string, string> = {};
    found.forEach((f) => {
      f.cells.forEach((c) => {
        map[`${c.row},${c.col}`] = f.color;
      });
    });
    return map;
  }, [found]);

  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [done]);

  useEffect(() => {
    if (
      foundWordSet.size === words.length &&
      !done &&
      !knowledgeCard.wordCard
    ) {
      setDone(true);
      const stars = calcStars(seconds, hintsUsed, mission.targetTime);
      recordResult(mission.id, {
        stars,
        score,
        time: seconds,
        wordsFound: foundWordSet.size,
        wordsMastered,
      });
      playSound("win");
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, [
    foundWordSet,
    mission,
    done,
    seconds,
    hintsUsed,
    score,
    recordResult,
    wordsMastered,
    words.length,
  ]);

  const showFeedback = (text: string, kind: "good" | "bad") => {
    setFeedback({ text, kind });
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 1100);
  };

  const handleSubmit = (word: string, cells: Cell[]) => {
    const reversed = word.split("").reverse().join("");
    const target = grid.words.find(
      (w) =>
        (w.word === word || w.word === reversed) && sameCells(w.cells, cells),
    );
    if (target && !foundWordSet.has(target.word)) {
      const color = colorForIndex(found.length);
      const entry: FoundEntry = {
        word: target.word,
        cells: target.cells,
        color,
      };
      setFound((prev) => [...prev, entry]);
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = target.word.length * 10 * Math.max(1, newCombo);
      setScore((s) => s + points);
      showFeedback(`+${points}`, "good");

      // Show Knowledge Card for the found word
      const wc = mission.wordCards.find((c) => c.word === target.word);
      if (wc) {
        const iqGained = target.word.length * 5;
        setTimeout(() => {
          setKnowledgeCard({ visible: true, wordCard: wc, color, iqGained });
        }, 300);
      }

      const praises =
        newCombo >= 3
          ? [
              { text: "UNSTOPPABLE!", emoji: "🔥" },
              { text: "GENIUS!", emoji: "🧠" },
              { text: "ON FIRE!", emoji: "🔥" },
              { text: "LEGEND!", emoji: "👑" },
            ]
          : newCombo === 2
            ? [
                { text: "AMAZING!", emoji: "✨" },
                { text: "FANTASTIC!", emoji: "🌟" },
                { text: "BRILLIANT!", emoji: "💫" },
                { text: "AWESOME!", emoji: "🚀" },
              ]
            : [
                { text: "WOW!", emoji: "🎉" },
                { text: "GREAT!", emoji: "⭐" },
                { text: "NICE!", emoji: "👏" },
                { text: "SUPER!", emoji: "💪" },
                { text: "BRAVO!", emoji: "🎊" },
              ];
      const pick = praises[Math.floor(Math.random() * praises.length)];
      setPraise({ id: Date.now(), text: pick.text, emoji: pick.emoji, color });
      playSound("found");
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      setHintCells([]);
      setHintWord(null);
      setWordsMastered((n) => n + 1);
    } else {
      setCombo(0);
      if (word.length > 1) {
        showFeedback("Try again", "bad");
        playSound("wrong");
      }
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const useHint = () => {
    const remaining = grid.words.filter((w) => !foundWordSet.has(w.word));
    if (remaining.length === 0) return;
    const pick = remaining[0];
    setHintCells([pick.cells[0]]);
    setHintWord(pick.word);
    setHintsUsed((n) => n + 1);
    setCombo(0);
    playSound("tap");
    if (Platform.OS !== "web") {
      Haptics.selectionAsync();
    }
  };

  const restart = () => {
    setGrid(generateGrid(words, mission.size));
    setFound([]);
    setHintCells([]);
    setHintsUsed(0);
    setScore(0);
    setCombo(0);
    setSeconds(0);
    setDone(false);
    setWordsMastered(0);
  };

  const goNext = () => {
    const nextMission = MISSIONS.find((m) => m.id === mission.id + 1);
    if (nextMission) router.replace(`/game?levelId=${nextMission.id}`);
    else router.replace("/levels");
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    setMutedState(next);
  };

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const stars = done ? calcStars(seconds, hintsUsed, mission.targetTime) : 0;
  const remaining = words.length - foundWordSet.size;
  const progressPct = (foundWordSet.size / words.length) * 100;
  const hasNext = !!MISSIONS.find((m) => m.id === mission.id + 1);
  const iqEarned = stars * 10 + foundWordSet.size * 5;

  const comboScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (combo > 1) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(comboScaleAnim, {
            toValue: 1.15,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(comboScaleAnim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      comboScaleAnim.setValue(1);
    }
  }, [combo]);

  return (
    <LinearGradient
      colors={[colors.gameBgStart, colors.gameBgEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <View
        style={[styles.header, { paddingTop: topPad + 12, paddingBottom: 16 }]}
      >
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.iconBtn,
            {
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              opacity: pressed ? 0.7 : 1,
            },
          ]}
          hitSlop={8}
        >
          <Ionicons name="chevron-back" size={22} color="#e2e8f0" />
        </Pressable>

        <View style={styles.titleBlock}>
          <View style={[styles.themePill, { backgroundColor: mission.color }]}>
            <Ionicons
              name={mission.icon as keyof typeof Ionicons.glyphMap}
              size={11}
              color="#ffffff"
            />
            <Text style={styles.themePillText}>
              {mission.chapterName.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.levelName}>{mission.name}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={toggleMute}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: "#1e293b",
                borderColor: "#334155",
                opacity: pressed ? 0.7 : 1,
              },
            ]}
            hitSlop={8}
          >
            <Ionicons
              name={muted ? "volume-mute" : "volume-high"}
              size={20}
              color="#e2e8f0"
            />
          </Pressable>
          <Pressable
            onPress={useHint}
            disabled={done}
            style={({ pressed }) => [
              styles.iconBtn,
              {
                backgroundColor: "#fbbf24",
                borderColor: "#fbbf24",
                opacity: done ? 0.4 : pressed ? 0.7 : 1,
              },
            ]}
            hitSlop={8}
          >
            <Ionicons name="bulb" size={22} color="#0f172a" />
          </Pressable>
        </View>
      </View>

      <View style={styles.statBar}>
        <Stat
          label="Score"
          value={String(score)}
          icon="trophy"
          color="#fbbf24"
          bgTint="#fbbf2415"
        />
        <View style={styles.divider} />
        <Stat
          label="Time"
          value={formatTime(seconds)}
          icon="time"
          color="#a855f7"
          bgTint="#a855f715"
        />
        <View style={styles.divider} />
        <Animated.View
          style={[
            styles.statBoxWrap,
            { transform: [{ scale: comboScaleAnim }] },
          ]}
        >
          <Stat
            label="Combo"
            value={`×${Math.max(1, combo)}`}
            icon="flame"
            color={combo > 1 ? "#f97316" : "#64748b"}
            bgTint={combo > 1 ? "#f9731615" : "#64748b15"}
          />
        </Animated.View>
        <View style={styles.divider} />
        <Stat
          label="Left"
          value={String(remaining)}
          icon="list"
          color="#10b981"
          bgTint="#10b98115"
        />
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            { width: `${progressPct}%`, backgroundColor: mission.color },
          ]}
        >
          {progressPct > 0 && (
            <View
              style={[
                styles.progressGlowEdge,
                { backgroundColor: mission.color },
              ]}
            />
          )}
        </View>
      </View>

      <View style={styles.gridArea}>
        <WordGrid
          grid={grid}
          cellColors={cellColorMap}
          foundWords={found.map((f) => ({ cells: f.cells, color: f.color }))}
          hintCells={hintCells}
          levelColor={mission.color}
          onSubmit={handleSubmit}
        />
        {feedback ? (
          <View
            style={[
              styles.feedback,
              {
                backgroundColor:
                  feedback.kind === "good" ? "#10b981" : "#ef4444",
                pointerEvents: "none",
              },
            ]}
          >
            <Text style={styles.feedbackText}>{feedback.text}</Text>
          </View>
        ) : null}
      </View>

      <View style={[styles.wordsArea, { paddingBottom: bottomPad + 16 }]}>
        <View style={styles.findHeader}>
          <View style={styles.findHeaderLeft}>
            <Ionicons name="eye" size={15} color={mission.color} />
            <Text style={styles.findLabel}>Find the Words</Text>
          </View>
          <View
            style={[
              styles.findCount,
              {
                backgroundColor: mission.color + "22",
                borderColor: mission.color,
              },
            ]}
          >
            <Text style={[styles.findCountText, { color: mission.color }]}>
              {foundWordSet.size}/{words.length}
            </Text>
          </View>
        </View>
        <WordCardList
          words={words}
          found={found.map((f) => ({ word: f.word, color: f.color }))}
          hintWord={hintWord}
        />
      </View>

      <PraiseToast message={praise} />

      {/* Knowledge Card Modal */}
      {knowledgeCard.wordCard && (
        <KnowledgeCard
          visible={knowledgeCard.visible}
          word={knowledgeCard.wordCard.word}
          emoji={knowledgeCard.wordCard.emoji}
          card={knowledgeCard.wordCard.card}
          color={knowledgeCard.color}
          iqGained={knowledgeCard.iqGained}
          onClose={() => {
            setKnowledgeCard((prev) => ({ ...prev, visible: false }));
            if (foundWordSet.size === words.length) {
              setDone(true);
            }
          }}
        />
      )}

      <Modal visible={done} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <Confetti active={done} />
          <LinearGradient
            colors={[mission.color, mission.colorEnd]}
            style={styles.modalCard}
          >
            <View
              style={[
                styles.celebrateBadge,
                { backgroundColor: mission.colorEnd + "44" },
              ]}
            >
              <View style={styles.celebrateInner}>
                <Ionicons name="trophy" size={40} color={mission.color} />
              </View>
            </View>
            <Text style={styles.modalTitle}>Mission Complete!</Text>
            <Text style={styles.modalSub}>{mission.name}</Text>
            {combo > 2 && (
              <Text style={styles.comboSubText}>Max Combo: {combo}🔥</Text>
            )}

            <View style={styles.iqEarnedRow}>
              <Ionicons name="flash" size={18} color="#a5f3fc" />
              <Text style={styles.iqEarnedText}>+{iqEarned} IQ Points</Text>
            </View>

            <View style={{ marginVertical: 18 }}>
              <StarsRow count={stars} size={44} />
            </View>
            <View style={styles.modalStats}>
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>SCORE</Text>
                <Text style={styles.modalStatValue}>{score}</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>TIME</Text>
                <Text style={styles.modalStatValue}>{formatTime(seconds)}</Text>
              </View>
              <View style={styles.modalStatDivider} />
              <View style={styles.modalStat}>
                <Text style={styles.modalStatLabel}>MASTERED</Text>
                <Text style={styles.modalStatValue}>{wordsMastered}</Text>
              </View>
            </View>
            <View style={styles.modalActions}>
              <Pressable
                onPress={restart}
                style={({ pressed }) => [
                  styles.modalBtnSecondary,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Ionicons name="refresh" size={20} color="#ffffff" />
                <Text style={styles.modalBtnText}>Replay</Text>
              </Pressable>
              <Pressable
                onPress={hasNext ? goNext : () => router.replace("/levels")}
                style={({ pressed }) => [
                  styles.modalBtnPrimary,
                  { opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <LinearGradient
                  colors={[mission.color, mission.colorEnd]}
                  style={styles.modalBtnPrimaryGradient}
                >
                  <Text style={[styles.modalBtnText, { color: "#ffffff" }]}>
                    {hasNext ? "Next Mission" : "Finish"}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#ffffff" />
                </LinearGradient>
              </Pressable>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </LinearGradient>
  );
}

function Stat({
  label,
  value,
  icon,
  color,
  bgTint,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bgTint: string;
}) {
  return (
    <View style={styles.statBox}>
      <View style={[styles.statIconBg, { backgroundColor: bgTint }]}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  iconBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  titleBlock: { flex: 1, alignItems: "center", gap: 4 },
  themePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  themePillText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 9,
    color: "#ffffff",
    letterSpacing: 1,
  },
  levelName: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 18,
    color: "#ffffff",
  },
  statBar: {
    flexDirection: "row",
    marginHorizontal: 16,
    paddingVertical: 14,
    paddingHorizontal: 4,
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statBoxWrap: {
    flex: 1,
  },
  statBox: { flex: 1, alignItems: "center", gap: 3 },
  statIconBg: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statLabel: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 10,
    letterSpacing: 1,
    color: "#64748b",
  },
  statValue: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 17,
    color: "#e2e8f0",
  },
  divider: { width: 1, height: 32, backgroundColor: "#334155" },
  progressTrack: {
    height: 10,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 999,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  progressGlowEdge: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ffffff",
    shadowColor: "#ffffff",
    shadowOpacity: 1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  gridArea: {
    paddingHorizontal: 16,
    marginTop: 16,
    position: "relative",
  },
  wordsArea: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 8,
  },
  findHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  findHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  findLabel: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 15,
    color: "#e2e8f0",
  },
  findCount: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  findCountText: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  feedback: {
    position: "absolute",
    top: "45%",
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  feedbackText: {
    color: "#ffffff",
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "#000000dd",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    padding: 28,
    alignItems: "center",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  celebrateBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  celebrateInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 28,
    color: "#ffffff",
    letterSpacing: -0.5,
  },
  modalSub: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 15,
    color: "#ffffffcc",
    marginTop: 2,
  },
  comboSubText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 13,
    color: "#f59e0b",
    marginTop: 4,
  },
  iqEarnedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#ffffff22",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    marginTop: 12,
  },
  iqEarnedText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#a5f3fc",
  },
  modalStats: {
    flexDirection: "row",
    backgroundColor: "#ffffff22",
    borderRadius: 14,
    paddingVertical: 16,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
  },
  modalStat: { flex: 1, alignItems: "center", gap: 2 },
  modalStatDivider: { width: 1, height: 36, backgroundColor: "#ffffff33" },
  modalStatLabel: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 10,
    color: "#ffffffaa",
    letterSpacing: 1,
  },
  modalStatValue: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 22,
    color: "#ffffff",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  modalBtnSecondary: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: "#ffffff22",
  },
  modalBtnPrimary: {
    flex: 1.5,
    borderRadius: 14,
    overflow: "hidden",
  },
  modalBtnPrimaryGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  modalBtnText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 16,
  },
});
