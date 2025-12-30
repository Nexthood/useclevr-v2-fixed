useEffect(() => {
  // If user already chose a theme → respect it
  const saved = localStorage.getItem("theme");
  if (saved) {
    document.documentElement.classList.toggle("dark", saved === "dark");
    setEnabled(saved === "dark");
    return;
  }

  // Else use system theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (prefersDark) {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    setEnabled(true);
  }
}, []);
