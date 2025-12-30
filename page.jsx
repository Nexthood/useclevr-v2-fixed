"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("useclevr_insights_notes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  function deleteNote(id) {
    const updated = notes.filter((n) => n.id !== id);
    setNotes(updated);
    localStorage.setItem("useclevr_insights_notes", JSON.stringify(updated));
  }

  if (notes.length === 0) {
    return (
      <div className="p-10">
        <h1 className="text-3xl font-bold mb-4">Saved Insights</h1>
        <p className="text-gray-500">No saved insights yet.</p>
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">Saved Insights</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {notes.map((note) => (
          <div
            key={note.id}
            className="p-6 bg-white dark:bg-neutral-900 border rounded-xl dark:border-gray-700 shadow hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">{note.title}</h2>
            <p className="text-gray-500 text-sm">{note.date}</p>

            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
              {note.text}
            </p>

            <div className="flex gap-4 mt-4">
              <Link
                href={`/insights/notes/${note.id}`}
                className="px-4 py-2 bg-black text-white rounded-lg"
              >
                Open
              </Link>

              <button
                onClick={() => deleteNote(note.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
