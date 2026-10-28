import { ToneType } from './types';

let audioCtx: AudioContext | null = null;

export function playTone(tone: ToneType | string): void {
  if (tone === 'off' || !tone) return;
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const c = audioCtx;
    const S: Record<string, [number, number, number][]> = {
      chime: [[880, 0, 0.5], [1318.5, 0.16, 0.7]],
      bell: [[659.3, 0, 1.1], [1318.5, 0, 0.9]],
      pop: [[520, 0, 0.12], [780, 0.09, 0.16]],
      melody: [[523.3, 0, 0.3], [659.3, 0.2, 0.3], [784, 0.4, 0.3], [1046.5, 0.6, 0.6]],
      beep: [[1000, 0, 0.14], [1000, 0.22, 0.14], [1000, 0.44, 0.14]],
    };

    const notes = S[tone] || S.chime;
    const t0 = c.currentTime + 0.02;

    notes.forEach(([f, d, l]) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = tone === 'beep' ? 'square' : 'sine';
      o.frequency.value = f;
      g.gain.setValueAtTime(0, t0 + d);
      g.gain.linearRampToValueAtTime(tone === 'beep' ? 0.12 : 0.25, t0 + d + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + l);
      o.connect(g);
      g.connect(c.destination);
      o.start(t0 + d);
      o.stop(t0 + d + l + 0.05);
    });
  } catch {
    // ignore audio context restrictions
  }
}
