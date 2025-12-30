"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const [datasets, setDatasets] = useState([]);
  const [summary, setSummary] = useState("");

  // Load datasets from Supabase
  useEffect(() => {
    async function fetchDatasets() {
      const { data, error } = await supabase
        .from("datasets")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setDatasets(data);

        // Save in localStorage
        localStorage.setItem("useclevr_datasets", JSON.stringify(data));
      }
    }

    fetchDatasets();
  }, []);

  // Load summary from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("useclevr_summary");
    if (saved) setSummary(saved);
  }, []);

  // Generate summary dynamically once datasets are loaded
  useEffect(() => {
    if (!datasets.length) return;

    const totalRows = datasets.reduce(
      (sum, d) => sum + (d.rows || 0),
      0
    );

    const s = `
Datasets: ${datasets.length}
Total rows: ${totalRows}
Last upload: ${new Date(datasets[0].created_at).toLocaleString()}
`;

    setSummary(s);
    localStorage.setItem("useclevr_summary", s);
  }, [datasets]);

  return (
    <div className="space-y-6">

      {/* Summary Box */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">AI Summary</h2>

        <pre className="text-sm whitespace-pre-wrap">
          {summary || "Loading summary..."}
        </pre>
      </div>

      {/* Dataset List */}
      <div className="p-6 bg-white dark:bg-neutral-900 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Uploaded Datasets</h2>

        {datasets.length === 0 ? (
          <p className="text-gray-500">No datasets uploaded yet.</p>
        ) : (
          <ul className="space-y-3">
            {datasets.map((ds) => (
              <li
                key={ds.id}
                className="p-4 border rounded-lg flex justify-between"
              >
                <div>
                  <p className="font-semibold">{ds.name}</p>
                  <p className="text-sm text-gray-500">
                    {ds.rows} rows • {new Date(ds.created_at).toLocaleString()}
                  </p>
                </div>

                <a
                  href={`/datasets/${ds.id}`}
                  className="px-4 py-2 bg-black text-white rounded-lg"
                >
                  Open
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
