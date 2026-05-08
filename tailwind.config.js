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
        beige: '#FDFCF0',
        accent: '#FF4D00',
        ink: {
          primary: '#1C1917',
          secondary: '#78716C',
          tertiary: '#A8A29E',
        },
        bone: {
          primary: '#FAF9F6',
          secondary: '#A8A29E',
          tertiary: '#78716C',
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
