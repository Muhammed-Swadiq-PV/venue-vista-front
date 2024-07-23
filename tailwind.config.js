/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'architects-daughter': ['"Architects Daughter"', 'cursive'],
      },
      colors:{
        customBlue: '#6464ED',
      },
    },
  },
  plugins: [],
}
