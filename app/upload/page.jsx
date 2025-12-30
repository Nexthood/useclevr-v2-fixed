"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load current user
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    }
    loadUser();
  }, []);

  async function upload() {
    if (!file) return setMessage("Bitte CSV auswählen");

    if (!user)
      return setMessage("Nicht eingeloggt – bitte erst Login durchführen.");

    setLoading(true);
    setMessage("");

    try {
      const form = new FormData();
      form.append("file", file);
      form.append("user_id", user.id);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });

      const data = await res.json();

      if (data.error) {
        setMessage("Fehler: " + data.error);
      } else {
        setMessage("Upload erfolgreich! Dataset gespeichert.");
      }
    } catch (err) {
      setMessage("Upload Fehler: " + err.message);
    }

    setLoading(false);
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-semibold">Upload CSV</h1>

      <div className="p-6 border rounded-xl bg-white/10 dark:bg-black/20 backdrop-blur-xl">
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-gray-300"
        />

        <button
          onClick={upload}
          className="mt-4 px-6 py-3 bg-black dark:bg-white dark:text-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {message && (
        <p className="text-lg font-medium text-blue-400 dark:text-green-400">
          {message}
        </p>
      )}
    </div>
  );
}
