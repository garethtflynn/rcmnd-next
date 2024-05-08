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
      //   "brown": "#1E1406",
      //   "cream": "#ECE2D8",
      //   "lightBrown": "#513C2C",
      //   "white": "#FBF8F4",
      // },
    },
  },
  plugins: [],
};
