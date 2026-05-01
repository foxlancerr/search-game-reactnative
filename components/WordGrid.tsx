import React, { useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  Platform,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Svg, { Line, Circle } from "react-native-svg";

import { useColors } from "@/hooks/useColors";
import {
  cellsBetween,
  cellsToWord,
  type Cell,
  type GeneratedGrid,
} from "@/utils/grid";

const NEON = "#00F2FF";

type FoundWord = { cells: Cell[]; color: string };

type Props = {
  grid: GeneratedGrid;
  cellColors: Record<string, string>;
  foundWords?: FoundWord[];
  hintCells?: Cell[];
  levelColor: string;
  onSubmit: (word: string, cells: Cell[]) => void;
};

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
  const [start, setStart] = useState<Cell | null>(null);
  const [current, setCurrent] = useState<Cell | null>(null);
  const stateRef = useRef<{ start: Cell | null; current: Cell | null }>({
    start: null,
    current: null,
  });

  const cellSize = layoutWidth > 0 ? layoutWidth / grid.size : 0;

  const cellAtLocal = (x: number, y: number): Cell | null => {
    const w = widthRef.current;
    if (w <= 0) return null;
    const cs = w / grid.size;
    const col = Math.floor(x / cs);
    const row = Math.floor(y / cs);
    if (row < 0 || row >= grid.size || col < 0 || col >= grid.size) return null;
    return { row, col };
  };

  const updateStart = (c: Cell | null) => {
    stateRef.current.start = c;
    setStart(c);
  };
  const updateCurrent = (c: Cell | null) => {
    stateRef.current.current = c;
    setCurrent(c);
  };

  const pan = useMemo(
    () =>
      Gesture.Pan()
        .minDistance(0)
        .maxPointers(1)
        .runOnJS(true)
        .onBegin((e) => {
          const cell = cellAtLocal(e.x, e.y);
          if (cell) {
            updateStart(cell);
            updateCurrent(cell);
          }
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
              const word = cellsToWord(cells, grid.letters);
              onSubmit(word, cells);
            }
          }
          updateStart(null);
          updateCurrent(null);
        })
        .onFinalize(() => {
          if (stateRef.current.start) {
            updateStart(null);
            updateCurrent(null);
          }
        }),
    [grid, onSubmit],
  );

  const selection = useMemo<Cell[]>(() => {
    if (!start || !current) return [];
    return cellsBetween(start, current) ?? [start];
  }, [start, current]);

  const selSet = useMemo(
    () => new Set(selection.map((s) => `${s.row},${s.col}`)),
    [selection],
  );

  const isHint = (r: number, c: number) =>
    hintCells.some((s) => s.row === r && s.col === c);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    widthRef.current = w;
    setLayoutWidth(w);
  };

  // SVG coordinate helpers: center of a cell
  const cx = (col: number) => col * cellSize + cellSize / 2;
  const cy = (row: number) => row * cellSize + cellSize / 2;

  // Stroke width covers most of the cell, creating a pill shape
  const strokeW = Math.max(cellSize * 0.75, 18);

  const isSelecting = start !== null;
  const isSingleCell =
    start && current && start.row === current.row && start.col === current.col;

  return (
    <View
      style={[
        styles.outerContainer,
        {
          backgroundColor: "#0B1021",
          borderRadius: colors.radius + 8,
        },
      ]}
    >
      <View style={styles.innerShadowWrapper}>
        <GestureDetector gesture={pan}>
          <View
            onLayout={onLayout}
            collapsable={false}
            style={styles.gridInner}
          >
            {/* SVG PATH LAYER — rendered first, sits behind letters */}
            {cellSize > 0 && (
              <View
                style={[StyleSheet.absoluteFill, { pointerEvents: "none" }]}
              >
                <Svg width={layoutWidth} height={layoutWidth}>
                  {/* Found word paths */}
                  {foundWords.map((fw, i) => {
                    if (!fw.cells || fw.cells.length < 1) return null;
                    const first = fw.cells[0];
                    const last = fw.cells[fw.cells.length - 1];
                    if (fw.cells.length === 1) {
                      return (
                        <Circle
                          key={`found-${i}`}
                          cx={cx(first.col)}
                          cy={cy(first.row)}
                          r={strokeW / 2}
                          fill={fw.color}
                          fillOpacity={0.85}
                        />
                      );
                    }
                    return (
                      <Line
                        key={`found-${i}`}
                        x1={cx(first.col)}
                        y1={cy(first.row)}
                        x2={cx(last.col)}
                        y2={cy(last.row)}
                        stroke={fw.color}
                        strokeOpacity={0.88}
                        strokeWidth={strokeW}
                        strokeLinecap="round"
                      />
                    );
                  })}

                  {/* Hint cells glow */}
                  {hintCells.map((h, i) => (
                    <Circle
                      key={`hint-${i}`}
                      cx={cx(h.col)}
                      cy={cy(h.row)}
                      r={strokeW / 2}
                      fill={colors.accent}
                      fillOpacity={0.7}
                    />
                  ))}

                  {/* Active selection — cyan neon pill */}
                  {isSelecting && start && current && !isSingleCell && (
                    <Line
                      x1={cx(start.col)}
                      y1={cy(start.row)}
                      x2={cx(current.col)}
                      y2={cy(current.row)}
                      stroke={NEON}
                      strokeOpacity={0.5}
                      strokeWidth={strokeW}
                      strokeLinecap="round"
                    />
                  )}
                  {/* Single-cell selection dot */}
                  {isSelecting && isSingleCell && start && (
                    <Circle
                      cx={cx(start.col)}
                      cy={cy(start.row)}
                      r={strokeW / 2}
                      fill={NEON}
                      fillOpacity={0.5}
                    />
                  )}
                </Svg>
              </View>
            )}

            {/* LETTER CELLS — rendered on top of SVG paths */}
            {cellSize > 0 &&
              grid.letters.map((row, r) => (
                <View key={r} style={styles.row}>
                  {row.map((letter, c) => {
                    const key = `${r},${c}`;
                    const sel = selSet.has(key);
                    const hint = isHint(r, c);
                    const isFound = !!cellColors[key];

                    // When a cell is covered by a path, make it transparent
                    // so the SVG pill color shows through behind the letter
                    const cellBg =
                      isFound || sel || hint
                        ? "transparent"
                        : "rgba(20, 30, 50, 0.75)";

                    // Letter color: bright white on path, muted on default
                    let fg = "rgba(190,205,225,0.9)";
                    if (isFound || sel || hint) fg = "#ffffff";

                    return (
                      <View
                        key={key}
                        style={[
                          styles.cellWrap,
                          {
                            width: cellSize,
                            height: cellSize,
                            pointerEvents: "none",
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.cell3D,
                            { backgroundColor: cellBg },
                          ]}
                        >
                          {/* Top highlight — subtle 3D bevel */}
                          {!isFound && !sel && !hint && (
                            <View style={styles.cellHighlight} />
                          )}
                          <Text
                            style={[
                              styles.letter,
                              {
                                color: fg,
                                fontSize: Math.max(18, cellSize * 0.52),
                              },
                            ]}
                          >
                            {letter}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ))}
          </View>
        </GestureDetector>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    width: "100%",
    aspectRatio: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
      web: {
        boxShadow:
          "inset 0 0 20px rgba(0,0,0,0.8), 0 10px 20px rgba(0,0,0,0.5)",
      } as any,
    }),
  },
  innerShadowWrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(6,11,24,0.95)",
  },
  gridInner: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    flex: 1,
  },
  cellWrap: {
    padding: 2,
  },
  cell3D: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  cellHighlight: {
    ...StyleSheet.absoluteFillObject,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    borderRadius: 8,
  },
  letter: {
    fontFamily: "Inter_800ExtraBold",
    fontWeight: "800",
  },
});
