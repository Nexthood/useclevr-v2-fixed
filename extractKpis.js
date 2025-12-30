export default function extractKpis(dataset = []) {
  if (!dataset || dataset.length === 0) {
    return {
      totalRows: 0,
      numericColumns: [],
      stringColumns: [],
      stats: {}
    };
  }

  const sample = dataset[0];
  const columns = Object.keys(sample);

  let numericColumns = [];
  let stringColumns = [];

  // Detect column types
  for (const col of columns) {
    const value = dataset[0][col];

    if (typeof value === "number") numericColumns.push(col);
    else stringColumns.push(col);
  }

  // Compute statistics for numeric columns
  const stats = {};

  for (const col of numericColumns) {
    const values = dataset
      .map((row) => row[col])
      .filter((v) => typeof v === "number" && !isNaN(v));

    if (values.length === 0) continue;

    const sum = values.reduce((a, b) => a + b, 0);
    const avg = sum / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);

    stats[col] = {
      count: values.length,
      sum,
      avg: Number(avg.toFixed(2)),
      min,
      max
    };
  }

  return {
    totalRows: dataset.length,
    numericColumns,
    stringColumns,
    stats
  };
}
