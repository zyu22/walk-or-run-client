/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        paperlogy: ['Paperlogy-8ExtraBold', 'sans-serif'],
        gmarket: ['LeferiBaseType-RegularA', 'sans-serif'],
        Pretendard: ['Pretendard-Regular', 'sans-serif'],
        sans: ['Pretendard-Regular', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
