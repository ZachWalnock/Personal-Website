import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        "mac-dark": "#1e1e1e",
        "mac-sidebar": "#2a2a2a",
        "mac-border": "#3a3a3a",
        "mac-text": "#e8e8e8",
        "mac-subtext": "#8a8a8a",
        "mac-accent": "#0a84ff",
        "mac-highlight": "#3a3a3a",
      },
    },
  },
  plugins: [],
};
export default config;
