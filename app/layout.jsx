"use client";

import "./globals.css";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

import Sidebar from "@/components/Sidebar.jsx";
import Navbar from "@/components/Navbar.jsx";

export default function RootLayout({ children }) {
  // Theme (light / dark)
  const [dark, setDark] = useState(false);

  // Sidebar (mobile)
  const [openSidebar, setOpenSidebar] = useState(false);

  // Load saved theme
  useEffect(() => {
    const saved = localStorage.getItem("useclevr_theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    const next = !dark;
    setDark(next);

    if (next) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("useclevr_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("useclevr_theme", "light");
    }
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-white dark:bg-[#0B0B12] text-black dark:text-white flex">
        
        {/* SIDEBAR */}
        <Sidebar
          theme={dark ? "dark" : "light"}
          toggleTheme={toggleTheme}
          isOpen={openSidebar}
          onClose={() => setOpenSidebar(false)}
        />

        {/* MAIN */}
        <div className="flex flex-col flex-1 min-h-screen">

          {/* NAVBAR */}
          <Navbar />

          {/* MOBILE MENU BUTTON */}
          <button
            className="md:hidden p-4"
            onClick={() => setOpenSidebar(true)}
          >
            <Menu size={24} />
          </button>

          {/* PAGE CONTENT */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>

      </body>
    </html>
  );
}
