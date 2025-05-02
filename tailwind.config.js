/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // colors: {
      //   "black": "#110A02",
      //   "brown": "#1E1912",
      //   "cream": "#ECE2D8",
      //   "lightBrown": "#4C4138",
      // },
      //newColors: {
        // black: #000000
        // darkGrey: #131110
        // offWhite: #F1E9DA
        // white: "#FBF8F4",
      // }
    },
  },
  plugins: [],
};
