import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as Linking from "expo-linking";
import React, { useEffect, useRef, useMemo } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useProgressStore } from "@/src/store/useProgressStore";
import { useBouncyPress } from "@/src/hooks/useBouncyPress";
import { BrainSVG } from "@/src/assets/vectors/BrainSVG";
import { useColors } from "@/hooks/useColors";
import { MISSIONS } from "@/utils/missions";

function StarField() {
  const stars = useMemo(() => Array.from({ length: 15 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    anim: new Animated.Value(Math.random()),
    delay: Math.random() * 2000,
  })), []);

  useEffect(() => {
    const animations = stars.map(star => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(star.anim, { toValue: 0, duration: 2000, useNativeDriver: true }),
          Animated.timing(star.anim, { toValue: 0.6, duration: 2000, useNativeDriver: true })
        ])
      );
    });
    
    // Start them with staggers
    stars.forEach((star, i) => {
      setTimeout(() => animations[i].start(), star.delay);
    });
    
    return () => animations.forEach(a => a.stop());
  }, [stars]);

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      {stars.map((star, i) => (
        <Animated.View
          key={i}
          style={{
            position: 'absolute',
            top: star.top,
            left: star.left,
            width: 3,
            height: 3,
            borderRadius: 1.5,
            backgroundColor: '#ffffff',
            opacity: star.anim
          }}
        />
      ))}
    </View>
  );
}

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { totalStars, totalIQ, resetProgress, progress } = useProgressStore();
  const playBtn = useBouncyPress(0.94);
  const mapBtn = useBouncyPress(0.96);

  const completedCount = Object.values(progress).filter(
    (p) => p?.completed
  ).length;
  const maxStars = MISSIONS.length * 3;

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;
  const bottomPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const nextMission = MISSIONS.find((m) => !progress[m.id]?.completed) ?? MISSIONS[0];

  const ringScale = useRef(new Animated.Value(1)).current;
  const btnGlowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringScale, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
        Animated.timing(ringScale, { toValue: 1, duration: 1500, useNativeDriver: true })
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(btnGlowOpacity, { toValue: 0.8, duration: 2000, useNativeDriver: true }),
        Animated.timing(btnGlowOpacity, { toValue: 0.3, duration: 2000, useNativeDriver: true })
      ])
    ).start();
  }, []);

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1.2 }}
    >
      <StarField />
      <View
        style={[
          styles.inner,
          { paddingTop: topPad + 24, paddingBottom: bottomPad + 24 },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.logoWrapper}>
            <Animated.View style={[styles.logoRing, { transform: [{ scale: ringScale }] }]} />
            <View style={styles.logoCircle}>
              <BrainSVG size={72} color="#5b5cf6" />
            </View>
          </View>
          <Text style={styles.title}>Mind Grow</Text>
          <Text style={styles.subtitle}>
            Daily word missions · Train your brain
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statPill, { borderColor: "#fbbf2466", backgroundColor: "#fbbf2411" }]}>
            <Ionicons name="star" size={16} color="#fbbf24" />
            <Text style={styles.statPillText}>
              {totalStars}
              <Text style={styles.statPillTextMuted}> / {maxStars}</Text>
            </Text>
          </View>
          <View style={[styles.statPill, { borderColor: "#00f2ff44", backgroundColor: "#00f2ff0e" }]}>
            <Ionicons name="flash" size={16} color="#00f2ff" />
            <Text style={styles.statPillText}>
              {totalIQ}
              <Text style={styles.statPillTextMuted}> IQ pts</Text>
            </Text>
          </View>
          <View style={[styles.statPill, { borderColor: "#10b98144", backgroundColor: "#10b98111" }]}>
            <Ionicons name="trophy" size={16} color="#10b981" />
            <Text style={styles.statPillText}>
              {completedCount}
              <Text style={styles.statPillTextMuted}>
                {" "}
                / {MISSIONS.length}
              </Text>
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Animated.View
            style={[
              styles.playButtonWrap,
              { transform: [{ scale: playBtn.scaleAnim }] }
            ]}
          >
            <Animated.View style={[styles.playButtonGlow, { opacity: btnGlowOpacity, shadowColor: nextMission.color || "#6366f1" }]} />
            <Pressable
              onPress={() => router.push("/levels")}
              onPressIn={playBtn.onPressIn}
              onPressOut={playBtn.onPressOut}
            >
              <LinearGradient
                colors={[nextMission.color || "#6366f1", "#4338ca", "#3730a3"]}
                style={[styles.playButton, { borderRadius: colors.radius }]}
              >
                <View style={styles.playIconWrap}>
                  <Ionicons name="play" size={26} color={nextMission.color || "#6366f1"} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.playLabel}>
                    {completedCount === 0 ? "START MISSION" : "CONTINUE MISSION"}
                  </Text>
                  <Text style={styles.playSub}>
                    Mission {nextMission.id} · {nextMission.name}
                  </Text>
                </View>
                <Ionicons name="arrow-forward" size={24} color="#ffffff88" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.View
            style={[{ width: "100%" }, { transform: [{ scale: mapBtn.scaleAnim }] }]}
          >
            <Pressable
              onPress={() => router.push("/levels")}
              onPressIn={mapBtn.onPressIn}
              onPressOut={mapBtn.onPressOut}
              style={[styles.outlineButton, { borderRadius: colors.radius }]}
            >
              <Ionicons name="map" size={20} color="#ffffff" />
              <Text style={styles.outlineText}>Mission Map</Text>
            </Pressable>
          </Animated.View>

          {completedCount > 0 ? (
            <Pressable
              onPress={resetProgress}
              style={({ pressed }) => [
                styles.ghostButton,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Ionicons name="refresh" size={14} color="#ffffff66" />
              <Text style={styles.ghostText}>Reset progress</Text>
            </Pressable>
          ) : null}

          {Platform.OS === "web" ? (
            <Pressable
              onPress={() => {
                const a = document.createElement("a");
                a.href = "/mind-grow.zip";
                a.download = "mind-grow.zip";
                a.click();
              }}
              style={({ pressed }) => [
                styles.downloadButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Ionicons name="cloud-download-outline" size={14} color="#5b5cf6" />
              <Text style={styles.downloadText}>Download source code</Text>
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={[styles.bubble1, { pointerEvents: 'none' }]} />
      <View style={[styles.bubble2, { pointerEvents: 'none' }]} />
      <View style={[styles.bubble3, { pointerEvents: 'none' }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: { alignItems: "center", marginTop: 16 },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 150,
    marginBottom: 22,
  },
  logoRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: '#6366f155',
  },
  logoCircle: {
    width: 130,
    height: 130,
    borderRadius: 32,
    backgroundColor: "#1e1b4b",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#5b5cf6",
    shadowColor: "#6366f1",
    shadowOpacity: 0.5,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  title: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 52,
    color: "#ffffff",
    letterSpacing: -1.5,
    textShadowColor: "#6366f1",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 24,
  },
  subtitle: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    fontSize: 16,
    color: "#8892a4",
    marginTop: 8,
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statPillText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 13,
    color: "#e2e8f0",
  },
  statPillTextMuted: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    color: "#8892a4",
  },
  actions: { gap: 12, alignItems: "center" },
  playButtonWrap: {
    width: "100%",
  },
  playButtonGlow: {
    ...StyleSheet.absoluteFillObject,
    shadowOpacity: 1,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 24,
    gap: 16,
    width: "100%",
  },
  playIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  playLabel: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    fontSize: 14,
    color: "#ffffff",
    letterSpacing: 1.5,
  },
  playSub: {
    fontFamily: "Inter_600SemiBold",
    fontWeight: "600",
    fontSize: 13,
    color: "#cbd5e1",
    marginTop: 4,
  },
  outlineButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 0,
    backgroundColor: "#0f1a2e",
    width: "100%",
  },
  outlineText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 15,
    color: "#e2e8f0",
    letterSpacing: 0.5,
  },
  ghostButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
  },
  ghostText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    color: "#8892a4",
    fontSize: 13,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#5b5cf622",
    backgroundColor: "#5b5cf608",
  },
  downloadText: {
    fontFamily: "Inter_500Medium",
    fontWeight: "500",
    color: "#5b5cf6",
    fontSize: 12,
  },
  bubble1: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#6366f110",
  },
  bubble2: {
    position: "absolute",
    bottom: 80,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "#818cf810",
  },
  bubble3: {
    position: "absolute",
    top: "40%",
    right: -80,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#a5f3fc08",
  },
});
