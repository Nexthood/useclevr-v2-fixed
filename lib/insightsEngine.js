export default function analyzeDataset(dataset) {
  if (!dataset || dataset.length === 0) {
    return {
      kpis: {},
      columns: [],
      summary: "Dataset is empty.",
      chartData: [],
    };
  }

  const columns = Object.keys(dataset[0]);

  const numericColumns = columns.filter((col) =>
    typeof dataset[0][col] === "number"
  );

  const summary = `
    Dataset contains ${dataset.length} rows and ${columns.length} columns.
    ${numericColumns.length} numeric fields detected.
    Auto-chart system has generated the most appropriate visualization.
  `;

  return {
    kpis: {
      rows: dataset.length,
      columns: columns.length,
      numericColumns: numericColumns.length,
    },
    columns,
    numericColumns,
    chartData: dataset.slice(0, 20), // limit for performance
    summary,
  };
}
