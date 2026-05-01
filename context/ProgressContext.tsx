import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type LevelProgress = {
  stars: number;
  bestScore: number;
  bestTime: number;
  completed: boolean;
};

type ProgressState = Record<number, LevelProgress>;

type ProgressContextValue = {
  progress: ProgressState;
  totalStars: number;
  isLoaded: boolean;
  recordResult: (
    levelId: number,
    result: { stars: number; score: number; time: number },
  ) => Promise<void>;
  resetProgress: () => Promise<void>;
  isUnlocked: (levelId: number) => boolean;
};

const STORAGE_KEY = "@word-quest/progress/v1";

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setProgress(JSON.parse(raw));
      } catch {
        // ignore
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);

  const persist = useCallback(async (next: ProgressState) => {
    setProgress(next);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }, []);

  const recordResult = useCallback(
    async (
      levelId: number,
      result: { stars: number; score: number; time: number },
    ) => {
      const existing = progress[levelId];
      const merged: LevelProgress = {
        stars: Math.max(existing?.stars ?? 0, result.stars),
        bestScore: Math.max(existing?.bestScore ?? 0, result.score),
        bestTime:
          existing?.bestTime && existing.bestTime > 0
            ? Math.min(existing.bestTime, result.time)
            : result.time,
        completed: true,
      };
      const next = { ...progress, [levelId]: merged };
      await persist(next);
    },
    [progress, persist],
  );

  const resetProgress = useCallback(async () => {
    await persist({});
  }, [persist]);

  const isUnlocked = useCallback(
    (levelId: number) => {
      if (levelId === 1) return true;
      return !!progress[levelId - 1]?.completed;
    },
    [progress],
  );

  const totalStars = useMemo(
    () =>
      Object.values(progress).reduce(
        (sum: number, p) => sum + (p?.stars ?? 0),
        0,
      ),
    [progress],
  );

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      totalStars,
      isLoaded,
      recordResult,
      resetProgress,
      isUnlocked,
    }),
    [progress, totalStars, isLoaded, recordResult, resetProgress, isUnlocked],
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
