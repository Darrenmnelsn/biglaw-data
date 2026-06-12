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
  home: { tier: 0, furniture: {} }, // tier 0..4, furniture: { id: true }
};

export const HOME_TIERS = [
  { name: "Cramped Studio", cost: 0, desc: "Welcome to BigLaw. The fridge hums." },
  { name: "Studio Loft", cost: 2000, desc: "Brick walls, proper window, the cat moves in." },
  { name: "One Bedroom", cost: 6000, desc: "A real bedroom door. Luxury." },
  { name: "Townhouse", cost: 15000, desc: "Two floors. A staircase you can dramatically descend." },
  { name: "Penthouse", cost: 40000, desc: "City view. Floor-to-ceiling. The bar exam paid off." },
];

export const FURNITURE = [
  { id: "rug", name: "Persian Rug", icon: "🟫", cost: 400, tier: 0 },
  { id: "couch", name: "Leather Couch", icon: "🛋️", cost: 800, tier: 0 },
  { id: "lamp", name: "Floor Lamp", icon: "💡", cost: 350, tier: 0 },
  { id: "plant", name: "Monstera", icon: "🪴", cost: 200, tier: 0 },
  { id: "art", name: "Abstract Art", icon: "🖼️", cost: 600, tier: 1 },
  { id: "tv", name: "OLED TV", icon: "📺", cost: 1500, tier: 1 },
  { id: "bookshelf", name: "Bookshelf", icon: "📚", cost: 1000, tier: 1 },
  { id: "cat", name: "Office Cat", icon: "🐈", cost: 1200, tier: 1 },
  { id: "fireplace", name: "Fireplace", icon: "🔥", cost: 2500, tier: 2 },
  { id: "piano", name: "Baby Grand", icon: "🎹", cost: 5000, tier: 2 },
  { id: "gym", name: "Home Gym", icon: "🏋️", cost: 3000, tier: 2 },
  { id: "chandelier", name: "Chandelier", icon: "💎", cost: 4000, tier: 3 },
  { id: "hottub", name: "Hot Tub", icon: "🛁", cost: 8000, tier: 3 },
  { id: "skyline", name: "Skyline View", icon: "🌃", cost: 12000, tier: 4 },
];

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
