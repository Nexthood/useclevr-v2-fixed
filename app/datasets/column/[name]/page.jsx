"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ColumnDetailPage() {
  const { name } = useParams(); // column name
  const [dataset, setDataset] = useState([]);
  const [rows, setRows] = useState([]);

  const [stats, setStats] = useState({});
  const [distribution, setDistribution] = useState({});
  const [valueType, setValueType] = useState("unknown");

  useEffect(() => {
    const raw = localStorage.getItem("useclevr_dataset");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    setDataset(parsed);

    if (parsed.length > 0) {
      const colValues = parsed.map((r) => r[name]);
      setRows(colValues);
      calculateStats(colValues);
      calculateDistribution(colValues);
    }
  }, [name]);

  // ---------------------------------------
  // STATS CALCULATION
  // ---------------------------------------
  function calculateStats(values) {
    const clean = values.filter((v) => v !== null && v !== undefined && v !== "");

    const missing = values.length - clean.length;
    const missingPercent = (missing / values.length) * 100;

    const nums = clean.filter((v) => typeof v === "number");

    let min = null, max = null, avg = null;
    if (nums.length > 0) {
      min = Math.min(...nums);
      max = Math.max(...nums);
      avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    }

    // Determine type
    let type = "mixed";
    if (nums.length === clean.length) type = "numeric";
    else if (nums.length === 0) type = "categorical";

    setValueType(type);

    setStats({
      total: values.length,
      missing,
      missingPercent,
      min,
      max,
      avg,
      unique: new Set(clean).size,
    });
  }

  // ---------------------------------------
  // VALUE DISTRIBUTION
  // ---------------------------------------
  function calculateDistribution(values) {
    const freq = {};

    values.forEach((v) => {
      if (v === null || v === undefined || v === "") return;
      const key = String(v);
      freq[key] = (freq[key] || 0) + 1;
    });

    // sort by frequency
    const sorted = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15);

    setDistribution(Object.fromEntries(sorted));
  }

  return (
    <div className="p-10 space-y-10">

      <h1 className="text-3xl font-bold">Column Details: {name}</h1>

      {/* BASIC STATS CARD */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Type</p>
            <p className="font-semibold">{valueType}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Rows</p>
            <p className="font-semibold">{stats.total}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Missing (%)</p>
            <p className="font-semibold">
              {stats.missingPercent?.toFixed(1)}%
            </p>
          </div>

          {valueType === "numeric" && (
            <>
              <div>
                <p className="text-gray-500 text-sm">Min</p>
                <p className="font-semibold">{stats.min}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Max</p>
                <p className="font-semibold">{stats.max}</p>
              </div>

              <div>
                <p className="text-gray-500 text-sm">Avg</p>
                <p className="font-semibold">
                  {stats.avg?.toFixed(2)}
                </p>
              </div>
            </>
          )}

          <div>
            <p className="text-gray-500 text-sm">Unique Values</p>
            <p className="font-semibold">{stats.unique}</p>
          </div>
        </div>
      </div>

      {/* VALUE DISTRIBUTION */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Value Distribution</h2>

        {Object.keys(distribution).length === 0 && (
          <p className="text-gray-500">No value distribution available.</p>
        )}

        <div className="space-y-2">
          {Object.entries(distribution).map(([key, count]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm">{key}</span>
              <span className="text-sm font-semibold">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SAMPLE VALUES */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">Sample Values</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.slice(0, 20).map((v, i) => (
            <div key={i} className="p-3 bg-gray-100 dark:bg-neutral-800 rounded-lg">
              {String(v)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
