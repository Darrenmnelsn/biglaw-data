import { useCallback, useEffect, useMemo, useState } from "react";
import Home from "./components/Home.jsx";
import GameDay from "./components/GameDay.jsx";
import DayEnd from "./components/DayEnd.jsx";
import GameOver from "./components/GameOver.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import DailyCase from "./components/DailyCase.jsx";
import Commute from "./components/Commute.jsx";
import Apartment from "./components/Apartment.jsx";
import { weeklyTheme } from "./game/content.js";
import { loadSave, persistSave, recordHit, recordMiss, addScore } from "./game/save.js";
import { setMuted } from "./game/sound.js";

export default function App() {
  const [save, setSave] = useState(loadSave);
  const [screen, setScreen] = useState("home"); // home | game | dayEnd | gameOver | leaderboard | daily
  const [run, setRun] = useState(null); // { day, total, bestStreak, results, lastDay }
  const theme = useMemo(() => weeklyTheme(), []);

  useEffect(() => persistSave(save), [save]);
  useEffect(() => setMuted(save.muted), [save.muted]);

  const updateSave = useCallback((fn) => setSave((s) => fn(s)), []);

  const startRun = useCallback(() => {
    setRun({ day: 1, total: 0, bestStreak: 0, results: [] });
    setScreen("game");
  }, []);

  const onDayEnd = useCallback(
    (dayStats) => {
      setRun((r) => ({
        ...r,
        total: r.total + dayStats.billables,
        bestStreak: Math.max(r.bestStreak, dayStats.bestStreak),
        results: [...r.results, ...dayStats.results],
        lastDay: dayStats,
      }));
      updateSave((s) => ({ ...s, bank: s.bank + dayStats.billables }));
      setScreen("dayEnd");
    },
    [updateSave]
  );

  const onGameOver = useCallback(
    (dayStats) => {
      setRun((r) => {
        const finished = {
          ...r,
          total: r.total + dayStats.billables,
          bestStreak: Math.max(r.bestStreak, dayStats.bestStreak),
          results: [...r.results, ...dayStats.results],
          lastDay: dayStats,
        };
        updateSave((s) =>
          addScore(
            { ...s, bank: s.bank + dayStats.billables },
            {
              score: finished.total,
              day: finished.day,
              streak: finished.bestStreak,
              date: new Date().toISOString().slice(0, 10),
            }
          )
        );
        return finished;
      });
      setScreen("gameOver");
    },
    [updateSave]
  );

  const nextDay = useCallback(() => {
    setRun((r) => ({ ...r, day: r.day + 1 }));
    setScreen("game");
  }, []);

  const onMiss = useCallback((qid) => updateSave((s) => recordMiss(s, qid)), [updateSave]);
  const onHit = useCallback((qid) => updateSave((s) => recordHit(s, qid)), [updateSave]);

  return (
    <div className="app">
      {screen === "home" && (
        <Home
          save={save}
          theme={theme}
          onPlay={startRun}
          onDaily={() => setScreen("daily")}
          onLeaderboard={() => setScreen("leaderboard")}
          onToggleMute={() => updateSave((s) => ({ ...s, muted: !s.muted }))}
          onTutorialSeen={() => updateSave((s) => ({ ...s, tutorialSeen: true }))}
        />
      )}
      {screen === "game" && run && (
        <GameDay
          key={run.day}
          day={run.day}
          theme={theme}
          upgrades={save.upgrades}
          weakSpots={save.weakSpots}
          onMiss={onMiss}
          onHit={onHit}
          onDayEnd={onDayEnd}
          onGameOver={onGameOver}
        />
      )}
      {screen === "dayEnd" && run && (
        <DayEnd
          run={run}
          save={save}
          theme={theme}
          onBuy={(id, cost) =>
            updateSave((s) => ({
              ...s,
              bank: s.bank - cost,
              upgrades: { ...s.upgrades, [id]: (s.upgrades[id] || 0) + 1 },
            }))
          }
          onDriveHome={() => setScreen("commute")}
          onQuit={() => setScreen("home")}
        />
      )}
      {screen === "commute" && run && (
        <Commute onArrived={() => setScreen("apartment")} />
      )}
      {screen === "apartment" && run && (
        <Apartment
          save={save}
          day={run.day}
          theme={theme}
          onBuyHome={({ kind, id, cost }) =>
            updateSave((s) => {
              if (kind === "tier") {
                return { ...s, bank: s.bank - cost, home: { ...s.home, tier: s.home.tier + 1 } };
              }
              return {
                ...s,
                bank: s.bank - cost,
                home: { ...s.home, furniture: { ...s.home.furniture, [id]: true } },
              };
            })
          }
          onNextDay={nextDay}
        />
      )}
      {screen === "gameOver" && run && (
        <GameOver run={run} save={save} onPlayAgain={startRun} onHome={() => setScreen("home")} />
      )}
      {screen === "leaderboard" && (
        <Leaderboard
          save={save}
          onClear={() => updateSave((s) => ({ ...s, scores: [], bestScore: 0 }))}
          onHome={() => setScreen("home")}
        />
      )}
      {screen === "daily" && (
        <DailyCase
          save={save}
          onComplete={(date, result) =>
            updateSave((s) => ({ ...s, daily: { ...s.daily, [date]: result } }))
          }
          onHome={() => setScreen("home")}
        />
      )}
    </div>
  );
}
