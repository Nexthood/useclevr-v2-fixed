/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx}",
    "./app/components/**/*.{js,jsx}",
    "./app/insights/**/*.{js,jsx}",
    "./app/datasets/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkbg: "#0B0B12",
      },
    },
  },
  plugins: [],
};
