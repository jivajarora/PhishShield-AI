/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#0d0d0d",
        primary: "#ef4444",
        secondary: "#6b7280",
        danger: "#ef4444",
        warning: "#f59e0b",
        safe: "#10b981",
        card: "#111111",
        'accent-border': "#1f2937"
      }
    },
  },
  plugins: [],
}
