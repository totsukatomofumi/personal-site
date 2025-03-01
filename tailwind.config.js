/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      vt323: ["VT323", "serif"],
      synemono: ["Syne Mono", "monospace"],
    },
    extend: {
      colors: {
        "custom-gold": "#d2c9a5",
        "custom-off-white": "#fff9e0",
        "custom-white": "#f7f7f7",
        "custom-dark-brown": "#3d331d",
      },
    },
  },
  plugins: [],
};
