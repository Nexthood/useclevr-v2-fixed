"use client";

import { useState } from "react";
import UploadCSV from "@/components/UploadCSV";
import Dashboard from "@/components/Dashboard";
import CompareChart from "@/components/CompareChart";

export default function Home() {
  const [data, setData] = useState(null);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState(0);
  const [columns, setColumns] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleParsedData = (parsed) => {
    setData(parsed);
    setRows(parsed?.length || 0);
    setColumns(parsed && parsed[0] ? Object.keys(parsed[0]).length : 0);
    setLoading(false);
  };

  const resetAll = () => {
    setData(null);
    setFileName("");
    setRows(0);
    setColumns(0);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#0B0B12] text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HERO */}
        <section className="mb-14">
          <h1 className="text-5xl font-bold mb-4">
            UseClevr
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Upload your CSV file and instantly generate smart insights,
            comparisons and visual dashboards powered by AI.
          </p>
        </section>

        {/* UPLOAD CARD */}
        <section className="mb-12 bg-[#111122] border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">
            Upload CSV
          </h2>

          <UploadCSV
            onStart={() => setLoading(true)}
            onFileName={setFileName}
            onDataParsed={handleParsedData}
          />

          {loading && (
            <p className="mt-4 text-sm text-cyan-400">
              Parsing file…
            </p>
          )}

          {fileName && !loading && (
            <div className="mt-4 text-sm text-gray-400">
              <p>File: <span className="text-white">{fileName}</span></p>
              <p>Rows: {rows}</p>
              <p>Columns: {columns}</p>
            </div>
          )}
        </section>

        {/* ACTION BAR */}
        {data && (
          <section className="mb-10 flex gap-4">
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-md bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
            >
              Reset
            </button>
          </section>
        )}

        {/* DASHBOARD */}
        {data && (
          <section className="mb-14">
            <h2 className="text-2xl font-semibold mb-6">
              Dashboard
            </h2>
            <Dashboard data={data} />
          </section>
        )}

        {/* COMPARE / CHART */}
        {data && (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-6">
              Compare & Visualize
            </h2>
            <CompareChart data={data} />
          </section>
        )}

        {/* FOOTER */}
        <footer className="pt-10 border-t border-white/10 text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} UseClevr · CSV → AI Insights
          </p>
        </footer>

      </div>
    </main>
  );
}
