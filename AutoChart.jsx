"use client";

import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function AutoChart({ dataset, onImageReady }) {
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  // Helpers
  function detectColumnTypes(rows) {
    if (!rows || rows.length === 0) return [];

    const sample = rows[0];
    const cols = Object.keys(sample);

    return cols.map((col) => {
      const values = rows.map((r) => r[col]);
      const nonEmpty = values.filter((v) => v !== "" && v != null);

      let type = "text";

      if (nonEmpty.every((v) => !isNaN(parseFloat(v)))) type = "number";
      if (nonEmpty.every((v) => !isNaN(Date.parse(v)))) type = "date";

      return { column: col, type };
    });
  }

  function chooseChartType(meta) {
    const numbers = meta.filter((c) => c.type === "number");
    const dates = meta.filter((c) => c.type === "date");
    const texts = meta.filter((c) => c.type === "text");

    if (dates.length > 0 && numbers.length > 0) return "line";
    if (numbers.length >= 2) return "scatter";
    if (texts.length > 0 && numbers.length > 0) return "bar";
    if (numbers.length === 1) return "histogram";

    return "bar"; // fallback
  }

  function prepareData(rows, meta, chartType) {
    const numbers = meta.filter((c) => c.type === "number");
    const dates = meta.filter((c) => c.type === "date");
    const texts = meta.filter((c) => c.type === "text");

    switch (chartType) {
      case "line": {
        const dateCol = dates[0].column;
        const numCol = numbers[0].column;

        return {
          labels: rows.map((r) => r[dateCol]),
          datasets: [
            {
              label: numCol,
              data: rows.map((r) => parseFloat(r[numCol])),
              borderColor: "#00eaff",
              backgroundColor: "rgba(0,234,255,0.3)",
            },
          ],
        };
      }

      case "scatter": {
        const x = numbers[0].column;
        const y = numbers[1].column;

        return {
          datasets: [
            {
              label: `${x} vs ${y}`,
              data: rows.map((r) => ({
                x: parseFloat(r[x]),
                y: parseFloat(r[y]),
              })),
              borderColor: "#00eaff",
              backgroundColor: "rgba(0,234,255,0.3)",
            },
          ],
        };
      }

      case "histogram": {
        const col = numbers[0].column;
        const values = rows.map((r) => parseFloat(r[col]));

        return {
          labels: values.map((_, i) => i),
          datasets: [
            {
              label: col,
              data: values,
              backgroundColor: "rgba(0,234,255,0.4)",
            },
          ],
        };
      }

      case "bar": {
        const textCol = texts[0].column;
        const numCol = numbers[0].column;

        return {
          labels: rows.map((r) => r[textCol]),
          datasets: [
            {
              label: numCol,
              data: rows.map((r) => parseFloat(r[numCol])),
              backgroundColor: "rgba(0,234,255,0.4)",
            },
          ],
        };
      }
    }
  }

  useEffect(() => {
    if (!dataset || dataset.length === 0) return;

    const ctx = canvasRef.current.getContext("2d");

    if (chartRef.current) chartRef.current.destroy();

    const meta = detectColumnTypes(dataset);
    const chartType = chooseChartType(meta);
    const data = prepareData(dataset, meta, chartType);

    chartRef.current = new Chart(ctx, {
      type: chartType === "histogram" ? "bar" : chartType,
      data,
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          x: { ticks: { color: "#88eaff" }, grid: { color: "#444" } },
          y: { ticks: { color: "#88eaff" }, grid: { color: "#444" } },
        },
      },
    });

    // Export image for PDF
    setTimeout(() => {
      if (onImageReady) {
        const img = canvasRef.current.toDataURL("image/png");
        onImageReady(img);
      }
    }, 500);
  }, [dataset]);

  return (
    <div className="p-6 bg-white/10 dark:bg-[#0B0B12]/30 border rounded-xl backdrop-blur-xl shadow-xl">
      <h2 className="text-xl font-semibold mb-3">Auto Chart</h2>
      <canvas ref={canvasRef} height={120}></canvas>
    </div>
  );
}
