import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "oklch(var(--ink))",
        muted: "oklch(var(--muted))",
        paper: "oklch(var(--paper))",
        panel: "oklch(var(--panel))",
        line: "oklch(var(--line))",
        brand: "oklch(var(--brand))",
        brandSoft: "oklch(var(--brand-soft))",
        flame: "oklch(var(--flame))",
        rose: "oklch(var(--rose))",
        night: "oklch(var(--night))",
        cream: "oklch(var(--cream))",
        success: "oklch(var(--success))",
        warning: "oklch(var(--warning))",
        danger: "oklch(var(--danger))"
      },
      boxShadow: {
        panel: "0 18px 46px color-mix(in oklch, oklch(var(--night)) 10%, transparent)",
        brand: "0 16px 34px color-mix(in oklch, oklch(var(--rose)) 28%, transparent)"
      }
    }
  },
  plugins: []
};

export default config;
