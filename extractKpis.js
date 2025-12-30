// /utils/extractKpis.js

export function extractKpis(data) {
  if (!data || data.length === 0) return {};

  const numericCols = Object.keys(data[0]).filter(key =>
    typeof data[0][key] === "number"
  );

  const kpis = {};

  numericCols.forEach(col => {
    const values = data.map(row => Number(row[col]) || 0);

    const sum = values.reduce((s, v) => s + v, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    kpis[col] = { sum, avg, min, max };
  });

  return kpis;
}
