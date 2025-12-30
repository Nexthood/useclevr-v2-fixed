"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Upload,
  Database,
  BarChart2,
  FileText,
  Trash2,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const raw = localStorage.getItem("useclevr_recent");
    if (raw) setRecent(JSON.parse(raw));
  }, []);

  function deleteEntry(id) {
    const filtered = recent.filter((r) => r.id !== id);
    setRecent(filtered);
    localStorage.setItem("useclevr_recent", JSON.stringify(filtered));
  }

  function formatDate(ts) {
    const d = new Date(ts);
    return d.toLocaleString();
  }

  return (
    <div className="p-8 space-y-10">

      {/* HERO */}
      <div className="
        bg-white/10 dark:bg-[#0B0B12]/40 backdrop-blur-xl 
        border border-white/10 rounded-2xl p-10 shadow-[0_0_25px_rgba(0,255,255,0.3)]
        hover:shadow-[0_0_35px_rgba(0,255,255,0.5)]
        transition-all
      ">
        <h1 className="text-4xl font-bold mb-3">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
            UseClevr
          </span>
        </h1>

        <p className="text-gray-300 text-lg">
          Upload a CSV and let AI instantly analyze your data.
        </p>

        <Link
          href="/datasets/upload"
          className="
            inline-flex items-center gap-2 mt-6 px-6 py-4 
            bg-gradient-to-r from-purple-600 to-cyan-400 
            text-white font-medium rounded-xl
            hover:scale-105 transition active:scale-95
            shadow-[0_0_15px_rgba(0,255,255,0.5)]
          "
        >
          <Upload size={20} />
          Upload CSV
        </Link>
      </div>

      {/* RECENT */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Recent Datasets</h2>

        {recent.length === 0 && (
          <p className="text-gray-500">No recent datasets yet.</p>
        )}

        <div className="space-y-3">
          {recent.map((ds) => (
            <div
              key={ds.id}
              className="
                flex items-center justify-between px-5 py-4 
                bg-white/10 dark:bg-[#0B0B12]/30 rounded-xl
                hover:bg-white/20 transition-all group
              "
            >
              <Link
                href={`/datasets/${ds.id}`}
                className="flex items-center gap-4 flex-1"
              >
                <FileSpreadsheet size={30} className="text-cyan-300" />

                <div>
                  <p className="font-semibold text-white">{ds.name}</p>

                  <p className="text-gray-400 text-sm">
                    {ds.rows} rows • {ds.columns} columns
                  </p>

                  <p className="text-gray-500 text-xs mt-1">
                    Uploaded: {formatDate(ds.timestamp)}
                  </p>
                </div>
              </Link>

              {/* DELETE BUTTON */}
              <button
                onClick={() => deleteEntry(ds.id)}
                className="
                  p-2 rounded-lg hover:bg-red-500/20
                  text-red-300 hover:text-red-400
                  transition
                "
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
