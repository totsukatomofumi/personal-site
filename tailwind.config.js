/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /* Color variables */
        "custom-grey": {
          light: "#9b9b9b",
          DEFAULT: "#808080",
        },
        "custom-blue": "#47d4ff",
        "custom-white": "#f5f5f5",
        "custom-black": {
          light: "#4e4e4e",
          DEFAULT: "#282828",
        },
      },
    },
  },
  plugins: [],
};
