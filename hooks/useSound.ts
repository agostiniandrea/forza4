"use client";

import { useCallback, useState } from "react";
import * as SoundEngine from "@/lib/sound-engine";

export function useSound() {
  const [enabled, setEnabled] = useState(true);

  const play = useCallback(
    (fn: () => void) => {
      if (enabled) fn();
    },
    [enabled]
  );

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  return {
    enabled,
    toggle,
    playDrop: (player: 1 | 2) => play(() => SoundEngine.playDrop(player)),
    playWin: () => play(SoundEngine.playWin),
    playDraw: () => play(SoundEngine.playDraw),
    playReset: () => play(SoundEngine.playReset),
    playHover: () => play(SoundEngine.playHover),
  };
}
