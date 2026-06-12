import { SHOP_ITEMS, upgradeLevel, nextCost } from "../game/save.js";
import { sfx } from "../game/sound.js";

export default function DayEnd({ run, save, theme, onBuy, onDriveHome, onQuit }) {
  const d = run.lastDay;
  return (
    <div className="screen dayend">
      <h1>End of business — Day {run.day}</h1>

      <div className="stat-row">
        <div className="stat">
          <span className="stat-num">{d.billables.toLocaleString()}</span>
          <span className="stat-label">hours billed today</span>
        </div>
        <div className="stat">
          <span className="stat-num">{d.casesWon}</span>
          <span className="stat-label">cases won</span>
        </div>
        <div className="stat">
          <span className="stat-num">🔥 {d.bestStreak}</span>
          <span className="stat-label">best streak</span>
        </div>
        <div className="stat">
          <span className="stat-num">{run.total.toLocaleString()}</span>
          <span className="stat-label">run total</span>
        </div>
      </div>

      <section className="shop">
        <h2>
          🛒 Firm Shop <span className="bank">💼 {save.bank.toLocaleString()} banked</span>
        </h2>
        <div className="shop-grid">
          {SHOP_ITEMS.map((item) => {
            const lvl = upgradeLevel(save, item.id);
            const cost = nextCost(save, item.id);
            const maxed = cost === null;
            const affordable = !maxed && save.bank >= cost;
            return (
              <div key={item.id} className={`shop-item ${maxed ? "maxed" : ""}`}>
                <div className="shop-icon">{item.icon}</div>
                <div className="shop-info">
                  <strong>
                    {item.name}
                    {item.costs.length > 1 && lvl > 0 && ` (lvl ${lvl})`}
                  </strong>
                  <p>{item.desc}</p>
                </div>
                {maxed ? (
                  <span className="owned">✓ Owned</span>
                ) : (
                  <button
                    className="btn buy"
                    disabled={!affordable}
                    onClick={() => {
                      sfx.buy();
                      onBuy(item.id, cost);
                    }}
                  >
                    {cost.toLocaleString()} hrs
                  </button>
                )}
              </div>
            );
          })}
        </div>
        <p className="shop-hint">
          Tomorrow is still <strong>{theme} Week</strong> — those cases pay ×1.25. Day {run.day + 1}{" "}
          will be faster. Gear up.
        </p>
      </section>

      <div className="dayend-actions">
        <button className="btn primary big" onClick={onDriveHome}>
          🚗 Drive home →
        </button>
        <button className="link" onClick={onQuit}>
          Close the firm for now
        </button>
      </div>
    </div>
  );
}
