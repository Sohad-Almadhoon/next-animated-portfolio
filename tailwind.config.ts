import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        main: "#008080",
        // One dark system for the whole site. Per-project colours live in
        // src/lib/portfolio.ts and stay inside the portfolio reel.
        ink: "#0b0b0e",      // page background
        surface: "#15151b",  // raised cards / form panels
        accent: "#7C93F5",   // links, active nav, primary buttons
        curtain: "#EDEAE3",  // page-transition wipe
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
