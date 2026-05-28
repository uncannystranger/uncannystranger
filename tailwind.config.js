/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './App.tsx',
    './index.tsx',
    './components/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        beige: '#F3E9DC',
        black: '#2A1711',
        white: '#F3E9DC',
        accent: '#C08552',
        orange: {
          500: '#C08552',
        },
        ink: {
          primary: '#5E3023',
          secondary: '#895737',
          tertiary: '#DAB49D',
        },
        bone: {
          primary: '#F3E9DC',
          secondary: '#DAB49D',
          tertiary: '#895737',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      fontWeight: {
        light: '300',
        book: '400',
        medium: '500',
        bold: '700',
      },
      animation: {
        'fluid-fade': 'fluidFade 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
      keyframes: {
        fluidFade: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}
