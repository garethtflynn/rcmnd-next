/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      //newColors: {
        // black: #000000
        // darkGrey: #252220
        // offWhite: #F1E9DA
        // white: "#FBF8F4",
      // }
    },
  },
  plugins: [],
};
