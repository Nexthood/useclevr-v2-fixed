"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileSidebar({ open, setOpen }) {
  const path = usePathname();

  const nav = [
    { name: "Dashboard", href: "/" },
    { name: "Upload CSV", href: "/upload" },
    { name: "Datasets", href: "/datasets" },
    { name: "AI Insights", href: "/datasets/live" },
    { name: "Explore Data", href: "/datasets/explorer" },
  ];

  function close() {
    setOpen(false);
  }

  // Close when route changes
  useEffect(() => {
    close();
  }, [path]);

  const isDark =
    typeof window !== "undefined" &&
    document.documentElement.classList.contains("dark");

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 p-6 bg-white dark:bg-[#0F0F12] border-r dark:border-gray-800 z-50 transform transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <img
          src={isDark ? "/UseClevrWhite.png" : "/UseClevrBlack.png"}
          alt="UseClevr"
          className="h-10 mb-8"
        />

        <nav className="space-y-3">
          {nav.map((item) => {
            const active = path === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 rounded-lg transition font-medium ${
                  active
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "hover:bg-gray-200 dark:hover:bg-gray-800"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
