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
    // Additional color variations for Transparansi Kebijakan page
    'bg-pink-100', 'text-pink-800', 'bg-sky-100', 'text-sky-800', 'bg-amber-100', 'text-amber-800',
    'border-gray-500', 'bg-gray-100', 'text-gray-600', 'text-blue-500', 'text-blue-800', 'text-yellow-800',
    // Background and text variations
    'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900', 'bg-green-600', 'bg-green-700',
    'hover:bg-blue-700', 'hover:bg-blue-900', 'hover:bg-green-700', 'hover:shadow-xl'
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
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float-slow 8s ease-in-out infinite',
        'float-tiny': 'float-tiny 10s ease-in-out infinite',
        'pulse-size': 'pulse-size 5s ease-in-out infinite alternate',
        'float-rotate': 'float-rotate 7s linear infinite',
        'float-rotate-slow': 'float-rotate-slow 10s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-10px) translateX(5px)' },
          '50%': { transform: 'translateY(10px) translateX(-5px)' },
          '75%': { transform: 'translateY(-5px) translateX(10px)' },
        },
        'float-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-8px) translateX(4px)' },
          '50%': { transform: 'translateY(8px) translateX(-4px)' },
          '75%': { transform: 'translateY(-4px) translateX(8px)' },
        },
        'float-tiny': {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-3px) translateX(2px)' },
          '50%': { transform: 'translateY(3px) translateX(-2px)' },
          '75%': { transform: 'translateY(-2px) translateX(3px)' },
        },
        'pulse-size': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        'float-rotate': {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-10px) translateX(5px) rotate(45deg)' },
          '50%': { transform: 'translateY(10px) translateX(-5px) rotate(90deg)' },
          '75%': { transform: 'translateY(-5px) translateX(10px) rotate(135deg)' },
        },
        'float-rotate-slow': {
          '0%, 100%': { transform: 'translateY(0) translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-8px) translateX(4px) rotate(30deg)' },
          '50%': { transform: 'translateY(8px) translateX(-4px) rotate(60deg)' },
          '75%': { transform: 'translateY(-4px) translateX(8px) rotate(90deg)' },
        },
      },
    },
  },
  plugins: [],
}