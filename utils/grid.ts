export type Cell = { row: number; col: number };
export type PlacedWord = {
  word: string;
  cells: Cell[];
};
export type GeneratedGrid = {
  letters: string[][];
  size: number;
  words: PlacedWord[];
};

const DIRS: Array<[number, number]> = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function randInt(n: number) {
  return Math.floor(Math.random() * n);
}

function tryPlace(
  grid: (string | null)[][],
  word: string,
  size: number,
): Cell[] | null {
  const dirs = [...DIRS].sort(() => Math.random() - 0.5);
  const starts: Cell[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) starts.push({ row: r, col: c });
  }
  starts.sort(() => Math.random() - 0.5);

  for (const start of starts) {
    for (const [dr, dc] of dirs) {
      const cells: Cell[] = [];
      let ok = true;
      for (let i = 0; i < word.length; i++) {
        const r = start.row + dr * i;
        const c = start.col + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size) {
          ok = false;
          break;
        }
        const existing = grid[r][c];
        if (existing !== null && existing !== word[i]) {
          ok = false;
          break;
        }
        cells.push({ row: r, col: c });
      }
      if (ok) return cells;
    }
  }
  return null;
}

export function generateGrid(words: string[], size: number): GeneratedGrid {
  const upper = words.map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""));
  const sorted = [...upper].sort((a, b) => b.length - a.length);

  for (let attempt = 0; attempt < 25; attempt++) {
    const grid: (string | null)[][] = Array.from({ length: size }, () =>
      Array<string | null>(size).fill(null),
    );
    const placed: PlacedWord[] = [];
    let success = true;
    for (const word of sorted) {
      const cells = tryPlace(grid, word, size);
      if (!cells) {
        success = false;
        break;
      }
      cells.forEach((cell, i) => {
        grid[cell.row][cell.col] = word[i];
      });
      placed.push({ word, cells });
    }
    if (success) {
      const letters: string[][] = grid.map((row) =>
        row.map((c) => c ?? ALPHABET[randInt(26)]),
      );
      return { letters, size, words: placed };
    }
  }

  // Fallback: place words horizontally truncated grid
  const grid: string[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ALPHABET[randInt(26)]),
  );
  const placed: PlacedWord[] = [];
  for (const word of sorted) {
    const r = randInt(size);
    if (word.length > size) continue;
    const cStart = randInt(size - word.length + 1);
    const cells: Cell[] = [];
    for (let i = 0; i < word.length; i++) {
      grid[r][cStart + i] = word[i];
      cells.push({ row: r, col: cStart + i });
    }
    placed.push({ word, cells });
  }
  return { letters: grid, size, words: placed };
}

export function cellsBetween(start: Cell, end: Cell): Cell[] | null {
  const dr = end.row - start.row;
  const dc = end.col - start.col;
  if (dr === 0 && dc === 0) return [start];
  const isStraight = dr === 0 || dc === 0 || Math.abs(dr) === Math.abs(dc);
  if (!isStraight) return null;
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  const stepR = dr === 0 ? 0 : dr / Math.abs(dr);
  const stepC = dc === 0 ? 0 : dc / Math.abs(dc);
  const cells: Cell[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({ row: start.row + stepR * i, col: start.col + stepC * i });
  }
  return cells;
}

export function cellsToWord(cells: Cell[], letters: string[][]): string {
  return cells.map((c) => letters[c.row][c.col]).join("");
}

export function sameCells(a: Cell[], b: Cell[]): boolean {
  if (a.length !== b.length) return false;
  const eq = a.every((c, i) => c.row === b[i].row && c.col === b[i].col);
  if (eq) return true;
  const reversed = [...b].reverse();
  return a.every((c, i) => c.row === reversed[i].row && c.col === reversed[i].col);
}
