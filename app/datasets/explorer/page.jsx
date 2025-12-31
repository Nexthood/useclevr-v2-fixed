"use client";

import { useEffect, useState } from "react";
import KpiCard from "@/components/dataset/KpiCard";
import Link from "next/link";

export default function ExplorerPage() {
  const [dataset, setDataset] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("useclevr_dataset");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setDataset(parsed);
      } catch (e) {
        console.error("Failed to parse dataset", e);
      }
    }
    setLoaded(true);
  }, []);

  return (
    <div className="p-6 space-y-10">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-semibold">Explore Data</h1>
        <p className="text-gray-600">
          Filter, sort and inspect your dataset manually.
        </p>
      </div>

      {/* NO DATASET */}
      {loaded && dataset.length === 0 && (
        <Card className="p-6 text-center">
          <p className="text-gray-600 mb-4">No dataset loaded.</p>

          <Link
            href="/upload"
            className="px-6 py-3 inline-block bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Upload CSV →
          </Link>
        </Card>
      )}

      {/* DATA EXPLORER */}
      {dataset.length > 0 && (
        <div className="space-y-6">

          {/* QUICK NAV */}
          <div className="flex gap-3">
            <Link
              href="/datasets/live"
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Open AI Insights →
            </Link>

            <Link
              href="/datasets"
              className="px-5 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
            >
              Dataset Overview →
            </Link>
          </div>

          <DataExplorer dataset={dataset} />
        </div>
      )}
    </div>
  );
}
