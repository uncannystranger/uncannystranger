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
        beige: '#FBE9D0',
        black: '#244855',
        white: '#FBE9D0',
        accent: '#E64833',
        ink: {
          primary: '#244855',
          secondary: '#874F41',
          tertiary: '#90AEAD',
        },
        bone: {
          primary: '#FBE9D0',
          secondary: '#90AEAD',
          tertiary: '#874F41',
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
