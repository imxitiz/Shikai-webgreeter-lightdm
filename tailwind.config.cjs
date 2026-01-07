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
 darkMode: 'class',
};