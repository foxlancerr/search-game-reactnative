import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  Platform,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Line, Circle, Defs, RadialGradient, Stop, LinearGradient } from "react-native-svg";

import { useColors } from "@/hooks/useColors";
import {
  cellsBetween,
  cellsToWord,
  type Cell,
  type GeneratedGrid,
} from "@/utils/grid";

const NEON = "#00F2FF";
const NEON_DIM = "#00B8CC";

type FoundWord = { cells: Cell[]; color: string };

type Props = {
  grid: GeneratedGrid;
  cellColors: Record<string, string>;
  foundWords?: FoundWord[];
  hintCells?: Cell[];
  levelColor: string;
  onSubmit: (word: string, cells: Cell[]) => void;
};

// ─── tiny hook: pop animation on found ────────────────────────────────────────
function usePopAnim() {
  const anim = useRef(new Animated.Value(1)).current;
  const pop = () => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 1.08, duration: 90,  useNativeDriver: true }),
      Animated.spring(anim,  { toValue: 1,    friction: 4,   useNativeDriver: true }),
    ]).start();
  };
  return { anim, pop };
}

// ─── Cell component ────────────────────────────────────────────────────────────
const GridCell = React.memo(function GridCell({
  letter,
  cellSize,
  isSelected,
  isFound,
  isHint,
  foundColor,
  selectionProgress, // 0..1 — how far into the selection is this cell?
}: {
  letter: string;
  cellSize: number;
  isSelected: boolean;
  isFound: boolean;
  isHint: boolean;
  foundColor?: string;
  selectionProgress: number;
}) {
  const scaleAnim  = useRef(new Animated.Value(1)).current;
  const glowAnim   = useRef(new Animated.Value(0)).current;
  const prevSel    = useRef(false);
  const prevFound  = useRef(false);

  // Scale pop when cell enters selection
  useEffect(() => {
    if (isSelected && !prevSel.current) {
      Animated.sequence([
        Animated.timing(scaleAnim, { toValue: 1.18, duration: 80,  useNativeDriver: true }),
        Animated.spring(scaleAnim,  { toValue: 1,    friction: 4,   tension: 180, useNativeDriver: true }),
      ]).start();
    }
    prevSel.current = isSelected;
  }, [isSelected]);

  // Glow pulse when word found
  useEffect(() => {
    if (isFound && !prevFound.current) {
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]).start();
    }
    prevFound.current = isFound;
  }, [isFound]);

  const active = isSelected || isFound || isHint;
  const fontSize = Math.max(16, cellSize * 0.46);
  const pad = cellSize * 0.08;

  return (
    <Animated.View
      style={[
        styles.cellWrap,
        { width: cellSize, height: cellSize, padding: pad },
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      {/* Base tile */}
      <View
        style={[
          styles.cellBase,
          {
            backgroundColor: active ? "transparent" : "rgba(15, 23, 42, 0.9)",
            borderColor: isSelected
              ? "rgba(0,242,255,0.5)"
              : isFound
              ? (foundColor ?? "#ffffff") + "55"
              : "rgba(255,255,255,0.06)",
            borderWidth: isSelected ? 1.5 : 1,
          },
        ]}
      >
        {/* Inner bevel highlight (only on inactive cells) */}
        {!active && <View style={styles.bevel} />}

        {/* Glow flash on found */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            styles.glowFlash,
            {
              backgroundColor: foundColor ?? NEON,
              opacity: glowAnim,
              borderRadius: 9,
            },
          ]}
        />

        {/* Letter */}
        <Text
          style={[
            styles.letter,
            {
              fontSize,
              color: active ? "#ffffff" : "rgba(180, 200, 225, 0.85)",
              // subtle shadow on active for depth
              textShadowColor: isSelected ? NEON : isFound ? (foundColor ?? "#fff") : "transparent",
              textShadowOffset: { width: 0, height: 0 },
              textShadowRadius: isSelected ? 8 : 4,
            },
          ]}
        >
          {letter}
        </Text>
      </View>
    </Animated.View>
  );
});

// ─── Main WordGrid ─────────────────────────────────────────────────────────────
export function WordGrid({
  grid,
  cellColors,
  foundWords = [],
  hintCells = [],
  levelColor,
  onSubmit,
}: Props) {
  const colors = useColors();
  const [layoutWidth, setLayoutWidth] = useState(0);
  const widthRef = useRef(0);

  const [start, setStart]     = useState<Cell | null>(null);
  const [current, setCurrent] = useState<Cell | null>(null);
  const stateRef = useRef<{ start: Cell | null; current: Cell | null }>({
    start: null,
    current: null,
  });

  // Shimmer animation on the selection line
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(shimmerAnim, { toValue: 1, duration: 1200, useNativeDriver: false })
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const cellSize = layoutWidth > 0 ? layoutWidth / grid.size  : 0;

  const cellAtLocal = (x: number, y: number): Cell | null => {
    const w = widthRef.current;
    if (w <= 0) return null;
    const cs = w / grid.size;
    const col = Math.floor(x / cs);
    const row = Math.floor(y / cs);
    if (row < 0 || row >= grid.size || col < 0 || col >= grid.size) return null;
    return { row, col };
  };

  const updateStart = (c: Cell | null) => { stateRef.current.start = c;   setStart(c);   };
  const updateCurrent = (c: Cell | null) => { stateRef.current.current = c; setCurrent(c); };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .maxPointers(1)
        .runOnJS(true)
        .onBegin((e) => {
          const cell = cellAtLocal(e.x, e.y);
          if (cell) { updateStart(cell); updateCurrent(cell); }
        })
        .onUpdate((e) => {
          const cell = cellAtLocal(e.x, e.y);
          if (cell) updateCurrent(cell);
        })
        .onEnd(() => {
          const { start: s, current: cu } = stateRef.current;
          if (s && cu) {
            const cells = cellsBetween(s, cu);
            if (cells && cells.length > 1) {
              onSubmit(cellsToWord(cells, grid.letters), cells);
            }
          }
          updateStart(null);
          updateCurrent(null);
        })
        .onFinalize(() => {
          if (stateRef.current.start) { updateStart(null); updateCurrent(null); }
        }),
    [grid, onSubmit]
  );

  const selection = useMemo<Cell[]>(() => {
    if (!start || !current) return [];
    return cellsBetween(start, current) ?? [start];
  }, [start, current]);

  const selSet = useMemo(
    () => new Set(selection.map((s) => `${s.row},${s.col}`)),
    [selection]
  );

  const isHintCell = (r: number, c: number) =>
    hintCells.some((h) => h.row === r && h.col === c);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setLayoutWidth(w);
  };

  // SVG center helpers
  const cx = (col: number) => col * cellSize + cellSize / 2;
  const cy = (row: number) => row * cellSize + cellSize / 2;

  // Pill stroke = ~72% of cell, feels snug without clipping corners
  const strokeW = Math.max(cellSize * 0.72, 15);

  const isSelecting   = start !== null;
  const isSingleCell  = start && current && start.row === current.row && start.col === current.col;
  const wordLen       = selection.length;

  return (
    <View
      style={[
        styles.outerContainer,
        { borderRadius: (colors.radius ?? 12) + 8 },
      ]}
    >
      {/* Outer glow ring when selecting */}
      {isSelecting && (
        <View
          style={[
            StyleSheet.absoluteFill,
            styles.selectingGlowRing,
            { borderColor: NEON + "40", borderRadius: (colors.radius ?? 12) + 8 },
          ]}
        />
      )}

      <GestureDetector gesture={pan}>
        <View
          onLayout={onLayout}
          collapsable={false}
          style={styles.gridInner}
        >
          {/* ── SVG LAYER (paths behind letters) ── */}
          {cellSize > 0 && (
            <View style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}>
              <Svg width={layoutWidth} height={layoutWidth}>
                <Defs>
                  {/* Neon gradient for active selection line */}
                  <LinearGradient id="selGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%"   stopColor={NEON}     stopOpacity="0.55" />
                    <Stop offset="50%"  stopColor="#ffffff"  stopOpacity="0.75" />
                    <Stop offset="100%" stopColor={NEON}     stopOpacity="0.55" />
                  </LinearGradient>
                  {/* Soft radial for single-cell dot */}
                  <RadialGradient id="dotGrad" cx="50%" cy="50%" r="50%">
                    <Stop offset="0%"   stopColor="#ffffff"  stopOpacity="0.9" />
                    <Stop offset="100%" stopColor={NEON}     stopOpacity="0.4" />
                  </RadialGradient>
                </Defs>

                {/* ── Found word paths ── */}
                {foundWords.map((fw, i) => {
                  if (!fw.cells?.length) return null;
                  const first = fw.cells[0];
                  const last  = fw.cells[fw.cells.length - 1];
                  if (fw.cells.length === 1) {
                    return (
                      <Circle
                        key={`found-${i}`}
                        cx={cx(first.col)} cy={cy(first.row)}
                        r={strokeW / 2}
                        fill={fw.color} fillOpacity={0.82}
                      />
                    );
                  }
                  return (
                    <React.Fragment key={`found-${i}`}>
                      {/* Shadow line for depth */}
                      <Line
                        x1={cx(first.col)} y1={cy(first.row) + 2}
                        x2={cx(last.col)}  y2={cy(last.row)  + 2}
                        stroke="#000000" strokeOpacity={0.35}
                        strokeWidth={strokeW + 4} strokeLinecap="round"
                      />
                      {/* Main colored pill */}
                      <Line
                        x1={cx(first.col)} y1={cy(first.row)}
                        x2={cx(last.col)}  y2={cy(last.row)}
                        stroke={fw.color} strokeOpacity={0.88}
                        strokeWidth={strokeW} strokeLinecap="round"
                      />
                      {/* Inner bright highlight — gives 3D pill feel */}
                      <Line
                        x1={cx(first.col)} y1={cy(first.row) - strokeW * 0.22}
                        x2={cx(last.col)}  y2={cy(last.row)  - strokeW * 0.22}
                        stroke="#ffffff" strokeOpacity={0.18}
                        strokeWidth={strokeW * 0.35} strokeLinecap="round"
                      />
                    </React.Fragment>
                  );
                })}

                {/* ── Hint cells ── */}
                {hintCells.map((h, i) => (
                  <Circle
                    key={`hint-${i}`}
                    cx={cx(h.col)} cy={cy(h.row)}
                    r={strokeW / 2}
                    fill={colors.accent} fillOpacity={0.65}
                  />
                ))}

                {/* ── Active selection: dimmed background overlay on cells ── */}
                {isSelecting && start && current && !isSingleCell && (
                  <>
                    {/* Thick dimmed backdrop — makes the background recede */}
                    <Line
                      x1={cx(start.col)} y1={cy(start.row)}
                      x2={cx(current.col)} y2={cy(current.row)}
                      stroke="#000000" strokeOpacity={0.28}
                      strokeWidth={strokeW + 8} strokeLinecap="round"
                    />
                    {/* Main neon pill */}
                    <Line
                      x1={cx(start.col)} y1={cy(start.row)}
                      x2={cx(current.col)} y2={cy(current.row)}
                      stroke="url(#selGrad)"
                      strokeOpacity={1}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                    />
                    {/* Top specular highlight — glassy 3D feel */}
                    <Line
                      x1={cx(start.col)} y1={cy(start.row) - strokeW * 0.22}
                      x2={cx(current.col)} y2={cy(current.row) - strokeW * 0.22}
                      stroke="#ffffff" strokeOpacity={0.3}
                      strokeWidth={strokeW * 0.3} strokeLinecap="round"
                    />
                    {/* End-cap dots — "connected" visual anchors */}
                    <Circle
                      cx={cx(start.col)} cy={cy(start.row)}
                      r={strokeW / 2 + 2}
                      stroke={NEON} strokeOpacity={0.6}
                      strokeWidth={2} fill="none"
                    />
                    <Circle
                      cx={cx(current.col)} cy={cy(current.row)}
                      r={strokeW / 2 + 2}
                      stroke={NEON} strokeOpacity={0.9}
                      strokeWidth={2.5} fill="none"
                    />
                    {/* Bright dot at current fingertip */}
                    <Circle
                      cx={cx(current.col)} cy={cy(current.row)}
                      r={strokeW * 0.28}
                      fill="#ffffff" fillOpacity={0.55}
                    />
                  </>
                )}

                {/* ── Single cell selection ── */}
                {isSelecting && isSingleCell && start && (
                  <>
                    <Circle
                      cx={cx(start.col)} cy={cy(start.row)}
                      r={strokeW / 2}
                      fill="url(#dotGrad)" fillOpacity={0.85}
                    />
                    <Circle
                      cx={cx(start.col)} cy={cy(start.row)}
                      r={strokeW / 2 + 3}
                      stroke={NEON} strokeOpacity={0.5}
                      strokeWidth={2} fill="none"
                    />
                  </>
                )}
              </Svg>
            </View>
          )}

          {/* ── LETTER CELLS ── */}
          {cellSize > 0 &&
            grid.letters.map((row, r) => (
              <View key={r} style={styles.row}>
                {row.map((letter, c) => {
                  const key      = `${r},${c}`;
                  const isSel    = selSet.has(key);
                  const isFound  = !!cellColors[key];
                  const hint     = isHintCell(r, c);

                  // Compute how far this selected cell is along the selection (0..1)
                  const selIdx   = isSel
                    ? selection.findIndex((s) => s.row === r && s.col === c)
                    : -1;
                  const selProg  = selIdx >= 0 ? selIdx / Math.max(wordLen - 1, 1) : 0;

                  return (
                    <GridCell
                      key={key}
                      letter={letter}
                      cellSize={cellSize}
                      isSelected={isSel}
                      isFound={isFound}
                      isHint={hint}
                      foundColor={cellColors[key]}
                      selectionProgress={selProg}
                    />
                  );
                })}
              </View>
            ))}

          {/* ── WORD LENGTH COUNTER (appears while selecting) ── */}
          {isSelecting && wordLen > 1 && (
            <View style={styles.wordCounterWrap} pointerEvents="none">
              <View style={[styles.wordCounter, { borderColor: NEON + "88" }]}>
                <Text style={styles.wordCounterText}>{wordLen} letters</Text>
              </View>
            </View>
          )}
        </View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    aspectRatio: 1,
    padding: 8,
    backgroundColor: "#07101f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.6,
        shadowRadius: 20,
      },
      android: { elevation: 14 },
      web: {
        boxShadow:
          "inset 0 0 30px rgba(0,0,0,0.9), 0 12px 28px rgba(0,0,0,0.6)",
      } as any,
    }),
  },

  selectingGlowRing: {
    position: "absolute",
    top: -3, left: -3, right: -3, bottom: -3,
    borderWidth: 2.5,
    zIndex: 10,
  },

  gridInner: {
    flex: 1,
    backgroundColor: "rgba(6, 10, 22, 0.97)",
    borderRadius: 12,
    overflow: "hidden",
  },

  row: {
    flexDirection: "row",
    flex: 1,
  },

  cellWrap: {
    // padding set dynamically
  },

  cellBase: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    overflow: "hidden",
  },

  bevel: {
    position: "absolute",
    top: 0, left: 0, right: 0,
    height: "45%",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
  },

  glowFlash: {
    position: "absolute",
  },

  letter: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
    letterSpacing: 0.5,
  },

  // Word length counter pill
  wordCounterWrap: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  wordCounter: {
    backgroundColor: "rgba(0,0,0,0.75)",
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  wordCounterText: {
    fontFamily: "Inter_700Bold",
    fontWeight: "700",
    fontSize: 12,
    color: NEON,
    letterSpacing: 1,
  },
});