/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Dynamic color classes for stats
    'border-blue-500', 'border-green-500', 'border-orange-500', 'border-purple-500', 'border-red-500', 'border-yellow-500',
    'bg-blue-100', 'bg-green-100', 'bg-orange-100', 'bg-purple-100', 'bg-red-100', 'bg-yellow-100',
    'text-blue-600', 'text-green-600', 'text-orange-600', 'text-purple-600', 'text-red-600', 'text-yellow-600',
    // Additional color variations
    'border-gray-500', 'bg-gray-100', 'text-gray-600'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0ea5e9',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        orange: {
          DEFAULT: '#f97316',
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)',
        'gradient-bg': 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 50%, #1e3a8a 100%)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'bounce-gentle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}