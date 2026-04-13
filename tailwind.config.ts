import type { Config } from "tailwindcss";

// In Tailwind v4, design tokens are defined via @theme in globals.css.
// This file handles content scanning and plugins only.
const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/hooks/**/*.{ts,tsx}",
  ],
  plugins: [],
};

export default config;
