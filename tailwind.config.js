/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      vt323: ["VT323", "serif"],
      cinzel: ["Cinzel", "serif"],
    },
    extend: {
      colors: {
        "custom-gold": "#d2c9a5",
        "custom-off-white": "#fff9e0",
        "custom-white": "#f7f7f7",
      },
    },
  },
  plugins: [],
};
