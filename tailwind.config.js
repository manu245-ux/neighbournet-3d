/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        status: {
          pending: '#eab308',
          approved: '#3b82f6',
          assigned: '#a855f7',
          progress: '#f97316',
          resolved: '#10b981',
          rejected: '#64748b'
        }
      }
    },
  },
  plugins: [],
}
