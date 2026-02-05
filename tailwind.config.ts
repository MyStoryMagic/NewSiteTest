import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sm: {
          navy: '#1a1a2e',
          'navy-dim': '#141422',
          'navy-xdim': '#0d0d18',
          charcoal: '#2d2d44',
          border: '#3d3d54',
          lavender: '#b8a9d9',
          cream: '#e8d5b7',
          gold: '#d4a574',
          green: '#7cb97c',
          white: '#f5f5f5',
          muted: '#a0a0a0',
        },
      },
      animation: {
        breathe: 'breathe 4s ease-in-out infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        breathe: { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.02)' } },
        fadeIn: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        pulseSoft: { '0%, 100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      },
    },
  },
  plugins: [],
};

export default config;
