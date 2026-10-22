// Synthesizes short ambient placeholder loops into public/audio/ so the player
// has something real to play until the artist's masters arrive.
// Run: node scripts/build-placeholder-audio.mjs
import { mkdirSync, writeFileSync } from "node:fs";

const RATE = 22050;
const SECONDS = 24;

const midi = (n) => 440 * 2 ** ((n - 69) / 12);

// Each track: tempo, chord progression (MIDI notes), and a pulse note pattern.
const TRACKS = {
  "summer-days": { bpm: 92, chords: [[57, 64, 69, 72], [53, 60, 65, 69], [55, 62, 67, 71], [52, 59, 64, 67]], pulse: [76, 79, 81, 79] },
  suburbia: { bpm: 78, chords: [[50, 57, 62, 65], [46, 53, 58, 62], [48, 55, 60, 64], [45, 52, 57, 60]], pulse: [69, 72, 74, 72] },
  sor: { bpm: 110, chords: [[52, 59, 64, 67], [48, 55, 60, 64], [50, 57, 62, 66], [47, 54, 59, 62]], pulse: [71, 74, 76, 79] },
  ananke: { bpm: 70, chords: [[49, 56, 61, 64], [45, 52, 57, 61], [47, 54, 59, 63], [44, 51, 56, 59]], pulse: [68, 71, 73, 71] },
};

function render({ bpm, chords, pulse }) {
  const n = RATE * SECONDS;
  const out = new Float32Array(n);
  const beat = 60 / bpm;
  const bar = beat * 4;

  for (let i = 0; i < n; i++) {
    const t = i / RATE;
    const ci = Math.floor(t / bar) % chords.length;
    const inBar = t % bar;
    // Pad: detuned sines with a slow swell per bar.
    const swell = Math.min(1, inBar / 0.8) * (1 - 0.25 * (inBar / bar));
    let pad = 0;
    for (const note of chords[ci]) {
      const f = midi(note);
      pad += Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 1.003 * t);
    }
    pad *= 0.045 * swell;

    // Pulse: soft plucked note on every beat.
    const bi = Math.floor(t / beat);
    const sinceBeat = t - bi * beat;
    const pf = midi(pulse[bi % pulse.length]);
    const pluck = Math.sin(2 * Math.PI * pf * t) * Math.exp(-sinceBeat * 5) * 0.12;

    // Tape hiss for texture.
    const hiss = (Math.random() * 2 - 1) * 0.006;

    out[i] = pad + pluck + hiss;
  }

  // Fade in/out so the loop ends cleanly.
  const fade = RATE * 1.5;
  for (let i = 0; i < fade; i++) {
    out[i] *= i / fade;
    out[n - 1 - i] *= i / fade;
  }
  return out;
}

function wav(samples) {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0);
  buf.writeUInt32LE(36 + samples.length * 2, 4);
  buf.write("WAVEfmt ", 8);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(RATE, 24);
  buf.writeUInt32LE(RATE * 2, 28);
  buf.writeUInt16LE(2, 32);
  buf.writeUInt16LE(16, 34);
  buf.write("data", 36);
  buf.writeUInt32LE(samples.length * 2, 40);
  samples.forEach((s, i) => buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, s)) * 32767), 44 + i * 2));
  return buf;
}

const dir = new URL("../public/audio/", import.meta.url);
mkdirSync(dir, { recursive: true });
for (const [slug, spec] of Object.entries(TRACKS)) {
  writeFileSync(new URL(`${slug}.wav`, dir), wav(render(spec)));
  console.log(`public/audio/${slug}.wav`);
}
