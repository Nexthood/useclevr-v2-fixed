"use client";

import { useEffect, useState } from "react";

export default function DataCleaningPage() {
  const [dataset, setDataset] = useState([]);
  const [columns, setColumns] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("useclevr_dataset");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    setDataset(parsed);
    if (parsed.length > 0) {
      setColumns(Object.keys(parsed[0]));
    }
  }, []);

  function saveUpdated(ds) {
    setDataset(ds);
    localStorage.setItem("useclevr_dataset", JSON.stringify(ds));
  }

  // ---------------------------------
  // 1) Remove Empty Rows
  // ---------------------------------
  function removeEmptyRows() {
    const cleaned = dataset.filter((row) =>
      Object.values(row).some((v) => v !== "" && v !== null && v !== undefined)
    );

    saveUpdated(cleaned);
    setMessage(`Removed ${dataset.length - cleaned.length} empty rows.`);
  }

  // ---------------------------------
  // 2) Remove Duplicates
  // ---------------------------------
  function removeDuplicates() {
    const seen = new Set();
    const cleaned = [];

    dataset.forEach((row) => {
      const key = JSON.stringify(row);
      if (!seen.has(key)) {
        seen.add(key);
        cleaned.push(row);
      }
    });

    saveUpdated(cleaned);
    setMessage(`Removed ${dataset.length - cleaned.length} duplicate rows.`);
  }

  // ---------------------------------
  // 3) Fill Missing Values
  // ---------------------------------
  function fillMissing(method) {
    const cleaned = [...dataset];

    cleaned.forEach((row) => {
      columns.forEach((col) => {
        if (row[col] === "" || row[col] === null || row[col] === undefined) {
          if (method === "zero") row[col] = 0;
          if (method === "unknown") row[col] = "Unknown";
        }
      });
    });

    saveUpdated(cleaned);
    setMessage(`Filled missing values (${method}).`);
  }

  // Fill with column mean for numeric only
  function fillMean() {
    const means = {};

    columns.forEach((col) => {
      const nums = dataset
        .map((r) => r[col])
        .filter((v) => typeof v === "number");

      if (nums.length > 0) {
        const sum = nums.reduce((a, b) => a + b, 0);
        means[col] = sum / nums.length;
      }
    });

    const cleaned = dataset.map((row) => {
      const r = { ...row };
      columns.forEach((col) => {
        if (r[col] === "" || r[col] === null || r[col] === undefined) {
          if (means[col] !== undefined) {
            r[col] = means[col];
          }
        }
      });
      return r;
    });

    saveUpdated(cleaned);
    setMessage("Filled missing numeric values with column mean.");
  }

  // ---------------------------------
  // 4) Numeric Normalization
  // ---------------------------------
  function normalizeNumeric() {
    const cleaned = dataset.map((row) => ({ ...row }));

    columns.forEach((col) => {
      const values = cleaned
        .map((r) => r[col])
        .filter((v) => typeof v === "number");

      if (values.length === 0) return;

      const min = Math.min(...values);
      const max = Math.max(...values);

      cleaned.forEach((r) => {
        if (typeof r[col] === "number") {
          r[col] = (r[col] - min) / (max - min);
        }
      });
    });

    saveUpdated(cleaned);
    setMessage("Normalized all numeric columns (Min–Max).");
  }

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold">Data Cleaning Tools</h1>

      {message && (
        <div className="p-4 bg-green-600 text-white rounded-lg">
          {message}
        </div>
      )}

      {/* BUTTONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <button
          onClick={removeEmptyRows}
          className="p-4 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Remove Empty Rows
        </button>

        <button
          onClick={removeDuplicates}
          className="p-4 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Remove Duplicate Rows
        </button>

        <button
          onClick={() => fillMissing("zero")}
          className="p-4 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Fill Missing → 0
        </button>

        <button
          onClick={() => fillMissing("unknown")}
          className="p-4 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Fill Missing → "Unknown"
        </button>

        <button
          onClick={fillMean}
          className="p-4 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Fill Missing Numeric → Mean
        </button>

        <button
          onClick={normalizeNumeric}
          className="p-4 bg-black text-white rounded-xl hover:bg-gray-800"
        >
          Normalize Numeric Columns
        </button>
      </div>
    </div>
  );
}
