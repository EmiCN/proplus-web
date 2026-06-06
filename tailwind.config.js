/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        principal: '#1B2E6B',
        secundario: '#0bba94',
        acento: '#E8B800',
      }
    },
  },
  plugins: [],
}