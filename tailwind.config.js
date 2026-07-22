// Tailwind CSS 설정: 브랜드 primary 컬러 및 콘텐츠 경로
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js}'],
  theme: {
    extend: {
      colors: {
        primary: '#0066FF',
      },
    },
  },
  plugins: [],
}
