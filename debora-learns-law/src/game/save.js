const KEY = "dll-save-v1";

const DEFAULT_SAVE = {
  bank: 0, // billable hours banked (currency)
  upgrades: {}, // { paralegal: 1, espresso: 2, ... }
  weakSpots: {}, // { questionId: missCount }
  scores: [], // [{ score, day, streak, date }]
  daily: {}, // { "2026-06-12": { correct, total, ms } }
  muted: false,
  bestScore: 0,
  tutorialSeen: false,
};

export function loadSave() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    return { ...DEFAULT_SAVE, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SAVE };
  }
}

export function persistSave(save) {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    /* storage full or unavailable — play on without persistence */
  }
}

export const SHOP_ITEMS = [
  {
    id: "paralegal",
    name: "Hire a Paralegal",
    icon: "🗂️",
    desc: "Absorbs your first mistake each day — no heart lost.",
    costs: [400],
  },
  {
    id: "espresso",
    name: "Espresso Machine",
    icon: "☕",
    desc: "+15 seconds on the clock each day, per level.",
    costs: [300, 600],
  },
  {
    id: "westlaw",
    name: "Westlaw Subscription",
    icon: "🔎",
    desc: "2 Research uses per day: eliminate two wrong options.",
    costs: [500],
  },
  {
    id: "associate",
    name: "Senior Associate",
    icon: "🤝",
    desc: "Once per day, auto-wins the oldest case when your inbox overflows.",
    costs: [800],
  },
  {
    id: "cornerOffice",
    name: "Corner Office",
    icon: "🏢",
    desc: "+1 partner patience (an extra heart).",
    costs: [700],
  },
];

export function upgradeLevel(save, id) {
  return save.upgrades[id] || 0;
}

export function nextCost(save, id) {
  const item = SHOP_ITEMS.find((s) => s.id === id);
  const lvl = upgradeLevel(save, id);
  return lvl >= item.costs.length ? null : item.costs[lvl];
}

export function recordMiss(save, questionId) {
  const ws = { ...save.weakSpots };
  ws[questionId] = Math.min((ws[questionId] || 0) + 1, 5);
  return { ...save, weakSpots: ws };
}

export function recordHit(save, questionId) {
  if (!save.weakSpots[questionId]) return save;
  const ws = { ...save.weakSpots };
  ws[questionId] -= 1;
  if (ws[questionId] <= 0) delete ws[questionId];
  return { ...save, weakSpots: ws };
}

export function addScore(save, entry) {
  const scores = [...save.scores, entry].sort((a, b) => b.score - a.score).slice(0, 10);
  return {
    ...save,
    scores,
    bestScore: Math.max(save.bestScore, entry.score),
  };
}
