"use client";

import { useEffect, useState } from "react";

export default function FilterDatasetPage() {
  const [dataset, setDataset] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [columns, setColumns] = useState([]);

  const [column, setColumn] = useState("");
  const [condition, setCondition] = useState("contains");
  const [value, setValue] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("useclevr_dataset");
    if (!raw) return;

    const parsed = JSON.parse(raw);
    setDataset(parsed);
    setFiltered(parsed);

    if (parsed.length > 0) {
      setColumns(Object.keys(parsed[0]));
    }
  }, []);

  function applyFilter() {
    if (!column || !condition) return;

    const val = value.toLowerCase();

    const result = dataset.filter((row) => {
      const cell = row[column];

      if (cell === undefined || cell === null) return false;

      const cellStr = String(cell).toLowerCase();

      switch (condition) {
        case "contains":
          return cellStr.includes(val);

        case "equals":
          return cellStr === val;

        case "greater":
          return Number(cell) > Number(value);

        case "less":
          return Number(cell) < Number(value);

        default:
          return true;
      }
    });

    setFiltered(result);
  }

  function saveFiltered() {
    localStorage.setItem("useclevr_dataset", JSON.stringify(filtered));
    alert("Filtered dataset saved!");
  }

  function resetFilter() {
    setFiltered(dataset);
    setColumn("");
    setCondition("contains");
    setValue("");
  }

  return (
    <div className="p-10 space-y-10">
      <h1 className="text-3xl font-bold">Filter Dataset</h1>

      {/* FILTER UI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* COLUMN SELECTOR */}
        <select
          value={column}
          onChange={(e) => setColumn(e.target.value)}
          className="p-3 border rounded-lg dark:bg-neutral-900 dark:border-gray-700"
        >
          <option value="">Select Column</option>
          {columns.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* CONDITION SELECTOR */}
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="p-3 border rounded-lg dark:bg-neutral-900 dark:border-gray-700"
        >
          <option value="contains">Contains</option>
          <option value="equals">Equals</option>
          <option value="greater">Greater Than</option>
          <option value="less">Less Than</option>
        </select>

        {/* VALUE INPUT */}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Value..."
          className="p-3 border rounded-lg dark:bg-neutral-900 dark:border-gray-700"
        />

        {/* APPLY BUTTON */}
        <button
          onClick={applyFilter}
          className="p-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Apply Filter
        </button>
      </div>

      {/* RESET + SAVE */}
      <div className="flex gap-4">
        <button
          onClick={resetFilter}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg"
        >
          Reset
        </button>

        <button
          onClick={saveFiltered}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg"
        >
          Save Filtered Dataset
        </button>
      </div>

      {/* PREVIEW TABLE */}
      <div className="overflow-auto max-h-[65vh] border rounded-xl dark:border-gray-700">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 bg-gray-100 dark:bg-neutral-900">
            <tr>
              {columns.map((c) => (
                <th
                  key={c}
                  className="px-4 py-2 border dark:border-gray-800 text-sm font-semibold"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filtered.slice(0, 100).map((row, i) => (
              <tr key={i} className="hover:bg-gray-50 dark:hover:bg-neutral-800">
                {columns.map((c) => (
                  <td
                    key={c}
                    className="px-4 py-2 border dark:border-gray-800 text-sm"
                  >
                    {row[c] === null || row[c] === undefined
                      ? "—"
                      : String(row[c])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="text-gray-500 p-4">
          Showing first 100 filtered rows. Total: {filtered.length}
        </p>
      </div>
    </div>
  );
}
