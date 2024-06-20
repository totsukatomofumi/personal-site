/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Color variables */
        "custom-grey": {
          light: "#d5d5d5",
          DEFAULT: "#bfbfbf",
          700: "#9b9b9b",
          dark: "#7e7e7e",
        },
        "custom-blue": {
          light: "#b5deef",
          DEFAULT: "#47d4ff",
        },
        "custom-white": "#f5f5f5",
        "custom-black": {
          light: "#4e4e4e",
          DEFAULT: "#282828",
        },
      },
      cursor: {
        default:
          "url(/src/assets/cursors/wii-cursor-by-stefano-tinaglia/Wii Cursor.cur), default",
      },
    },
  },
  plugins: [],
};
