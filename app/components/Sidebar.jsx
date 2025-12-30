"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

import {
  X,
  ChevronDown,
  ChevronRight,
  Home,
  Database,
  BarChart2,
  FileText,
  Settings,
  User,
  CreditCard,
  LogOut,
  LayoutGrid
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const [mini, setMini] = useState(false);
  const [collapsed, setCollapsed] = useState({
    DATA: false,
    ANALYTICS: false,
    SYSTEM: false,
  });
  const [openUserMenu, setOpenUserMenu] = useState(false);

  // --- A6: Neon Trail Mouse Position ---
  const trailRef = useRef(null);

  useEffect(() => {
    function onMove(e) {
      if (!trailRef.current) return;
      const y = e.clientY;

      // set custom CSS variable for neon trail height
      trailRef.current.style.setProperty("--trail-y", `${y}px`);
    }

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // load states
  useEffect(() => {
    const savedMini = localStorage.getItem("useclevr_sidebar_mini");
    if (savedMini) setMini(savedMini === "true");

    const savedSections = localStorage.getItem("useclevr_sidebar_sections");
    if (savedSections) setCollapsed(JSON.parse(savedSections));
  }, []);

  function toggleSection(section) {
    const newState = { ...collapsed, [section]: !collapsed[section] };
    setCollapsed(newState);
    localStorage.setItem("useclevr_sidebar_sections", JSON.stringify(newState));
  }

  function toggleMini() {
    const newState = !mini;
    setMini(newState);
    localStorage.setItem("useclevr_sidebar_mini", newState);
  }

  const sections = [
    {
      title: "DATA",
      items: [
        { name: "Home", path: "/", icon: Home },
        { name: "Datasets", path: "/datasets", icon: Database }
      ],
    },
    {
      title: "ANALYTICS",
      items: [
        { name: "Insights", path: "/insights", icon: BarChart2 },
        { name: "Reports", path: "/reports", icon: FileText }
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { name: "Settings", path: "/settings", icon: Settings }
      ],
    }
  ];

  return (
    <>
      {/* BACKDROP MOBILE */}
      {isOpen && (
        <div
          className="
            fixed inset-0 bg-black/50 backdrop-blur-sm 
            z-40 md:hidden animate-fadeIn
          "
          onClick={onClose}
        />
      )}

      {/* SIDEBAR */}
      <aside
        ref={trailRef}
        className={`
          fixed md:static top-0 left-0 z-50 h-full

          /* Glasmorphism */
          bg-white/10 dark:bg-[#0B0B12]/30
          backdrop-blur-2xl

          /* Neon border */
          border-r-2 border-transparent
          bg-[linear-gradient(#0000,#0000),linear-gradient(135deg,#7845ff,#00eaff)]
          bg-origin-border bg-clip-padding

          /* Neon ambient glow */
          shadow-[0_0_25px_rgba(120,69,255,0.35)]
          dark:shadow-[0_0_30px_rgba(0,234,255,0.35)]

          /* A6: Neon Hover Trail (CSS variable controlled) */
          before:absolute before:inset-0 before:pointer-events-none
          before:bg-[radial-gradient(circle_at_50%_var(--trail-y),rgba(0,255,255,0.20),transparent_70%)]
          before:opacity-50 before:transition-opacity
          before:duration-300

          transition-all duration-500 ease-[cubic-bezier(.22,1.2,.34,1)]
          will-change-transform

          ${mini ? "w-16" : "w-64"}
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        onMouseEnter={() => mini && setMini(false)}
        onMouseLeave={() => (!isOpen ? setMini(true) : null)}
      >
        {/* MINI MODE BUTTON */}
        <button
          onClick={toggleMini}
          className="
            absolute right-2 top-3 p-2 rounded-lg 
            bg-white/10 hover:bg-white/20
            dark:bg-black/20 dark:hover:bg-black/40
            transition-all duration-300
            hover:scale-110 active:scale-95
          "
        >
          <LayoutGrid size={18} className="text-white/80" />
        </button>

        {/* CLOSE MOBILE */}
        <button className="md:hidden p-4 absolute right-0 top-0" onClick={onClose}>
          <X size={22} className="text-white" />
        </button>

        {/* LOGO */}
        <div className={`px-6 py-6 text-2xl font-bold tracking-tight transition-all ${mini ? "opacity-0" : "opacity-100"}`}>
          <span className="bg-gradient-to-r from-purple-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]">
            UseClevr
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="px-3 space-y-6 relative z-20">
          {sections.map((section) => (
            <div key={section.title}>
              {!mini && (
                <button
                  onClick={() => toggleSection(section.title)}
                  className="
                    flex items-center justify-between 
                    w-full px-2 py-2 text-xs font-semibold
                    text-gray-300 tracking-wider 
                    hover:text-white transition-all
                  "
                >
                  {section.title}
                  {collapsed[section.title] ? (
                    <ChevronRight size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )}
                </button>
              )}

              {/* SECTION ITEMS */}
              <div
                className={`
                  overflow-hidden transition-all duration-500
                  ${collapsed[section.title] && !mini ? "max-h-0 opacity-0" : "max-h-[500px] opacity-100"}
                `}
              >
                {section.items.map((item) => {
                  const active = pathname === item.path;
                  const Icon = item.icon;

                  return (
                    <div key={item.path} className="relative group">
                      <Link
                        href={item.path}
                        onClick={onClose}
                        className={`
                          flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                          transition-all duration-300

                          /* Neon Trail Icon Reflect */
                          group-hover:[filter:drop-shadow(0_0_10px_rgba(0,255,255,0.5))]

                          ${active
                            ? "bg-gradient-to-r from-purple-600 to-cyan-400 text-white shadow-[0_0_20px_rgba(0,255,255,0.6)] scale-[1.05]"
                            : "hover:bg-white/10 dark:hover:bg-black/30"
                          }
                        `}
                      >
                        {/* ICON */}
                        <Icon
                          size={20}
                          className="
                            text-gray-300
                            group-hover:text-cyan-300 
                            transition-all duration-300
                          "
                        />

                        {!mini && item.name}
                      </Link>

                      {/* TOOLTIP */}
                      {mini && (
                        <div
                          className="
                            absolute left-16 top-2 opacity-0 group-hover:opacity-100 
                            bg-black/80 text-white
                            text-xs py-1 px-3 rounded-lg
                            shadow-[0_0_15px_rgba(0,234,255,0.5)]
                            transition-all duration-200
                            translate-y-1 group-hover:-translate-y-0
                            whitespace-nowrap pointer-events-none
                          "
                        >
                          {item.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* USER FOOTER (HIDDEN IN MINI MODE) */}
        {!mini && (
          <div className="absolute bottom-4 left-0 w-full px-4 z-20">
            <div
              onClick={() => setOpenUserMenu(!openUserMenu)}
              className="
                flex items-center gap-3 p-3 rounded-lg cursor-pointer
                hover:bg-white/10 dark:hover:bg-black/30
                transition-all duration-300
              "
            >
              <img
                src="/avatar.png"
                className="w-10 h-10 rounded-full border border-cyan-400/40 shadow-[0_0_12px_rgba(0,255,255,0.5)]"
              />

              <div>
                <p className="text-sm font-semibold text-white">Csaba Sztoika</p>
                <p className="text-xs text-gray-400">Free plan</p>
              </div>

              <ChevronDown
                className={`ml-auto transition-transform duration-300 ${openUserMenu ? "rotate-180" : ""}`}
                size={16}
              />
            </div>

            {openUserMenu && (
              <div className="mt-2 bg-[#0A0A12]/95 rounded-lg shadow-xl border border-cyan-400/20 overflow-hidden animate-fadeIn">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/20 text-white text-sm">
                  <User size={16} /> Profile
                </Link>

                <Link href="/billing" className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/20 text-white text-sm">
                  <CreditCard size={16} /> Billing
                </Link>

                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 hover:bg-cyan-500/20 text-white text-sm">
                  <Settings size={16} /> Settings
                </Link>

                <button className="flex items-center gap-3 w-full text-left px-4 py-3 hover:bg-red-500/20 text-red-300 text-sm">
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
}
