"use client";

import Card from "@/components/Card";

export default function ChartSuggestions({ dataset }) {
  if (!dataset || dataset.length === 0) return null;

  const sample = dataset[0];
  const numericCols = Object.keys(sample).filter((col) =>
    dataset.every((row) => !isNaN(Number(row[col])))
  );

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">Chart Suggestions</h2>

      {numericCols.length === 0 && (
        <p className="text-gray-600">No numeric data available.</p>
      )}

      {numericCols.length > 0 && (
        <ul className="list-disc ml-6 text-gray-700">
          {numericCols.map((col) => (
            <li key={col}>
              Try a line or bar chart for <b>{col}</b>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
