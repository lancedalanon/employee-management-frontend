import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',
        error: '#B00020',
        background: '#FFFFFF',
        surface: '#FFFFFF',
        onbackground: '#000000',
        onsurface: '#000000',
      },
    },
  },
  plugins: [],
};

export default config;
