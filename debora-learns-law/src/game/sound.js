let ctx = null;
let muted = false;

export function setMuted(m) {
  muted = m;
}

function ac() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq, dur, type = "sine", gain = 0.08, when = 0) {
  const c = ac();
  if (!c || muted) return;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(gain, c.currentTime + when);
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + when + dur);
  o.connect(g).connect(c.destination);
  o.start(c.currentTime + when);
  o.stop(c.currentTime + when + dur + 0.02);
}

export const sfx = {
  correct() {
    tone(660, 0.12);
    tone(990, 0.16, "sine", 0.08, 0.08);
  },
  wrong() {
    tone(160, 0.28, "square", 0.06);
  },
  stamp() {
    tone(90, 0.08, "triangle", 0.12);
  },
  newCase() {
    tone(520, 0.07, "sine", 0.04);
  },
  streak() {
    tone(523, 0.1);
    tone(659, 0.1, "sine", 0.08, 0.09);
    tone(784, 0.18, "sine", 0.08, 0.18);
  },
  buy() {
    tone(880, 0.08);
    tone(1175, 0.12, "sine", 0.07, 0.07);
  },
  gameOver() {
    tone(330, 0.2, "sawtooth", 0.05);
    tone(220, 0.3, "sawtooth", 0.05, 0.18);
    tone(147, 0.5, "sawtooth", 0.05, 0.4);
  },
};
