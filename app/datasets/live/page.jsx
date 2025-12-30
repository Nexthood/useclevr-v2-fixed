
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";

export default function LiveDatasetPage({ searchParams }) {
  const id = searchParams?.id;

  const [dataset, setDataset] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadDataset() {
    if (!id) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("datasets")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setDataset(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadDataset();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-400">Loading dataset…</p>;
  }

  if (!dataset) {
    return (
      <div className="p-6">
        <p className="text-red-500">Dataset not found.</p>
        <Link href="/datasets" className="text-blue-500 underline">
          Back to datasets
        </Link>
      </div>
    );
  }

  const previewRows = dataset.data.slice(0, 100);
  const columns = Object.keys(previewRows[0] || {});

  return (
    <div className="p-8 space-y-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Live Dataset Preview</h1>
        <p className="text-gray-500">
          Viewing dataset: <span className="font-semibold">{dataset.name}</span>
        </p>
        <p className="text-gray-500">{dataset.rows} rows total</p>
      </div>

      {/* PREVIEW TABLE */}
      <div className="overflow-auto border rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 dark:bg-[#111]">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 font-semibold text-left">
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {previewRows.map((row, i) => (
              <tr key={i} className="border-t dark:border-gray-800">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2">
                    {String(row[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INSIGHTS BUTTON */}
      <div>
        <Link
          href={`/insights/live?id=${dataset.id}`}
          className="
            inline-block px-6 py-3 bg-black text-white rounded-lg 
            hover:bg-gray-800 dark:bg-white dark:text-black
          "
        >
          Analyze in AI Insights →
        </Link>
      </div>
    </div>
  );
}
