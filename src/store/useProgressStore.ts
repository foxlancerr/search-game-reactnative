import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";

const STORAGE_KEY = "@mind-grow/progress/v2";

export type MissionProgress = {
  stars: number;
  bestScore: number;
  bestTime: number;
  completed: boolean;
  iqEarned: number;
  wordsFound: number;
  wordsMastered: number;
};

type ProgressState = Record<number, MissionProgress>;

type ProgressStore = {
  progress: ProgressState;
  totalStars: number;
  totalIQ: number;
  isLoaded: boolean;
  loadProgress: () => Promise<void>;
  recordResult: (
    missionId: number,
    result: {
      stars: number;
      score: number;
      time: number;
      wordsFound: number;
      wordsMastered: number;
    }
  ) => Promise<void>;
  resetProgress: () => Promise<void>;
  isUnlocked: (missionId: number) => boolean;
  getMission: (missionId: number) => MissionProgress | undefined;
};

function computeTotals(state: ProgressState) {
  const values = Object.values(state);
  return {
    totalStars: values.reduce((s, p) => s + (p?.stars ?? 0), 0),
    totalIQ: values.reduce((s, p) => s + (p?.iqEarned ?? 0), 0),
  };
}

export const useProgressStore = create<ProgressStore>((set, get) => ({
  progress: {},
  totalStars: 0,
  totalIQ: 0,
  isLoaded: false,

  loadProgress: async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: ProgressState = JSON.parse(raw);
        set({ progress: parsed, ...computeTotals(parsed), isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  recordResult: async (missionId, result) => {
    const { progress } = get();
    const existing = progress[missionId];
    const iqEarned = result.stars * 10 + result.wordsFound * 5;
    const merged: MissionProgress = {
      stars: Math.max(existing?.stars ?? 0, result.stars),
      bestScore: Math.max(existing?.bestScore ?? 0, result.score),
      bestTime:
        existing?.bestTime && existing.bestTime > 0
          ? Math.min(existing.bestTime, result.time)
          : result.time,
      completed: true,
      iqEarned: Math.max(existing?.iqEarned ?? 0, iqEarned),
      wordsFound: Math.max(existing?.wordsFound ?? 0, result.wordsFound),
      wordsMastered: Math.max(
        existing?.wordsMastered ?? 0,
        result.wordsMastered
      ),
    };
    const next = { ...progress, [missionId]: merged };
    set({ progress: next, ...computeTotals(next) });
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
    }
  },

  resetProgress: async () => {
    set({ progress: {}, totalStars: 0, totalIQ: 0 });
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch {
    }
  },

  isUnlocked: (missionId: number) => {
    if (missionId === 1) return true;
    return !!get().progress[missionId - 1]?.completed;
  },

  getMission: (missionId: number) => {
    return get().progress[missionId];
  },
}));
