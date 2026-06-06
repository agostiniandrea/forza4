"use client";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function playTone(
  frequency: number,
  duration: number,
  type: OscillatorType = "sine",
  gain = 0.3,
  delay = 0
): void {
  const c = getCtx();
  const osc = c.createOscillator();
  const gainNode = c.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, c.currentTime + delay);

  gainNode.gain.setValueAtTime(0, c.currentTime + delay);
  gainNode.gain.linearRampToValueAtTime(gain, c.currentTime + delay + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);

  osc.connect(gainNode);
  gainNode.connect(c.destination);

  osc.start(c.currentTime + delay);
  osc.stop(c.currentTime + delay + duration + 0.05);
}

function playNoise(duration: number, gain = 0.1, delay = 0): void {
  const c = getCtx();
  const bufferSize = c.sampleRate * duration;
  const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const source = c.createBufferSource();
  source.buffer = buffer;

  const gainNode = c.createGain();
  gainNode.gain.setValueAtTime(gain, c.currentTime + delay);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + delay + duration);

  const filter = c.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 200;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(c.destination);

  source.start(c.currentTime + delay);
  source.stop(c.currentTime + delay + duration);
}

export function playDrop(player: 1 | 2): void {
  // Distinct tones: player 1 = lower, player 2 = higher
  const freq = player === 1 ? 220 : 330;
  playNoise(0.04, 0.15);
  playTone(freq, 0.15, "triangle", 0.3, 0.02);
  playTone(freq * 1.5, 0.08, "sine", 0.1, 0.02);
}

export function playHover(): void {
  playTone(660, 0.04, "sine", 0.05);
}

export function playWin(): void {
  // Rising arpeggio — victory fanfare
  const notes = [261.63, 329.63, 392, 523.25, 659.25, 783.99];
  notes.forEach((freq, i) => {
    playTone(freq, 0.25, "triangle", 0.35, i * 0.1);
    playTone(freq * 2, 0.15, "sine", 0.1, i * 0.1);
  });
}

export function playDraw(): void {
  // Wry descending chord
  const notes = [523.25, 466.16, 415.3, 369.99];
  notes.forEach((freq, i) => {
    playTone(freq, 0.35, "triangle", 0.25, i * 0.12);
  });
}

export function playReset(): void {
  // Swoosh
  const c = getCtx();
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(800, c.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, c.currentTime + 0.2);
  gainNode.gain.setValueAtTime(0.2, c.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2);
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.start(c.currentTime);
  osc.stop(c.currentTime + 0.25);
}
