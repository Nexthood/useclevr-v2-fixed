"use client";

import { useState } from "react";
import { Upload, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  function handleFile(file) {
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setError("Please upload a CSV file.");
      return;
    }

    setError("");

    const reader = new FileReader();

    reader.onload = () => {
      try {
        const text = reader.result;
        const rows = text.split("\n").map((r) => r.split(","));
        const headers = rows[0];

        const dataset = rows.slice(1).map((r) => {
          let record = {};
          headers.forEach((h, i) => {
            record[h.trim()] = r[i]?.trim() || "";
          });
          return record;
        });

        // Save dataset
        localStorage.setItem("useclevr_dataset", JSON.stringify(dataset));

        // --- NEW: Recent datasets upgrade ---
        const recent = JSON.parse(localStorage.getItem("useclevr_recent") || "[]");

        const entry = {
          id: Date.now(),
          name: file.name,
          rows: dataset.length,
          columns: headers.length,
          timestamp: new Date().toISOString(),
          type: "csv",
        };

        // Add at beginning
        recent.unshift(entry);

        // Limit to last 10 entries
        const limited = recent.slice(0, 10);

        localStorage.setItem("useclevr_recent", JSON.stringify(limited));

        router.push("/datasets/live");
      } catch (e) {
        setError("Could not process CSV file.");
      }
    };

    reader.readAsText(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function onFileSelect(e) {
    handleFile(e.target.files[0]);
  }

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold mb-6">
        Upload a{" "}
        <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent">
          CSV File
        </span>
      </h1>

      {/* DRAG & DROP */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer
          bg-white/5 dark:bg-[#0B0B12]/30 transition-all
          ${dragActive ? "border-cyan-400 shadow-[0_0_30px_rgba(0,255,255,0.5)]" : "border-gray-600"}
        `}
      >
        <label>
          <input type="file" className="hidden" accept=".csv" onChange={onFileSelect} />

          <div className="flex flex-col items-center space-y-4">
            <div className="bg-cyan-400/20 p-6 rounded-full shadow-[0_0_30px_rgba(0,255,255,0.3)]">
              <Upload size={40} className="text-cyan-300" />
            </div>

            <p className="text-xl text-gray-200 font-semibold">
              Drag & Drop your CSV here
            </p>
            <p className="text-gray-400">or click to upload</p>
          </div>
        </label>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-3 p-4 border border-red-500/40 bg-red-500/10 text-red-300 rounded-xl">
          <AlertTriangle />
          {error}
        </div>
      )}
    </div>
  );
}
