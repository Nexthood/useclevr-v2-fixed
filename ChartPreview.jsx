"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ChartPreview({ data, title = "Weekly Trend" }) {
  // Falls keine Daten übergeben wurden → kleine Demo-Daten anzeigen
  const sampleData =
    data ||
    [
      { name: "Mon", value: 400 },
      { name: "Tue", value: 300 },
      { name: "Wed", value: 500 },
      { name: "Thu", value: 200 },
      { name: "Fri", value: 650 },
      { name: "Sat", value: 480 },
      { name: "Sun", value: 700 },
    ];

  return (
    <div className="p-5 bg-card-light dark:bg-card-dark border border-card-border rounded-xl shadow-sm">
      <h2 className="text-lg font-semibold mb-3 text-text dark:text-white">
        {title}
      </h2>

      <div style={{ width: "100%", height: "250px" }}>
        <ResponsiveContainer>
          <LineChart data={sampleData}>
            <XAxis
              dataKey="name"
              stroke="var(--color-text-light)"
              tick={{ fill: "var(--color-text-light)" }}
            />

            <YAxis
              stroke="var(--color-text-light)"
              tick={{ fill: "var(--color-text-light)" }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card-light)",
                borderRadius: "8px",
                border: "1px solid var(--color-card-border)",
                color: "var(--color-text)",
              }}
            />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#4F46E5" // Indigo
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
