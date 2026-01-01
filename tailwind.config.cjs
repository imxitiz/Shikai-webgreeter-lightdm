/**
 * Tailwind config for Shikai (v4)
 * Ensures Tailwind scans source files and generates utilities used in the app
 */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './public/**/*.{html,js}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Use class-based dark mode if needed; the theme switches via `html[data-theme]` in code
  // Tailwind doesn't support data-theme natively; we keep default 'class' but the app uses custom CSS vars
  darkMode: 'class',
};