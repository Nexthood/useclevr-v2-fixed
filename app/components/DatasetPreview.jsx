"use client";

import { useState, useMemo } from "react";

export default function DatasetPreview({ dataset }) {
  if (!dataset || dataset.length === 0)
    return <p className="text-gray-400">No dataset loaded.</p>;

  const columns = Object.keys(dataset[0]);

  // Pagination
  const [page, setPage] = useState(0);
  const pageSize = 25;

  // Sorting
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  // Column Filters
  const [filters, setFilters] = useState(
    columns.reduce((obj, c) => ({ ...obj, [c]: "" }), {})
  );

  // Apply Filters
  const filteredRows = useMemo(() => {
    return dataset.filter((row) => {
      return columns.every((col) => {
        const filter = filters[col];
        if (!filter) return true;
        return String(row[col]).toLowerCase().includes(filter.toLowerCase());
      });
    });
  }, [dataset, filters]);

  // Apply Sorting
  const sortedRows = useMemo(() => {
    if (!sortCol) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const valA = a[sortCol];
      const valB = b[sortCol];

      if (!isNaN(valA) && !isNaN(valB)) {
        return sortDir === "asc"
          ? valA - valB
          : valB - valA;
      }

      return sortDir === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [filteredRows, sortCol, sortDir]);

  // Pagination Slicing
  const start = page * pageSize;
  const pageRows = sortedRows.slice(start, start + pageSize);

  const totalPages = Math.ceil(sortedRows.length / pageSize);

  function toggleSort(c) {
    if (sortCol === c) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(c);
      setSortDir("asc");
    }
  }

  function updateFilter(col, value) {
    setFilters({ ...filters, [col]: value });
  }

  // Column Profile (min/max/unique)
  function getColumnProfile(col) {
    const values = dataset.map((r) => r[col]);
    const numeric = values.filter((v) => !isNaN(parseFloat(v)));

    return {
      unique: new Set(values).size,
      min: numeric.length ? Math.min(...numeric) : "–",
      max: numeric.length ? Math.max(...numeric) : "–",
    };
  }

  return (
    <div className="p-6 bg-white/10 rounded-xl border border-white/10 shadow-xl backdrop-blur-xl space-y-6">
      
      <h2 className="text-xl font-semibold text-white">Dataset Preview</h2>

      {/* Table */}
      <div className="overflow-auto max-h-[600px] border border-white/10 rounded-lg">
        <table className="min-w-full text-sm text-gray-200">
          <thead className="bg-white/5 sticky top-0 backdrop-blur-xl">
            <tr>
              {columns.map((c) => {
                const profile = getColumnProfile(c);
                return (
                  <th key={c} className="p-3 text-left border-b border-white/10">
                    <div
                      className="cursor-pointer flex items-center gap-2"
                      onClick={() => toggleSort(c)}
                    >
                      {c}
                      {sortCol === c && (sortDir === "asc" ? "↑" : "↓")}
                    </div>

                    {/* Column Profile */}
                    <div className="text-xs text-gray-400">
                      unique: {profile.unique} • min: {profile.min} • max: {profile.max}
                    </div>

                    {/* Filter */}
                    <input
                      type="text"
                      value={filters[c]}
                      onChange={(e) => updateFilter(c, e.target.value)}
                      className="w-full mt-2 px-2 py-1 bg-black/20 border border-white/20 rounded text-xs"
                      placeholder="Filter..."
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {pageRows.map((row, i) => (
              <tr key={i} className="hover:bg-white/10 transition">
                {columns.map((c) => (
                  <td key={c} className="p-3 border-b border-white/10">
                    {String(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-white">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-3 py-2 bg-white/10 rounded hover:bg-white/20 disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-gray-300">
          Page {page + 1} of {totalPages}
        </span>

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-2 bg-white/10 rounded hover:bg-white/20 disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
