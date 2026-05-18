/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#f7f9fb',
        surface: '#ffffff',
        'surface-dim': '#d8dadc',
        primary: '#0f172a',
        secondary: '#3b82f6',
        tertiary: '#10b981',
        error: '#ba1a1a',
        outline: '#76777d',
        'outline-variant': '#c6c6cd',
        'on-surface': '#191c1e',
        'on-surface-variant': '#45464d',
        'on-primary': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Hanken Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'lg': '16px',
      },
      boxShadow: {
        'level-1': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'level-2': '0 8px 24px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
