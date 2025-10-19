/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2C3E50", // dark blue
          light: "#34495E",
          dark: "#1A252F",
        },
        accent: {
          DEFAULT: "#E67E22", // orange
          light: "#F6B47B",
          dark: "#CA6F1E",
        },
        background: {
          DEFAULT: "#F4F6F8", // light gray
          dark: "#E5E8EB",
        },
        card: {
          DEFAULT: "#FFFFFF",
          dark: "#F8F9FA",
        },
        success: "#27AE60",
        error: "#C0392B",
      },
      boxShadow: {
        classic: "0 4px 24px 0 rgba(44, 62, 80, 0.08)",
        hover: "0 8px 32px 0 rgba(44, 62, 80, 0.16)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        classic: ["Inter", "Segoe UI", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
