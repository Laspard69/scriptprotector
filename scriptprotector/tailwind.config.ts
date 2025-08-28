import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#ff2d55",
          dark: "#0b0b0f"
        }
      },
      boxShadow: {
        glow: "0 0 40px rgba(255,45,85,.25)"
      }
    },
    fontFamily: {
      display: ['var(--font-spacegrotesk)'],
      mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
    }
  },
  plugins: []
} satisfies Config;
