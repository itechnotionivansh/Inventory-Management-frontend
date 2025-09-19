/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
      extend: {
        colors: {
          primary: {
            900: '#3f4550', // (63,69,80)
            800: '#54546c', // (84,84,108)
            700: '#6e7684', // (110,118,132)
            400: '#a2aab5', // (162,170,181)
            200: '#c0c6cf', // (192,198,207)
          },
        },
      },
  },
  plugins: [],
};
