"use client";

import { useState, useMemo } from "react";
import Card from "@/components/Card";

export default function DataExplorer({ dataset }) {
  if (!dataset || dataset.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-300">
        No dataset loaded.
      </p>
    );
  }

  const columns = Object.keys(dataset[0]);

  const [search, setSearch] = useState("");
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  const filtered = useMemo(() => {
    let rows = [...dataset];

    // SEARCH
    if (search.trim()) {
      const term = search.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) =>
          String(row[col] ?? "")
            .toLowerCase()
            .includes(term)
        )
      );
    }

    // SORTING
    if (sortCol) {
      rows.sort((a, b) => {
        const A = a[sortCol];
        const B = b[sortCol];

        if (A < B) return sortDir === "asc" ? -1 : 1;
        if (A > B) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
    }

    return rows;
  }, [dataset, search, sortCol, sortDir]);

  function toggleSort(col) {
    if (sortCol === col) {
      // Switch asc <-> desc
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Data Explorer</h2>

      {/* SEARCH */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search…"
        className="border p-2 rounded w-full mb-4"
      />

      {/* TABLE */}
      <div className="overflow-auto border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100 text-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => toggleSort(col)}
                  className="p-3 border cursor-pointer select-none"
                >
                  {col}
                  {sortCol === col && (
                    <span className="ml-1 text-gray-600">
                      {sortDir === "asc" ? "▲" : "▼"}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="odd:bg-white even:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="p-3 border text-sm">
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
