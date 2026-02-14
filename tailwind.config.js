/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
    './shared/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4A90D9',
        secondary: '#F5A623',
        background: '#FFFFFF',
        surface: '#F8F9FA',
        text: {
          DEFAULT: '#1A1A1A',
          secondary: '#6B7280',
          tertiary: '#9CA3AF',
        },
        border: '#E5E7EB',
        error: '#EF4444',
        success: '#22C55E',
      },
    },
  },
  plugins: [],
};
