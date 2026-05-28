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
        beige: '#F3E8DB',
        black: '#0A0A0A',
        white: '#F3E8DB',
        accent: '#E86A17',
        orange: {
          500: '#E86A17',
        },
        ink: {
          primary: '#0A0A0A',
          secondary: '#2B2B2B',
          tertiary: '#6A625C',
        },
        bone: {
          primary: '#F3E8DB',
          secondary: '#CFC2B5',
          tertiary: '#8F8378',
        }
      },
      fontFamily: {
        sans: ['Druto', 'Inter', 'sans-serif'],
        serif: ['Apoc JP', 'Intermedial Slab', 'Playfair Display', 'serif'],
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
