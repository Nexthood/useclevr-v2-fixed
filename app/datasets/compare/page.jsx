"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CompareChart } from "@/components";

export default function ComparePage() {
  const [datasets, setDatasets] = useState([]);
  const [selectedA, setSelectedA] = useState("");
  const [selectedB, setSelectedB] = useState("");

  const [dataA, setDataA] = useState([]);
  const [dataB, setDataB] = useState([]);

  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Load dataset list
  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data } = await supabase
        .from("datasets")
        .select("*")
        .eq("user_id", user.id);

      setDatasets(data || []);
    }
    load();
  }, []);

  async function loadLocal(idA, idB) {
    const storedA = localStorage.getItem(`useclevr_dataset_${idA}`);
    const storedB = localStorage.getItem(`useclevr_dataset_${idB}`);

    if (storedA) setDataA(JSON.parse(storedA));
    if (storedB) setDataB(JSON.parse(storedB));
  }

  async function compare() {
    if (!selectedA || !selectedB || selectedA === selectedB) {
      alert("Please select two different datasets.");
      return;
    }

    setLoading(true);

    const dsA = datasets.find((d) => d.id === selectedA);
    const dsB = datasets.find((d) => d.id === selectedB);

    // Load from localStorage
    await loadLocal(selectedA, selectedB);

    // AI Compare
    const res = await fetch("/api/compare", {
      method: "POST",
      body: JSON.stringify({
        datasetA: dataA.slice(0, 200),
        datasetB: dataB.slice(0, 200),
        nameA: dsA.name,
        nameB: dsB.name,
      }),
    });

    const json = await res.json();
    setAnalysis(json.answer);

    setLoading(false);
  }

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-semibold">Compare Datasets</h1>
      <p className="text-gray-600">Select two datasets to compare.</p>

      {/* Selectors */}
      <div className="flex gap-6 flex-wrap">
        <select
          className="border p-3 rounded-lg"
          value={selectedA}
          onChange={(e) => setSelectedA(e.target.value)}
        >
          <option value="">Select Dataset A</option>
          {datasets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded-lg"
          value={selectedB}
          onChange={(e) => setSelectedB(e.target.value)}
        >
          <option value="">Select Dataset B</option>
          {datasets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>

        <button
          onClick={compare}
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800"
        >
          Compare
        </button>
      </div>

      {/* Chart */}
      {(dataA.length > 0 && dataB.length > 0) && (
        <CompareChart dataA={dataA} dataB={dataB} />
      )}

      {/* AI ANALYSIS RESULT */}
      {analysis && (
        <div className="p-6 bg-white border rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4">AI Comparison Result</h3>
          <pre className="whitespace-pre-line text-gray-800">{analysis}</pre>
        </div>
      )}

      {loading && <p className="text-gray-600">Analyzing...</p>}
    </div>
  );
}
