export function buildRunShare({ day, score, bestStreak, results }) {
  const grid = results.slice(-20).join("");
  return [
    `⚖️ Debora Learns Law — Day ${day}`,
    `💼 ${score.toLocaleString()} billable hours`,
    `🔥 Best streak ${bestStreak}`,
    grid,
  ].join("\n");
}

export function buildDailyShare({ date, correct, total, ms, grid }) {
  const secs = (ms / 1000).toFixed(1);
  return [
    `⚖️ Daily Case — ${date}`,
    `${correct}/${total} in ${secs}s`,
    grid.join(""),
  ].join("\n");
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
