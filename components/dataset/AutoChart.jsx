"use client";

import { useMemo } from "react";
import { Bar, Line, Pie, Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

export default function AutoChart({ dataset }) {
  const chart = useMemo(() => {
    if (!dataset || dataset.length === 0) return null;

    const sample = dataset[0];
    const keys = Object.keys(sample);

    const numeric = keys.filter((k) => typeof sample[k] === "number");
    const categorical = keys.filter((k) => typeof sample[k] === "string");

    // PRIORITY ORDER:
    // 1. Scatter (best for relationships)
    // 2. Line (trend)
    // 3. Bar (distribution)
    // 4. Pie (categorical summary)

    // 1️⃣ SCATTER CHART (if 2 numeric columns exist)
    if (numeric.length >= 2) {
      const xCol = numeric[0];
      const yCol = numeric[1];

      return {
        type: "scatter",
        title: `${xCol} vs ${yCol}`,
        element: (
          <Scatter
            data={{
              datasets: [
                {
                  label: `${xCol} vs ${yCol}`,
                  data: dataset.map((r) => ({
                    x: r[xCol],
                    y: r[yCol],
                  })),
                  backgroundColor: "rgba(54,162,235,0.7)",
                },
              ],
            }}
          />
        ),
      };
    }

    // 2️⃣ LINE CHART (one numeric column)
    if (numeric.length === 1) {
      const col = numeric[0];

      return {
        type: "line",
        title: `Trend: ${col}`,
        element: (
          <Line
            data={{
              labels: dataset.map((_, i) => `Row ${i + 1}`),
              datasets: [
                {
                  label: col,
                  data: dataset.map((r) => r[col]),
                  borderColor: "rgba(255,99,132,1)",
                  backgroundColor: "rgba(255,99,132,0.3)",
                  tension: 0.3,
                },
              ],
            }}
          />
        ),
      };
    }

    // 3️⃣ BAR CHART (categorical + numeric)
    if (categorical.length >= 1 && numeric.length >= 1) {
      const col = categorical[0];
      const num = numeric[0];

      const freq = {};

      dataset.forEach((r) => {
        const key = r[col];
        freq[key] = (freq[key] || 0) + Number(r[num] || 0);
      });

      return {
        type: "bar",
        title: `Bar Chart: ${col} vs ${num}`,
        element: (
          <Bar
            data={{
              labels: Object.keys(freq),
              datasets: [
                {
                  label: num,
                  data: Object.values(freq),
                  backgroundColor: "rgba(54,162,235,0.7)",
                },
              ],
            }}
          />
        ),
      };
    }

    // 4️⃣ PIE CHART (categorical distribution only)
    if (categorical.length >= 1) {
      const col = categorical[0];
      const freq = {};

      dataset.forEach((r) => {
        freq[r[col]] = (freq[r[col]] || 0) + 1;
      });

      return {
        type: "pie",
        title: `Pie Chart: ${col}`,
        element: (
          <Pie
            data={{
              labels: Object.keys(freq),
              datasets: [
                {
                  data: Object.values(freq),
                  backgroundColor: [
                    "rgba(255,99,132,0.7)",
                    "rgba(54,162,235,0.7)",
                    "rgba(255,206,86,0.7)",
                    "rgba(75,192,192,0.7)",
                    "rgba(153,102,255,0.7)",
                    "rgba(255,159,64,0.7)",
                  ],
                },
              ],
            }}
          />
        ),
      };
    }

    return null;
  }, [dataset]);

  if (!chart) {
    return <div className="text-gray-500">Not enough data to generate a chart.</div>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow space-y-4">
      <h2 className="text-xl font-semibold">{chart.title}</h2>
      {chart.element}
    </div>
  );
}
