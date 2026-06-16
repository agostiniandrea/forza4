"use client";

import { useCallback, useState } from "react";
import * as SoundEngine from "@/lib/sound-engine";

export function useSound() {
  const [enabled, setEnabled] = useState(true);

  const toggle = useCallback(() => setEnabled((v) => !v), []);

  const playDrop = useCallback(
    (player: 1 | 2) => { if (enabled) SoundEngine.playDrop(player); },
    [enabled]
  );
  const playWin = useCallback(
    () => { if (enabled) SoundEngine.playWin(); },
    [enabled]
  );
  const playDraw = useCallback(
    () => { if (enabled) SoundEngine.playDraw(); },
    [enabled]
  );
  const playReset = useCallback(
    () => { if (enabled) SoundEngine.playReset(); },
    [enabled]
  );
  const playHover = useCallback(
    () => { if (enabled) SoundEngine.playHover(); },
    [enabled]
  );

  return { enabled, toggle, playDrop, playWin, playDraw, playReset, playHover };
}
