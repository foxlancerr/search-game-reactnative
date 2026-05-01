export type Level = {
  id: number;
  name: string;
  theme: string;
  icon: string;
  hint: string;
  size: number;
  words: string[];
  targetTime: number;
  color: string;
  colorEnd: string;
};

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "Furry Friends",
    theme: "Animals",
    icon: "paw",
    hint: "Creatures big and small",
    size: 8,
    words: ["CAT", "DOG", "FISH", "BIRD", "LION"],
    targetTime: 90,
    color: "#f97316",
    colorEnd: "#fb923c",
  },
  {
    id: 2,
    name: "Rainbow",
    theme: "Colors",
    icon: "color-palette",
    hint: "Shades you see every day",
    size: 9,
    words: ["RED", "BLUE", "GREEN", "PINK", "BLACK", "WHITE"],
    targetTime: 120,
    color: "#ec4899",
    colorEnd: "#f472b6",
  },
  {
    id: 3,
    name: "Fruit Bowl",
    theme: "Fruits",
    icon: "nutrition",
    hint: "Sweet and juicy",
    size: 9,
    words: ["APPLE", "MANGO", "GRAPE", "PEACH", "LEMON", "MELON"],
    targetTime: 150,
    color: "#22c55e",
    colorEnd: "#4ade80",
  },
  {
    id: 4,
    name: "Cosmos",
    theme: "Space",
    icon: "planet",
    hint: "Far beyond the sky",
    size: 10,
    words: ["MOON", "STAR", "COMET", "PLANET", "GALAXY", "ROCKET"],
    targetTime: 180,
    color: "#6366f1",
    colorEnd: "#818cf8",
  },
  {
    id: 5,
    name: "Deep Sea",
    theme: "Ocean",
    icon: "water",
    hint: "Swimmers of the deep",
    size: 10,
    words: ["WHALE", "SHARK", "CORAL", "OCTOPUS", "DOLPHIN", "TURTLE"],
    targetTime: 210,
    color: "#06b6d4",
    colorEnd: "#22d3ee",
  },
  {
    id: 6,
    name: "Symphony",
    theme: "Music",
    icon: "musical-notes",
    hint: "Sounds that make you move",
    size: 11,
    words: ["PIANO", "GUITAR", "DRUMS", "VIOLIN", "TRUMPET", "BANJO"],
    targetTime: 240,
    color: "#a855f7",
    colorEnd: "#c084fc",
  },
  {
    id: 7,
    name: "Game Day",
    theme: "Sports",
    icon: "football",
    hint: "Get up and play",
    size: 11,
    words: ["SOCCER", "TENNIS", "HOCKEY", "BOXING", "GOLF", "RUGBY"],
    targetTime: 240,
    color: "#ef4444",
    colorEnd: "#f87171",
  },
  {
    id: 8,
    name: "Lab Coat",
    theme: "Science",
    icon: "flask",
    hint: "The building blocks of nature",
    size: 12,
    words: ["ATOM", "ENERGY", "PLANET", "GRAVITY", "NEUTRON", "PHOTON"],
    targetTime: 270,
    color: "#0ea5e9",
    colorEnd: "#38bdf8",
  },
];

export const FOUND_COLORS = [
  "#f97316",
  "#22c55e",
  "#3b82f6",
  "#ec4899",
  "#a855f7",
  "#06b6d4",
  "#eab308",
  "#ef4444",
];

export function colorForIndex(i: number): string {
  return FOUND_COLORS[i % FOUND_COLORS.length];
}
