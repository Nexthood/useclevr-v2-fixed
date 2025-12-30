// /utils/computeCorrelations.js

export function computeCorrelations(data) {
  if (!data || data.length === 0) return [];

  const columns = Object.keys(data[0]);
  const result = [];

  columns.forEach(col1 => {
    const row = { id: col1 };

    columns.forEach(col2 => {
      row[col2] = correlation(
        data.map(r => Number(r[col1])),
        data.map(r => Number(r[col2]))
      );
    });

    result.push(row);
  });

  return result;
}

function correlation(a, b) {
  const n = a.length;
  const meanA = a.reduce((s,v)=>s+v,0) / n;
  const meanB = b.reduce((s,v)=>s+v,0) / n;

  let num = 0, denA = 0, denB = 0;

  for (let i = 0; i < n; i++) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    num  += da * db;
    denA += da * da;
    denB += db * db;
  }

  const den = Math.sqrt(denA * denB);
  return den === 0 ? 0 : num / den;
}
