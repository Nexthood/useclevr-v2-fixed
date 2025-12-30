"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DatasetPreviewPage() {
  const [dataset, setDataset] = useState([]);
  const [columns, setColumns] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");

  useEffect(() => {
    const raw = localStorage.getItem("useclevr_dataset");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    setDataset(parsed);

    if (parsed.length > 0) {
      setColumns(Object.keys(parsed[0]));
    }
  }, []);

  // Sorting
  function sortByColumn(col) {
    if (!dataset.length) return;

    const newDir = sortCol === col && sortDir === "asc" ? "desc" : "asc";
    setSortCol(col);
    setSortDir(newDir);

    const sorted = [...dataset].sort((a, b) => {
      const x = a[col];
      const y = b[col];

      if (x === y) return 0;

      if (newDir === "asc") {
        return x > y ? 1 : -1;
      } else {
        return x < y ? 1 : -1;
      }
    });

    setDataset(sorted);
    setPage(0);
  }

  const start = page * pageSize;
  const rows = dataset.slice(start, start + pageSize);

  if (!dataset.length) {
    return (
      <div className="p-8">
        <p className="text-gray-500">No dataset loaded. Go to Upload.</p>
        <Link
          href="/upload"
          className="mt-4 inline-block px-6 py-2 bg-black text-white rounded-lg"
        >
          Upload CSV →
        </Link>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">Dataset Preview</h1>
      <p className="text-gray-500">
        Showing {pageSize} rows per page. Total rows: {dataset.length}
      </p>

      {/* TABLE */}
      <div className="overflow-auto max-h-[70vh] border rounded-xl dark:border-gray-700">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 dark:bg-neutral-900 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => sortByColumn(col)}
                  className="px-4 py-3 border dark:border-gray-800 text-left text-sm font-semibold cursor-pointer select-none"
                >
                  {col}
                  {sortCol === col
                    ? sortDir === "asc"
                      ? " ▲"
                      : " ▼"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                {columns.map((col) => (
                  <td
                    key={col}
                    className="px-4 py-2 border dark:border-gray-800 text-sm"
                  >
                    {row[col] === null || row[col] === undefined
                      ? "—"
                      : String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
        >
          Previous
        </button>

        <p>
          Page {page + 1} / {Math.ceil(dataset.length / pageSize)}
        </p>

        <button
          disabled={start + pageSize >= dataset.length}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-black text-white rounded-lg disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
