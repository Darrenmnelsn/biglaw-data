import { useEffect, useMemo, useReducer, useRef } from "react";
import { QUESTION_POOL } from "./content.js";
import { sfx } from "./sound.js";

export const INBOX_CAP = 5;
const BASE_CASE_VALUE = 100;
const RUSH_BONUS = 50;
const RUSH_MS = 8000;
const THEME_BONUS = 1.25;
const MILESTONES = [5, 10, 25, 50];

export function multiplierFor(streak) {
  if (streak >= 10) return 3;
  if (streak >= 6) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

function spawnBaseMs(day) {
  return Math.max(4500, 9000 * Math.pow(0.92, day - 1));
}

function deadlineMs(day) {
  return Math.max(16000, 28000 - day * 500);
}

function difficultyFactor(recent) {
  if (recent.length < 5) return 1;
  const acc = recent.filter((r) => r.correct).length / recent.length;
  if (acc > 0.85) return 0.85; // player is cruising — turn up the heat
  if (acc < 0.6) return 1.25; // struggling — ease off to keep them in flow
  return 1;
}

let uidCounter = 0;

function reducer(state, action) {
  switch (action.type) {
    case "TICK": {
      const { now } = action;
      let next = { ...state, now };
      if (now >= state.endsAt) {
        return { ...next, status: "dayEnd" };
      }
      // expire overdue cases
      const expired = state.inbox.filter((c) => now >= c.deadlineAt);
      if (expired.length > 0) {
        next.inbox = state.inbox.filter((c) => now < c.deadlineAt);
        for (const c of expired) {
          next = pushExit(next, c, "angry");
          next = applyMistake(next, c, "expired");
          if (next.status === "gameOver") return next;
        }
        if (state.activeUid && expired.some((c) => c.uid === state.activeUid)) {
          next.activeUid = null;
        }
      }
      return next;
    }
    case "SPAWN": {
      const { question, now } = action;
      let next = { ...state, spawnCount: state.spawnCount + 1 };
      if (next.inbox.length >= INBOX_CAP) {
        const oldest = next.inbox[0];
        if (next.associateAvailable) {
          // senior associate quietly wins the oldest case
          next = pushExit(
            {
              ...next,
              associateAvailable: false,
              inbox: next.inbox.slice(1),
              casesWon: next.casesWon + 1,
              billables: next.billables + BASE_CASE_VALUE,
              results: [...next.results, "🤝"],
              toast: { kind: "associate", at: now },
            },
            oldest,
            "happy"
          );
        } else {
          next.inbox = next.inbox.slice(1);
          next = pushExit(next, oldest, "angry");
          next = applyMistake(next, oldest, "overflow");
          if (next.status === "gameOver") return next;
        }
        if (state.activeUid === oldest.uid) next.activeUid = null;
      }
      const item = {
        uid: ++uidCounter,
        q: question,
        arrivedAt: now,
        deadlineAt: now + deadlineMs(state.day),
        openedAt: null,
        eliminated: [],
      };
      return { ...next, inbox: [...next.inbox, item] };
    }
    case "SET_NEXT_SPAWN":
      return { ...state, nextSpawnAt: action.at };
    case "OPEN_CASE": {
      const inbox = state.inbox.map((c) =>
        c.uid === action.uid && c.openedAt === null ? { ...c, openedAt: action.now } : c
      );
      return { ...state, inbox, activeUid: action.uid };
    }
    case "CLOSE_CASE":
      return { ...state, activeUid: null };
    case "RESEARCH": {
      if (state.researchLeft <= 0 || state.activeUid == null) return state;
      const inbox = state.inbox.map((c) => {
        if (c.uid !== state.activeUid || c.eliminated.length > 0) return c;
        const wrong = c.q.options.map((_, i) => i).filter((i) => i !== c.q.answer);
        const pick = [];
        while (pick.length < 2 && wrong.length > 0) {
          pick.push(wrong.splice(Math.floor(Math.random() * wrong.length), 1)[0]);
        }
        return { ...c, eliminated: pick };
      });
      const changed = inbox.some((c, i) => c !== state.inbox[i]);
      return changed ? { ...state, inbox, researchLeft: state.researchLeft - 1 } : state;
    }
    case "ANSWER": {
      const { idx, now } = action;
      const item = state.inbox.find((c) => c.uid === state.activeUid);
      if (!item) return state;
      const inbox = state.inbox.filter((c) => c.uid !== item.uid);
      const ms = now - (item.openedAt ?? item.arrivedAt);
      const correct = idx === item.q.answer;
      const recent = [...state.recent, { correct, ms }].slice(-8);

      if (correct) {
        const streak = state.streak + 1;
        const mult = multiplierFor(streak);
        const themed = item.q.subject === state.theme;
        const gain = Math.round(
          (BASE_CASE_VALUE + (ms <= RUSH_MS ? RUSH_BONUS : 0)) * mult * (themed ? THEME_BONUS : 1)
        );
        return pushExit(
          {
            ...state,
            inbox,
            activeUid: null,
            recent,
            streak,
            bestStreak: Math.max(state.bestStreak, streak),
            billables: state.billables + gain,
            casesWon: state.casesWon + 1,
            results: [...state.results, "✅"],
            feedback: { kind: "won", gain, mult, themed, rush: ms <= RUSH_MS, at: now },
            confettiAt: MILESTONES.includes(streak) ? now : state.confettiAt,
            lastAnswered: { id: item.q.id, correct: true },
          },
          item,
          "happy"
        );
      }

      let next = {
        ...state,
        inbox,
        activeUid: null,
        recent,
        lastAnswered: { id: item.q.id, correct: false },
      };
      next = pushExit(next, item, "angry");
      next = applyMistake(next, item, "wrong");
      return next;
    }
    case "PAUSE":
      if (state.status !== "playing") return state;
      return { ...state, status: "paused", pausedAt: action.now };
    case "RESUME": {
      if (state.status !== "paused") return state;
      const delta = action.now - state.pausedAt;
      return {
        ...state,
        status: "playing",
        pausedAt: null,
        now: action.now,
        endsAt: state.endsAt + delta,
        nextSpawnAt: state.nextSpawnAt + delta,
        inbox: state.inbox.map((c) => ({ ...c, deadlineAt: c.deadlineAt + delta })),
      };
    }
    case "END_EARLY":
      return { ...state, status: "dayEnd" };
    case "CLEAR_FEEDBACK":
      return state.feedback ? { ...state, feedback: null } : state;
    case "CLEAR_TOAST":
      return state.toast ? { ...state, toast: null } : state;
    case "CLEAR_EXITS": {
      const cutoff = action.before;
      const exits = state.exits.filter((e) => e.leftAt > cutoff);
      return exits.length === state.exits.length ? state : { ...state, exits };
    }
    default:
      return state;
  }
}

function pushExit(state, item, mood) {
  return {
    ...state,
    exits: [
      ...state.exits,
      { uid: item.uid, q: item.q, mood, leftAt: Date.now() },
    ],
  };
}

function applyMistake(state, item, reason) {
  const base = {
    ...state,
    casesLost: state.casesLost + 1,
    streak: 0,
    results: [...state.results, reason === "wrong" ? "❌" : "⌛"],
  };
  if (state.paralegalAvailable) {
    return {
      ...base,
      paralegalAvailable: false,
      feedback: { kind: "saved", rule: item.q.rule, reason, at: Date.now() },
    };
  }
  const hearts = state.hearts - 1;
  return {
    ...base,
    hearts,
    status: hearts <= 0 ? "gameOver" : state.status,
    feedback: { kind: "lost", rule: item.q.rule, reason, at: Date.now() },
  };
}

function initState({ day, upgrades, theme }) {
  const now = Date.now();
  const dayLength = 120000 + (upgrades.espresso || 0) * 15000;
  return {
    status: "playing",
    day,
    theme,
    now,
    endsAt: now + dayLength,
    dayLength,
    nextSpawnAt: now + 1200,
    spawnCount: 0,
    inbox: [],
    exits: [],
    activeUid: null,
    hearts: 3 + (upgrades.cornerOffice || 0),
    maxHearts: 3 + (upgrades.cornerOffice || 0),
    streak: 0,
    bestStreak: 0,
    billables: 0,
    casesWon: 0,
    casesLost: 0,
    results: [],
    recent: [],
    researchLeft: (upgrades.westlaw || 0) * 2,
    paralegalAvailable: (upgrades.paralegal || 0) > 0,
    associateAvailable: (upgrades.associate || 0) > 0,
    feedback: null,
    toast: null,
    confettiAt: 0,
    pausedAt: null,
    lastAnswered: null,
  };
}

function makePicker({ weakSpots, theme, dailySeed }) {
  const usedIds = new Set();
  const requeue = [];
  let spawnsSeen = 0;

  function weightOf(q) {
    let w = 1;
    const misses = weakSpots[q.id] || 0;
    if (misses > 0) w += Math.min(misses, 3) * 2; // weak spots resurface
    if (q.subject === theme) w *= 2; // weekly theme week
    return w;
  }

  function prepare(q) {
    if (!q.shuffleOptions) return q;
    const order = q.options.map((_, i) => i).sort(() => Math.random() - 0.5);
    return {
      ...q,
      options: order.map((i) => q.options[i]),
      answer: order.indexOf(q.answer),
    };
  }

  return {
    requeueMiss(q) {
      requeue.push({ q, after: spawnsSeen + 4 });
    },
    pick() {
      spawnsSeen += 1;
      const due = requeue.findIndex((r) => spawnsSeen >= r.after);
      if (due !== -1) {
        const [r] = requeue.splice(due, 1);
        return prepare(r.q);
      }
      let pool = QUESTION_POOL.filter((q) => !usedIds.has(q.id));
      if (pool.length === 0) {
        usedIds.clear();
        pool = QUESTION_POOL;
      }
      const total = pool.reduce((s, q) => s + weightOf(q), 0);
      let roll = Math.random() * total;
      for (const q of pool) {
        roll -= weightOf(q);
        if (roll <= 0) {
          usedIds.add(q.id);
          return prepare(q);
        }
      }
      const fallback = pool[pool.length - 1];
      usedIds.add(fallback.id);
      return prepare(fallback);
    },
  };
}

export function useGameDay({ day, upgrades, theme, weakSpots, onMiss, onHit }) {
  const [state, dispatch] = useReducer(reducer, { day, upgrades, theme }, initState);
  const picker = useMemo(
    () => makePicker({ weakSpots, theme }),
    // a fresh picker per day; weakSpots snapshot at day start is intentional
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [day]
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  // game clock
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current;
      if (s.status !== "playing") return;
      const now = Date.now();
      dispatch({ type: "TICK", now });
      if (now >= s.nextSpawnAt && s.status === "playing") {
        const q = picker.pick();
        dispatch({ type: "SPAWN", question: q, now });
        sfx.newCase();
        const factor = difficultyFactor(s.recent);
        const jitter = 0.9 + Math.random() * 0.2;
        dispatch({ type: "SET_NEXT_SPAWN", at: now + spawnBaseMs(s.day) * factor * jitter });
      }
    }, 200);
    return () => clearInterval(id);
  }, [picker]);

  // pause when the tab is hidden so the day clock is fair
  useEffect(() => {
    const onVis = () => {
      const now = Date.now();
      if (document.hidden) dispatch({ type: "PAUSE", now });
      else dispatch({ type: "RESUME", now });
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  // sound + SRS side effects on answers
  const lastHandled = useRef(null);
  useEffect(() => {
    const la = state.lastAnswered;
    if (!la || la === lastHandled.current) return;
    lastHandled.current = la;
    if (la.correct) {
      sfx.correct();
      if (MILESTONES.includes(state.streak)) sfx.streak();
      onHit?.(la.id);
    } else {
      sfx.wrong();
      onMiss?.(la.id);
      const original = QUESTION_POOL.find((q) => q.id === la.id);
      if (original) picker.requeueMiss(original);
    }
  }, [state.lastAnswered, state.streak, onHit, onMiss, picker]);

  useEffect(() => {
    if (state.status === "gameOver") sfx.gameOver();
  }, [state.status]);

  const actions = useMemo(
    () => ({
      openCase: (uid) => dispatch({ type: "OPEN_CASE", uid, now: Date.now() }),
      closeCase: () => dispatch({ type: "CLOSE_CASE" }),
      answer: (idx) => {
        sfx.stamp();
        dispatch({ type: "ANSWER", idx, now: Date.now() });
      },
      research: () => dispatch({ type: "RESEARCH" }),
      endEarly: () => dispatch({ type: "END_EARLY" }),
      clearFeedback: () => dispatch({ type: "CLEAR_FEEDBACK" }),
      clearToast: () => dispatch({ type: "CLEAR_TOAST" }),
      sweepExits: (before) => dispatch({ type: "CLEAR_EXITS", before }),
    }),
    []
  );

  return [state, actions];
}
