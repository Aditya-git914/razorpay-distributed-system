/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        razorpay: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          500: '#0c66e4',
          600: '#0052cc',
          700: '#0c2340',
          800: '#081729',
          900: '#030b14',
          blue: '#0c2340',
          accent: '#3395ff',
          cyan: '#00d2ff',
          dark: '#081225',
          card: '#0f1f38'
        }
      }
    },
  },
  plugins: [],
}
