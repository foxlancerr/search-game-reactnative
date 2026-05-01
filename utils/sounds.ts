import { createAudioPlayer, type AudioPlayer } from "expo-audio";

type SoundName = "found" | "wrong" | "win" | "tap";

let players: Record<SoundName, AudioPlayer> | null = null;
let muted = false;

export function initSounds() {
  if (players) return;
  try {
    players = {
      found: createAudioPlayer(require("@/assets/sounds/found.mp3")),
      wrong: createAudioPlayer(require("@/assets/sounds/wrong.mp3")),
      win: createAudioPlayer(require("@/assets/sounds/win.mp3")),
      tap: createAudioPlayer(require("@/assets/sounds/tap.mp3")),
    };
    (Object.values(players) as AudioPlayer[]).forEach((p) => {
      p.volume = 0.6;
    });
  } catch {
    players = null;
  }
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted() {
  return muted;
}

export function playSound(name: SoundName) {
  if (muted || !players) return;
  try {
    const p = players[name];
    p.seekTo(0);
    p.play();
  } catch {
    // ignore
  }
}
