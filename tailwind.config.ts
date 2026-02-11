import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: "#0f3c5d",
        accent: "#c99a2e"
      }
    }
  },
  plugins: []
};

export default config;
