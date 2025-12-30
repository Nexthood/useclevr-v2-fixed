"use client";

import Link from "next/link";
import { Home, Database, Upload, BarChart2, Moon, Sun } from "lucide-react";

export default function Sidebar({ theme, toggleTheme }) {
  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-card border-r border-card-border flex flex-col items-center py-6 space-y-8">
      {/* LOGO */}
      <img
        src={theme === "dark" ? "/assets/UseclevrWhite.png" : "/assets/UseclevrBlack.png"}
        className="h-10"
        alt="UseClevr Logo"
      />

      {/* NAVIGATION */}
      <nav className="flex flex-col items-center gap-6 text-foreground/80">
        <Link href="/dashboard" className="hover:text-foreground">
          <Home size={24} />
        </Link>

        <Link href="/datasets" className="hover:text-foreground">
          <Database size={24} />
        </Link>

        <Link href="/datasets/upload" className="hover:text-foreground">
          <Upload size={24} />
        </Link>

        <Link href="/datasets/live" className="hover:text-foreground">
          <BarChart2 size={24} />
        </Link>
      </nav>

      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        className="mt-auto mb-4 p-3 rounded-lg bg-card hover:bg-card-border transition"
      >
        {theme === "dark" ? <Sun size={22} /> : <Moon size={22} />}
      </button>
    </div>
  );
}
