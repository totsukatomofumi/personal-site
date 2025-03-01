/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    fontFamily: {
      vt323: ["VT323", "serif"],
      cinzel: ["Cinzel", "serif"],
      dotgothic16: ["DotGothic16", "sans-serif"],
      shingoregular: ["Shin Go Regular", "sans-serif"],
      baijamjuree: ["Bai Jamjuree", "sans-serif"],
      roboto: ["Roboto", "sans-serif"],
      dongle: ["Dongle", "sans-serif"],
      macondo: ["Macondo", "sans-serif"],
      oldenburg: ["Oldenburg", "serif"],
      jacquard12: ["Jacquard 12", "system-ui"],
      synemono: ["Syne Mono", "monospace"],
      syne: ["Syne", "sans-serif"],
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
