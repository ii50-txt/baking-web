import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(-8%)' },
          '50%': { transform: 'translateY(0)' },
        }
      },
      animation: {
        'bounce-slow': 'bounceSlow 1.5s infinite ease-in-out',
      },
    },
  },
  plugins: [],
};
export default config;